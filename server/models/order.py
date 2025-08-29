from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class OrderItem(BaseModel):
    item_id: str
    name: str
    quantity: float
    price: float
    unit: str


class OrderBase(BaseModel):
    customer_id: str
    retailer_id: str
    items: List[OrderItem]
    total_amount: float
    payment_mode: str  # "prepaid" or "on-pickup"
    status: str = "Pending"  # Pending, Ready for Pickup, Completed, Payment Failed
    order_number: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class OrderCreate(BaseModel):
    retailer_id: str
    items: List[OrderItem]
    payment_mode: str  # "Prepaid" or "Pay on Pickup"
    customer_phone: str


class OrderOut(OrderBase):
    id: str = Field(default_factory=str, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
