from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv(override=True)

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["store-db"]

users_collection = db["users"]
item_collection = db["items"]
order_collection = db["orders"]  # For future use
