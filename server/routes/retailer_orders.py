from fastapi import APIRouter, HTTPException, Depends
from auth.utils import get_current_user
from database.mongo import db
from bson.objectid import ObjectId
from models.order import OrderOut
from fastapi import Body
from utils.sms import send_sms
from datetime import datetime, timedelta

router = APIRouter()
orders_collection = db["orders"]

@router.get("/orders", response_model=list[OrderOut])
async def get_retailer_orders(user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can view their orders.")

    orders = await orders_collection.find({"retailer_id": str(user["_id"])}).to_list(100)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders

@router.patch("/order/{order_id}")
async def update_order_status(order_id: str, status: str = Body(...), user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can update order status.")

    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order["retailer_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Unauthorized access to order.")

    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status}}
    )

    return {"message": f"Order status updated to {status}."}

@router.post("/retailer/order/{order_id}/ready")
async def mark_order_ready(order_id: str, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Unauthorized")

    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order["retailer_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Access denied.")

    if order["status"] != "Pending":
        raise HTTPException(status_code=400, detail="Only pending orders can be marked ready.")

    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "Ready for Pickup"}}
    )

    # Send SMS
    phone = order.get("customer_phone")
    if phone:
        msg = f"Your order {order['order_number']} is ready for pickup. Please show the order id at the shop. Thank You for choosing us! Have a great day ahead."
        send_sms(phone, msg)

    return {"message": "Order marked as ready and SMS sent."}

@router.get("/retailer/orders", response_model=list[OrderOut])
async def get_retailer_orders(user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can access this.")

    orders_cursor = orders_collection.find({"retailer_id": str(user["_id"])})
    orders = await orders_cursor.to_list(length=100)

    for order in orders:
        order["_id"] = str(order["_id"])
    return orders

@router.post("/retailer/order/{order_id}/complete")
async def mark_order_complete(order_id: str, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can complete orders.")

    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order["retailer_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="This order does not belong to you.")

    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "Completed"}}
    )

    return {"message": "Order marked as Completed."}

@router.get("/retailer/stale-orders")
async def get_stale_orders(user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can check orders.")

    two_hours_ago = datetime.utcnow() - timedelta(hours=2)

    cursor = orders_collection.find({
        "retailer_id": str(user["_id"]),
        "status": "Pending",
        "created_at": {"$lt": two_hours_ago}
    })

    stale_orders = await cursor.to_list(100)

    for order in stale_orders:
        order["_id"] = str(order["_id"])

    return stale_orders