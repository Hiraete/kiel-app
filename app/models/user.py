from datetime import datetime
from bson import ObjectId
from app.core.database import database

users_collection = database.users

async def create_user(user_data: dict) -> dict:
    user = await users_collection.insert_one(user_data)
    created_user = await users_collection.find_one({"_id": user.inserted_id})
    return created_user

async def get_user_by_email(email: str) -> dict:
    user = await users_collection.find_one({"email": email})
    return user

async def get_user_by_id(user_id: str) -> dict:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return user 