from fastapi import APIRouter, Depends, HTTPException
from database.mongo import db
from auth.utils import get_current_user
from datetime import datetime, timedelta
from bson.objectid import ObjectId

router = APIRouter()
orders_collection = db["orders"]

def is_completed(order):
    return order.get("status") == "Completed"

@router.get("/analytics")
async def get_analytics(user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can access analytics.")

    retailer_id = str(user["_id"])
    now = datetime.utcnow()
    week_start = now - timedelta(days=7)
    month_start = now.replace(day=1)

    orders = await orders_collection.find({"retailer_id": retailer_id, "status": "Completed"}).to_list(1000)

    weekly_sales = 0
    monthly_sales = 0
    order_count = 0

    for order in orders:
        created = order.get("created_at", now)
        if isinstance(created, str):
            created = datetime.fromisoformat(created)
        
        total = order.get("total_amount", 0)
        if created >= week_start:
            weekly_sales += total
        if created >= month_start:
            monthly_sales += total
        order_count += 1

    return {
        "weekly_sales": round(weekly_sales, 2),
        "monthly_sales": round(monthly_sales, 2),
        "completed_orders": order_count
    }
