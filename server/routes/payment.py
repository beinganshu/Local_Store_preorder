import razorpay
import os
from fastapi import APIRouter, Depends, HTTPException
from auth.utils import get_current_user
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class PaymentRequest(BaseModel):
    amount: float

@router.post("/create-razorpay-order")
async def create_razorpay_order(data: PaymentRequest, user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can make payments.")

    amount_paisa = int(data.amount * 100)

    try:
        razorpay_order = client.order.create({
            "amount": amount_paisa,
            "currency": "INR",
            "payment_capture": 1
        })
        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "razorpay_key_id": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
