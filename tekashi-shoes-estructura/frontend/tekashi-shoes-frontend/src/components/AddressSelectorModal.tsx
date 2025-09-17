import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaSearch, FaCheck } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import InteractiveMap from "./InteractiveMap";
import "../styles/AddressSelectorModal.css";

interface AddressSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  }) => void;
  initialAddress?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  isOpen,
  onClose,
  onAddressSelect,
  initialAddress,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (initialAddress) {
      setSelectedLocation({
        lat: initialAddress.lat,
        lng: initialAddress.lng,
        address: initialAddress.address || "",
      });
    }
  }, [initialAddress]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address?: string;
  }) => {
    setSelectedLocation({
      lat: location.lat,
      lng: location.lng,
      address: location.address || "",
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // Simular obtención de detalles de dirección
      const addressDetails = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address,
        city: t("additional.bogota"), // Esto debería venir de la geocodificación inversa
        country: t("additional.colombia"),
        postalCode: "110111",
      };

      onAddressSelect(addressDetails);
      onClose();
    }
  };

  const handleSearchResultClick = (result: any) => {
    const location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    setSelectedLocation(location);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  if (!isOpen) return null;

  return (
    <div className="address-selector-modal-overlay">
      <div className="address-selector-modal">
        <div className="modal-header">
          <h3>Seleccionar Dirección</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Buscar dirección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="search-button"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? <FaSearch className="spinning" /> : <FaSearch />}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <FaMapMarkerAlt />
                    <span>{result.display_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="map-section">
            <InteractiveMap
              onLocationSelect={handleLocationSelect}
              initialLocation={selectedLocation || initialAddress}
              height="400px"
              className="address-selector-map"
            />
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="selected-location-info">
              <div className="location-details">
                <FaMapMarkerAlt className="location-icon" />
                <div className="location-text">
                  <strong>Ubicación seleccionada:</strong>
                  <p>{selectedLocation.address}</p>
                  <small>
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selectedLocation}
          >
            <FaCheck />
            Confirmar Dirección
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectorModal;
