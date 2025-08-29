from fastapi import FastAPI
from routes.auth import auth_router
from fastapi.middleware.cors import CORSMiddleware
from routes import customer_order
from routes import retailer_orders
from routes import retailer_items
from routes import retailer_analytics
from routes import payment

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router, prefix="/auth")
app.include_router(customer_order.router, prefix="/customer", tags=["Customer Orders"])
app.include_router(retailer_items.router)
app.include_router(retailer_orders.router)
app.include_router(retailer_analytics.router, prefix="/retailer", tags=["Retailer Analytics"])
app.include_router(payment.router)