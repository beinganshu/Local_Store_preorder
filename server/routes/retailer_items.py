from fastapi import FastAPI, HTTPException, APIRouter, Depends
from models.item import ItemCreate, ItemOut
from auth.utils import get_current_user
from pydantic import BaseModel
from datetime import datetime
from database.item import add_item, get_items_by_retailer, update_item
from bson import ObjectId
from database.mongo import item_collection  # ✅ Add this import

router = APIRouter(prefix="/retailer/items")

class RestockData(BaseModel):
    quantity: float

@router.post("/", response_model=ItemOut)
async def create_item(item: ItemCreate, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Unauthorized")
    item.retailer_id = str(user["_id"])
    return await add_item(item)

@router.post("/restock/{item_id}")
async def restock_item(item_id: str, data: RestockData, user=Depends(get_current_user)):  # ✅ Fixed parameter
    item = await item_collection.find_one({"_id": ObjectId(item_id)})

    if not item or item["retailer_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Unauthorized or item not found")

    new_quantity = data.quantity
    await item_collection.update_one(
        {"_id": ObjectId(item_id)},
        {
            "$set": {
                "quantity_available": new_quantity,
                "sold_today": 0,
                "last_restock_time": datetime.utcnow().isoformat()
            }
        }
    )
    return {"message": "Item restocked successfully."}

@router.get("/", response_model=list[ItemOut])
async def list_items(user=Depends(get_current_user)):
    return await get_items_by_retailer(str(user["_id"]))

@router.patch("/{item_id}")
async def patch_item(item_id: str, updates: dict, user=Depends(get_current_user)):
    return await update_item(item_id, updates)
