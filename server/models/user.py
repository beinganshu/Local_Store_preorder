from pydantic import BaseModel, EmailStr
from typing import Literal

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["customer", "retailer"]

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
