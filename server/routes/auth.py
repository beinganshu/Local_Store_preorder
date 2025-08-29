from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin, UserOut
from auth.jwt_handler import create_access_token
from auth.utils import hash_password, verify_password, get_current_user
from database.mongo import users_collection
from bson import ObjectId

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_pw
    res = await users_collection.insert_one(user_dict)
    return UserOut(id=str(res.inserted_id), name=user.name, email=user.email, role=user.role)

@auth_router.post("/login")
async def login(creds: UserLogin):
    user = await users_collection.find_one({"email": creds.email})
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}

@auth_router.get("/me")
async def get_current_user_info(user=Depends(get_current_user)):
    return user

@auth_router.get("/retailers")
async def get_all_retailers():
    retailers = await users_collection.find({"role": "retailer"}).to_list(length=100)
    # Convert ObjectIds to strings
    for retailer in retailers:
        retailer["_id"] = str(retailer["_id"])
        retailer.pop("password", None)  # Remove password if present
    return retailers