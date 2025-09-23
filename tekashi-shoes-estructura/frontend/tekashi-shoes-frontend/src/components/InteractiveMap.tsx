import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt, FaSearch, FaCrosshairs, FaCheck } from "react-icons/fa";
import { useGeolocation } from "../hooks/useGeolocation";
import "../styles/InteractiveMap.css";

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface InteractiveMapProps {
  onLocationSelect: (location: MapLocation) => void;
  initialLocation?: MapLocation;
  height?: string;
  className?: string;
}

// Componente para manejar eventos del mapa
const MapEvents: React.FC<{
  onLocationSelect: (location: MapLocation) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      // Obtener dirección automáticamente al hacer clic
      try {
        // Agregar delay para evitar rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
          {
            headers: {
              "User-Agent": "TekashiShoes/1.0 (contact@tekashishoes.com)",
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const address =
            data.display_name ||
            `Ubicación: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationSelect({ lat, lng, address });
        } else {
          onLocationSelect({
            lat,
            lng,
            address: `Ubicación: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          });
        }
      } catch (error) {
        console.error("Error obteniendo dirección:", error);
        onLocationSelect({
          lat,
          lng,
          address: `Ubicación: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      }
    },
  });
  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onLocationSelect,
  initialLocation,
  height = "400px",
  className = "",
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    initialLocation || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([4.6097, -74.0817]); // Bogotá por defecto
  const mapRef = useRef<L.Map>(null);

  const { location, getCurrentLocation, loading: geoLoading } = useGeolocation();

  // Configurar ubicación inicial
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  // Usar ubicación actual del usuario
  useEffect(() => {
    if (location) {
      const newLocation = { lat: location.latitude, lng: location.longitude };
      setSelectedLocation(newLocation);
      setMapCenter([location.latitude, location.longitude]);
      onLocationSelect(newLocation);
    }
  }, [location, onLocationSelect]);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleGetCurrentLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Usar Nominatim (gratuito) para geocodificación
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&countrycodes=co`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newLocation = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
        };
        setSelectedLocation(newLocation);
        setMapCenter([newLocation.lat, newLocation.lng]);
        onLocationSelect(newLocation);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <div className={`interactive-map-container ${className}`}>
      {/* Barra de búsqueda */}
      <div className="map-search-bar">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="search-button"
          >
            {isSearching ? "..." : "Buscar"}
          </button>
        </div>
        
        <button
          onClick={handleGetCurrentLocation}
          disabled={geoLoading}
          className="location-button"
          title="Usar mi ubicación actual"
        >
          <FaCrosshairs className={geoLoading ? "spinning" : ""} />
          {geoLoading ? "Obteniendo..." : "Mi ubicación"}
        </button>
      </div>

      {/* Mapa */}
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="interactive-map"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEvents onLocationSelect={handleLocationClick} />
          
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
              <Popup>
                <div className="marker-popup">
                  <FaMapMarkerAlt className="popup-icon" />
                  <div className="popup-content">
                    <h4>Ubicación seleccionada</h4>
                    {selectedLocation.address && (
                      <p className="popup-address">{selectedLocation.address}</p>
                    )}
                    <p className="popup-coords">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                    <button
                      onClick={handleConfirmLocation}
                      className="confirm-location-btn"
                    >
                      <FaCheck />
                      Confirmar ubicación
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Información de la ubicación */}
      {selectedLocation && (
        <div className="location-info">
          <div className="location-details">
            <FaMapMarkerAlt className="info-icon" />
            <div className="location-text">
              <h4>Ubicación seleccionada</h4>
              {selectedLocation.address ? (
                <p>{selectedLocation.address}</p>
              ) : (
                <p>
                  Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleConfirmLocation}
            className="confirm-button"
          >
            <FaCheck />
            Confirmar
          </button>
        </div>
      )}

      {/* Instrucciones */}
      <div className="map-instructions">
        <p>
          <strong>Instrucciones:</strong> Haz clic en el mapa para seleccionar una ubicación,
          usa la búsqueda para encontrar una dirección específica, o usa "Mi ubicación" para
          obtener tu posición actual.
        </p>
      </div>
    </div>
  );
};

export default InteractiveMap;






