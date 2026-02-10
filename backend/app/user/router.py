from fastapi import APIRouter, Depends
from app.user.service import create_user, save_route
from app.user.schemas import UserCreate, SavedRoute

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    """Create new user account"""
    return await create_user(user)

@router.post("/routes/save")
async def save_user_route(route: SavedRoute):
    """Save a route to user's favorites"""
    return await save_route(route)