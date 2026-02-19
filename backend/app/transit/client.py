import httpx
import os

BASE_URL = "https://transit.land/api/v2/rest"
API_KEY = os.getenv("TRANSITLAND_API_KEY")

# Greater Seattle bounding box
SEATTLE_BBOX = "-122.6,47.4,-121.9,47.9"
KING_COUNTY_AGENCY = "o-c23nb-kingcountymetro"  # Transitland operator ID

def _headers():
    return {"apikey": API_KEY}

async def get_agencies():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE_URL}/agencies",
            headers=_headers(),
            params={"bbox": SEATTLE_BBOX, "limit": 20}
        )
        r.raise_for_status()
        return r.json()

async def get_routes(agency_id: str = KING_COUNTY_AGENCY):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE_URL}/routes",
            headers=_headers(),
            params={"operator_onestop_id": agency_id, "limit": 500}
        )
        r.raise_for_status()
        return r.json()

async def get_route_detail(route_id: str):
    async with httpx.AsyncClient() as client:
        # Get route shape + stops
        r = await client.get(
            f"{BASE_URL}/routes/{route_id}",
            headers=_headers(),
            params={"include_geometry": "true"}
        )
        r.raise_for_status()
        route = r.json()

        # Get stops for this route
        stops_r = await client.get(
            f"{BASE_URL}/stops",
            headers=_headers(),
            params={"served_by_onestop_ids": route_id, "limit": 500}
        )
        stops_r.raise_for_status()
        route["stops"] = stops_r.json().get("stops", [])
        return route

async def get_stops_near(lat: float, lng: float, radius: int = 400):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE_URL}/stops",
            headers=_headers(),
            params={
                "lat": lat,
                "lon": lng,
                "radius": radius,  # meters
                "limit": 20
            }
        )
        r.raise_for_status()
        return r.json()

async def get_departures(stop_id: str):
    """Get upcoming departures for a stop."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{BASE_URL}/departures",
            headers=_headers(),
            params={"stop_id": stop_id, "limit": 20}
        )
        r.raise_for_status()
        return r.json()