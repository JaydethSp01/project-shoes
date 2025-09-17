import { useState, useEffect, useCallback } from "react";
import {
  LocationData,
  AddressData,
  GeolocationError,
  geolocationService,
} from "../services/GeolocationService";

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

interface UseGeolocationReturn {
  location: LocationData | null;
  address: AddressData | null;
  error: GeolocationError | null;
  loading: boolean;
  isSupported: boolean;
  getCurrentLocation: () => Promise<void>;
  watchLocation: () => void;
  stopWatching: () => void;
  getAddressFromLocation: (lat: number, lng: number) => Promise<void>;
  clearError: () => void;
}

export const useGeolocation = (
  options: UseGeolocationOptions = {}
): UseGeolocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSupported] = useState(geolocationService.isGeolocationSupported());

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000,
    watch = false,
  } = options;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!isSupported) {
      setError({
        code: 0,
        message: "Geolocalización no soportada por este navegador",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentLocation = await geolocationService.getCurrentPosition();
      setLocation(currentLocation);
    } catch (err) {
      setError(err as GeolocationError);
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const watchLocation = useCallback(() => {
    if (!isSupported) {
      setError({
        code: 0,
        message: "Geolocalización no soportada por este navegador",
      });
      return;
    }

    const watchOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    geolocationService.watchPosition(
      (newLocation) => {
        setLocation(newLocation);
        setError(null);
      },
      (err) => {
        setError(err);
      },
      watchOptions
    );
  }, [isSupported, enableHighAccuracy, timeout, maximumAge]);

  const stopWatching = useCallback(() => {
    geolocationService.clearWatch();
  }, []);

  const getAddressFromLocation = useCallback(
    async (lat: number, lng: number) => {
      try {
        setLoading(true);
        setError(null);
        const addressData = await geolocationService.getAddressFromCoordinates(
          lat,
          lng
        );
        setAddress(addressData);
      } catch (err) {
        setError({
          code: 0,
          message: "Error al obtener la dirección",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Efecto para obtener ubicación automáticamente si watch está habilitado
  useEffect(() => {
    if (watch && isSupported) {
      watchLocation();
      return () => {
        stopWatching();
      };
    }
  }, [watch, isSupported, watchLocation, stopWatching]);

  return {
    location,
    address,
    error,
    loading,
    isSupported,
    getCurrentLocation,
    watchLocation,
    stopWatching,
    getAddressFromLocation,
    clearError,
  };
};

// Hook para obtener ubicación una sola vez
export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSupported] = useState(geolocationService.isGeolocationSupported());

  const getLocation = useCallback(async () => {
    if (!isSupported) {
      setError({
        code: 0,
        message: "Geolocalización no soportada por este navegador",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentLocation = await geolocationService.getCurrentPosition();
      setLocation(currentLocation);
    } catch (err) {
      setError(err as GeolocationError);
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  return {
    location,
    error,
    loading,
    isSupported,
    getLocation,
  };
};

// Hook para verificar si el usuario está en un área específica
export const useLocationInArea = (
  areaLat: number,
  areaLon: number,
  radiusKm: number
) => {
  const { location } = useGeolocation({ watch: true });
  const [isInArea, setIsInArea] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (location) {
      const userDistance = geolocationService.calculateDistance(
        location.latitude,
        location.longitude,
        areaLat,
        areaLon
      );

      setDistance(userDistance);
      setIsInArea(userDistance <= radiusKm);
    }
  }, [location, areaLat, areaLon, radiusKm]);

  return {
    isInArea,
    distance,
    location,
  };
};

// Hook para obtener tiendas cercanas
export const useNearbyStores = (userLocation: LocationData | null) => {
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearbyStores = useCallback(
    async (radiusKm: number = 10) => {
      if (!userLocation) {
        setError("Ubicación del usuario no disponible");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simular búsqueda de tiendas cercanas
        // En una implementación real, esto haría una llamada a la API
        const mockStores = [
          {
            id: 1,
            name: "Tekashi Shoes Centro",
            address: "Calle 123 #45-67, Bogotá",
            latitude: userLocation.latitude + 0.01,
            longitude: userLocation.longitude + 0.01,
            distance: geolocationService.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              userLocation.latitude + 0.01,
              userLocation.longitude + 0.01
            ),
            phone: "+57 1 234 5678",
            hours: "Lun-Vie: 9:00-19:00, Sáb: 9:00-17:00",
          },
          {
            id: 2,
            name: "Tekashi Shoes Norte",
            address: "Carrera 45 #78-90, Bogotá",
            latitude: userLocation.latitude - 0.02,
            longitude: userLocation.longitude + 0.015,
            distance: geolocationService.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              userLocation.latitude - 0.02,
              userLocation.longitude + 0.015
            ),
            phone: "+57 1 234 5679",
            hours: "Lun-Vie: 9:00-19:00, Sáb: 9:00-17:00",
          },
        ];

        // Filtrar tiendas dentro del radio especificado
        const storesInRadius = mockStores.filter(
          (store) => store.distance <= radiusKm
        );

        // Ordenar por distancia
        storesInRadius.sort((a, b) => a.distance - b.distance);

        setNearbyStores(storesInRadius);
      } catch (err) {
        setError("Error al buscar tiendas cercanas");
      } finally {
        setLoading(false);
      }
    },
    [userLocation]
  );

  return {
    nearbyStores,
    loading,
    error,
    findNearbyStores,
  };
};
