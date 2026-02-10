async def get_routes(lat: float, lon: float, radius: int):
    """Get transit routes near a location from Transitland"""
    # TODO: Implement Transitland API integration
    return {
        "routes": [],
        "message": "Transit routes will be fetched here"
    }

async def get_stop_times(stop_id: str):
    """Get arrival times for a stop"""
    # TODO: Implement Transitland API integration
    return {
        "stop_id": stop_id,
        "arrivals": [],
        "message": "Stop times will be fetched here"
    }