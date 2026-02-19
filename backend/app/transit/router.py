from fastapi import APIRouter, HTTPException, Query
from . import client, cache

router = APIRouter(prefix="/api", tags=["transit"])


@router.get("/region/summary")
async def region_summary():
    """Which agencies are available in Greater Seattle."""
    cached = cache.get("agencies")
    if cached:
        return cached

    data = await client.get_agencies()
    agencies = [
        {
            "id": a.get("onestop_id"),
            "name": a.get("agency_name"),
            "url": a.get("agency_url"),
        }
        for a in data.get("agencies", [])
    ]
    result = {"agencies": agencies}
    cache.set("agencies", result, ttl_seconds=86400)  # cache 24hr
    return result


@router.get("/routes")
async def list_routes():
    """List of all routes with id, name, color."""
    cached = cache.get("routes")
    if cached:
        return cached

    data = await client.get_routes()
    routes = [
        {
            "id": r.get("onestop_id"),
            "short_name": r.get("route_short_name"),  # e.g. "44", "Link"
            "long_name": r.get("route_long_name"),
            "color": r.get("route_color") or "0070B9",
            "text_color": r.get("route_text_color") or "FFFFFF",
            "type": r.get("route_type"),  # 3=bus, 1=subway, 2=rail
        }
        for r in data.get("routes", [])
    ]
    result = {"routes": routes}
    cache.set("routes", result, ttl_seconds=86400)
    return result


@router.get("/routes/{route_id}")
async def route_detail(route_id: str):
    """Shape geometry + stops for a specific route."""
    cache_key = f"route_{route_id}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        data = await client.get_route_detail(route_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Route not found: {e}")

    result = {
        "id": data.get("onestop_id"),
        "short_name": data.get("route_short_name"),
        "long_name": data.get("route_long_name"),
        "color": data.get("route_color") or "0070B9",
        "geometry": data.get("geometry"),  # GeoJSON LineString
        "stops": [
            {
                "id": s.get("onestop_id"),
                "name": s.get("stop_name"),
                "lat": s.get("geometry", {}).get("coordinates", [None, None])[1],
                "lng": s.get("geometry", {}).get("coordinates", [None, None])[0],
            }
            for s in data.get("stops", [])
        ],
    }
    cache.set(cache_key, result, ttl_seconds=3600)
    return result


@router.get("/stops/near")
async def stops_near(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(400, description="Radius in meters"),
):
    """Nearest bus stops to a lat/lng coordinate."""
    try:
        data = await client.get_stops_near(lat, lng, radius)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    stops = [
        {
            "id": s.get("onestop_id"),
            "name": s.get("stop_name"),
            "lat": s.get("geometry", {}).get("coordinates", [None, None])[1],
            "lng": s.get("geometry", {}).get("coordinates", [None, None])[0],
            "routes": s.get("routes", []),
        }
        for s in data.get("stops", [])
    ]
    return {"stops": stops}


@router.get("/stops/{stop_id}/departures")
async def stop_departures(stop_id: str):
    """Upcoming departures from a specific stop."""
    try:
        data = await client.get_departures(stop_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    departures = [
        {
            "route": d.get("route", {}).get("route_short_name"),
            "headsign": d.get("trip", {}).get("trip_headsign"),  # e.g. "Downtown Seattle"
            "departure_time": d.get("departure_time"),
            "realtime": d.get("is_realtime", False),
        }
        for d in data.get("departures", [])
    ]
    return {"departures": departures}