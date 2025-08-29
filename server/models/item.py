from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class ItemBase(BaseModel):
    name: str
    unit: str
    price: float
    quantity_available: float
    total_sold: float = 0
    retailer_id: Optional[str] = None
    sold_today: float = 0
    last_restock_time: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemOut(ItemBase):
    id: str = Field(default_factory=str, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
