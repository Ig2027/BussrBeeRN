const API_BASE_URL = 'http://sample/api';

export const getRoutes = async () => {
    const response = await fetch('${API_BASE_URL}/routes');
    if (!response.ok) throw new Error('Failed to fetch route details');
    return response.json();
};

export const getRoutesDetails = async (routeId: string) => {
    const response = await fetch('${API_BASE_URL}/routes/${routeId}');
    if (!response.ok) throw new Error('Failed to fetch route details');
    return response.json();
};

export const getNearbyStops = async (lat: number, lng: number) => {
    const response = await fetch('${API_BASE_URL}/stops/near?Lat=${lat}&lng=${lng}');
    if (!response.ok) throw new Error('Failed to fetch stops');
    return response.json();
};

export const getVehicles = async (routeId: string) => {
    const response = await fetch('${API_BASE_URL}/vehicles?routeId=${routeId}');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
};