from bson.objectid import ObjectId
from database.mongo import item_collection   
from models.item import ItemCreate           

# Add a new item
async def add_item(item: ItemCreate):
    item_dict = item.dict()
    res = await item_collection.insert_one(item_dict)
    item_dict["_id"] = str(res.inserted_id)  # Convert ObjectId to string
    return item_dict

# Get items by retailer
async def get_items_by_retailer(retailer_id: str):
    items = await item_collection.find({"retailer_id": retailer_id}).to_list(100)
    for item in items:
        item["_id"] = str(item["_id"])       # Convert for JSON serializability
    return items

# Update item
async def update_item(item_id: str, updates: dict):
    await item_collection.update_one(
        {"_id": ObjectId(item_id)},          # ObjectId required for querying
        {"$set": updates}
    )
