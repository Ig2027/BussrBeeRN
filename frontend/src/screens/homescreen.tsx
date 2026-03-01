import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getRoutes, getRouteDetails, getNearbyStops, getVehicles } from '../services/api';

interface Route {
  id: string;
  name: string;
  color: string;
}

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Vehicle {
  id: string;
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routePolyline, setRoutePolyline] = useState<any[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      loadVehicles(selectedRoute);
      const interval = setInterval(() => {
        loadVehicles(selectedRoute);
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  const loadRoutes = async () => {
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Failed to load routes', error);
    }
  };

  const loadRouteDetails = async (routeId: string) => {
    setLoading(true);
    try {
      const data = await getRouteDetails(routeId);
      setRoutePolyline(data.shape || []);
      setStops(data.stops || []);
      setSelectedRoute(routeId);

      if (data.shape && data.shape.length > 0) {
        mapRef.current?.fitToCoordinates(data.shape, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      }
    } catch (error) {
      console.error('Failed to load route details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async (routeId: string) => {
    try {
      const data = await getVehicles(routeId);
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    }
  };

  const centerOnUserLocation = async () => {
    mapRef.current?.animateToRegion({
      latitude: 47.6062,
      longitude: -122.3321,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    try {
      const nearbyStops = await getNearbyStops(47.6062, -122.3321);
      console.log('Nearby Stops', nearbyStops);
    } catch (error) {
      console.error('Failed to load nearby stops:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 47.6062,
          longitude: -122.3321,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        {routePolyline.length > 0 && (
          <Polyline
            coordinates={routePolyline}
            strokeColor="#0066FF"
            strokeWidth={4}
          />
        )}

        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name}
            pinColor="red"
          />
        ))}

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
            }}
            pinColor="blue"
            title="Bus"
          />
        ))}
      </MapView>

      <View style={styles.routeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeChip,
                selectedRoute === route.id && styles.routeChipSelected,
              ]}
              onPress={() => loadRouteDetails(route.id)}
            >
              <Text
                style={[
                  styles.routeChipText,
                  selectedRoute === route.id && styles.routeChipTextSelected,
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={centerOnUserLocation}
      >
        <Text style={styles.locationButtonText}>📍</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  routeSelector: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  routeChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  routeChipSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  routeChipText: {
    color: '#333',
    fontWeight: '600',
  },
  routeChipTextSelected: {
    color: '#000',
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});