from fastapi import APIRouter, HTTPException
from app.transit.service import get_routes, get_stop_times

router = APIRouter()

@router.get("/routes")
async def fetch_routes(lat: float, lon: float, radius: int = 1000):
    """Get transit routes near a location"""
    routes = await get_routes(lat, lon, radius)
    return routes

@router.get("/stops/{stop_id}")
async def fetch_stop_times(stop_id: str):
    """Get arrival times for a stop"""
    times = await get_stop_times(stop_id)
    return times