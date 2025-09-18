export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface AddressData {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  countryCode: string;
}

export interface GeolocationError {
  code: number;
  message: string;
}

class GeolocationService {
  private watchId: number | null = null;
  private isSupported: boolean = "geolocation" in navigator;

  // Verificar si la geolocalización está soportada
  isGeolocationSupported(): boolean {
    return this.isSupported;
  }

  // Obtener ubicación actual
  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject({
          code: 0,
          message: "Geolocalización no soportada por este navegador",
        });
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(this.mapGeolocationError(error));
        },
        options
      );
    });
  }

  // Observar cambios en la ubicación
  watchPosition(
    onSuccess: (location: LocationData) => void,
    onError: (error: GeolocationError) => void,
    options?: PositionOptions
  ): number {
    if (!this.isSupported) {
      onError({
        code: 0,
        message: "Geolocalización no soportada por este navegador",
      });
      return -1;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        onError(this.mapGeolocationError(error));
      },
      { ...defaultOptions, ...options }
    );

    return this.watchId;
  }

  // Detener observación de ubicación
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Obtener dirección a partir de coordenadas (Geocoding)
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<AddressData> {
    try {
      // Usar la API de geocoding del navegador si está disponible
      if ("geolocation" in navigator && "geocoder" in window) {
        return this.geocodeCoordinates(latitude, longitude);
      }

      // Fallback: usar una API externa (OpenStreetMap Nominatim)
      return this.geocodeWithNominatim(latitude, longitude);
    } catch (error) {
      throw new Error("Error al obtener la dirección");
    }
  }

  // Obtener coordenadas a partir de una dirección (Reverse Geocoding)
  async getCoordinatesFromAddress(address: string): Promise<LocationData> {
    try {
      // Usar la API de geocoding del navegador si está disponible
      if ("geolocation" in navigator && "geocoder" in window) {
        return this.geocodeAddress(address);
      }

      // Fallback: usar una API externa (OpenStreetMap Nominatim)
      return this.geocodeAddressWithNominatim(address);
    } catch (error) {
      throw new Error("Error al obtener las coordenadas");
    }
  }

  // Calcular distancia entre dos puntos (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros
    return distance;
  }

  // Verificar si el usuario está en un área específica
  isUserInArea(
    userLat: number,
    userLon: number,
    areaLat: number,
    areaLon: number,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, areaLat, areaLon);
    return distance <= radiusKm;
  }

  // Obtener ubicación con permisos
  async requestLocationPermission(): Promise<LocationData> {
    try {
      // Verificar permisos si están disponibles
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (permission.state === "denied") {
          throw {
            code: 1,
            message: "Permisos de geolocalización denegados",
          };
        }
      }

      return await this.getCurrentPosition();
    } catch (error) {
      throw error;
    }
  }

  // Obtener información de zona horaria
  async getTimezone(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener zona horaria");
      }

      const data = await response.json();
      return data.zoneName;
    } catch (error) {
      // Fallback: usar zona horaria del navegador
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  // Geocoding usando API del navegador
  private async geocodeCoordinates(
    latitude: number,
    longitude: number
  ): Promise<AddressData> {
    return new Promise((resolve, reject) => {
      const geocoder = new (window as any).google.maps.Geocoder();
      const latlng = new (window as any).google.maps.LatLng(
        latitude,
        longitude
      );

      geocoder.geocode(
        { location: latlng },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const result = results[0];
            resolve({
              address: result.formatted_address,
              city:
                this.extractComponent(result, "locality") ||
                this.extractComponent(result, "administrative_area_level_2"),
              state: this.extractComponent(
                result,
                "administrative_area_level_1"
              ),
              country: this.extractComponent(result, "country"),
              postalCode: this.extractComponent(result, "postal_code"),
              countryCode: this.extractComponent(
                result,
                "country",
                "short_name"
              ),
            });
          } else {
            reject(new Error("Error en geocoding"));
          }
        }
      );
    });
  }

  // Geocoding usando OpenStreetMap Nominatim
  private async geocodeWithNominatim(
    latitude: number,
    longitude: number
  ): Promise<AddressData> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Error en geocoding");
      }

      const data = await response.json();
      const address = data.address;

      return {
        address: data.display_name,
        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality,
        state: address.state || address.province,
        country: address.country,
        postalCode: address.postcode,
        countryCode: address.country_code?.toUpperCase(),
      };
    } catch (error) {
      throw new Error("Error al obtener la dirección");
    }
  }

  // Reverse geocoding usando API del navegador
  private async geocodeAddress(address: string): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      const geocoder = new (window as any).google.maps.Geocoder();

      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            accuracy: 0,
            timestamp: Date.now(),
          });
        } else {
          reject(new Error("Error en reverse geocoding"));
        }
      });
    });
  }

  // Reverse geocoding usando OpenStreetMap Nominatim
  private async geocodeAddressWithNominatim(
    address: string
  ): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Error en reverse geocoding");
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Dirección no encontrada");
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        accuracy: 0,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error("Error al obtener las coordenadas");
    }
  }

  // Extraer componente de resultado de geocoding
  private extractComponent(
    result: any,
    type: string,
    nameType: string = "long_name"
  ): string {
    const component = result.address_components.find((comp: any) =>
      comp.types.includes(type)
    );
    return component ? component[nameType] : "";
  }

  // Convertir grados a radianes
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Mapear errores de geolocalización
  private mapGeolocationError(
    error: GeolocationPositionError
  ): GeolocationError {
    const errorMessages: { [key: number]: string } = {
      1: "Permisos de geolocalización denegados",
      2: "Ubicación no disponible",
      3: "Tiempo de espera agotado",
    };

    return {
      code: error.code,
      message:
        errorMessages[error.code] || "Error desconocido de geolocalización",
    };
  }
}

// Instancia singleton del servicio
export const geolocationService = new GeolocationService();
export default geolocationService;

