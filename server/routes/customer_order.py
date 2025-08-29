from fastapi import APIRouter, HTTPException, Depends
from models.order import OrderCreate, OrderOut
from models.item import ItemOut
from database.mongo import db
from bson.objectid import ObjectId
from auth.utils import get_current_user
from datetime import datetime
import random
import string

router = APIRouter()
orders_collection = db["orders"]
items_collection = db["items"]

def generate_order_number():
    return "ORD" + ''.join(random.choices(string.digits, k=6))

@router.get("/items/{retailer_id}")
async def get_items_by_retailer(retailer_id: str, user=Depends(get_current_user)):
    items = await items_collection.find({"retailer_id": retailer_id}).to_list(100)
    for item in items:
        item["_id"] = str(item["_id"])
    return items

@router.post("/place-order", response_model=OrderOut)
async def place_order(order: OrderCreate, user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can place orders.")

    for item in order.items:
        db_item = await items_collection.find_one({"_id": ObjectId(item.item_id)})
        if not db_item:
            raise HTTPException(status_code=404, detail=f"Item {item.name} not found.")
        
        available = db_item["quantity_available"] - db_item["sold_today"]
        if item.quantity > available:
            raise HTTPException(status_code=400, detail=f"{item.name}: Only {available} {item.unit} left.")

    # Generate final order dict
    order_dict = order.dict()
    order_dict["customer_id"] = str(user["_id"])
    order_dict["order_number"] = generate_order_number()
    order_dict["total_amount"] = sum(item.price * item.quantity for item in order.items)
    order_dict["status"] = "Pending"
    order_dict["created_at"] = datetime.utcnow()

    res = await orders_collection.insert_one(order_dict)

    for item in order.items:
        await items_collection.update_one(
            {"_id": ObjectId(item.item_id)},
            {"$inc": {"sold_today": item.quantity, "total_sold": item.quantity}}
        )

    order_dict["_id"] = str(res.inserted_id)
    return order_dict

@router.get("/orders", response_model=list[OrderOut])
async def get_customer_orders(user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can view orders.")

    orders_cursor = orders_collection.find({"customer_id": str(user["_id"])})
    orders = await orders_cursor.to_list(length=100)

    for order in orders:
        order["_id"] = str(order["_id"])

    return orders
@router.delete("/cancel-order/{order_id}")
async def cancel_order(order_id: str, user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Unauthorized")

    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order["customer_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    if order["status"] != "Pending":
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")

    for item in order["items"]:
        await items_collection.update_one(
            {"_id": ObjectId(item["item_id"])},
            {"$inc": {"quantity_available": item["quantity"]}}
        )

    # Step 2: Mark order as cancelled
    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "Cancelled"}}
    )
    return {"message": "Order cancelled successfully"}