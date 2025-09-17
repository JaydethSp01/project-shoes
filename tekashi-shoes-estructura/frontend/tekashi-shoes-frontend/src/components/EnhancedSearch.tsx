import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaClock,
  FaFire,
  FaTag,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import "../styles/EnhancedSearch.css";

interface EnhancedSearchProps {
  onSearchResults: (products: Product[]) => void;
  onAdvancedSearch: () => void;
  allProducts: Product[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "brand" | "color" | "category";
  count?: number;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onSearchResults,
  onAdvancedSearch,
  allProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar búsquedas recientes desde localStorage
    const saved = localStorage.getItem("tekashi_recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Generar sugerencias populares basadas en los productos
    generatePopularSearches();

    // Cerrar sugerencias al hacer click fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [allProducts]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      generateSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allProducts]);

  const generatePopularSearches = () => {
    const popular: string[] = [];

    // Obtener marcas más populares
    const brandCounts: { [key: string]: number } = {};
    allProducts.forEach((product) => {
      if (product.marca) {
        brandCounts[product.marca] = (brandCounts[product.marca] || 0) + 1;
      }
    });

    const topBrands = Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([brand]) => brand);

    popular.push(...topBrands);

    // Agregar categorías populares
    popular.push("Nike", "Adidas", "Running", "Casual", "Deportivo");

    setPopularSearches([...new Set(popular)]);
  };

  const generateSuggestions = () => {
    const term = searchTerm.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Buscar en marcas
    const brandMatches = [
      ...new Set(allProducts.map((p) => p.marca).filter(Boolean)),
    ]
      .filter((brand) => brand.toLowerCase().includes(term))
      .slice(0, 3)
      .map((brand) => ({
        id: `brand-${brand}`,
        text: brand,
        type: "brand" as const,
        count: allProducts.filter((p) => p.marca === brand).length,
      }));

    // Buscar en colores
    const colorMatches = [
      ...new Set(allProducts.map((p) => p.color).filter(Boolean)),
    ]
      .filter((color) => color.toLowerCase().includes(term))
      .slice(0, 2)
      .map((color) => ({
        id: `color-${color}`,
        text: color,
        type: "color" as const,
        count: allProducts.filter((p) => p.color === color).length,
      }));

    // Buscar en nombres de productos
    const productMatches = allProducts
      .filter((p) => p.nombre && p.nombre.toLowerCase().includes(term))
      .slice(0, 3)
      .map((product) => ({
        id: `product-${product.idProducto}`,
        text: product.nombre || "",
        type: "product" as const,
      }));

    newSuggestions.push(...brandMatches, ...colorMatches, ...productMatches);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  };

  const performSearch = async (searchQuery: string = searchTerm) => {
    if (!searchQuery.trim()) {
      onSearchResults(allProducts);
      return;
    }

    setIsLoading(true);

    try {
      // Buscar en el backend
      const searchResults = await ConexionApiBackend.obtenerProductos({});
      onSearchResults(searchResults);
    } catch (error) {
      console.error("Error searching products:", error);
      // Fallback a búsqueda local
      const filtered = allProducts.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      onSearchResults(filtered);
    }

    // Guardar búsqueda reciente
    if (searchQuery.trim()) {
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("tekashi_recent_searches", JSON.stringify(updated));
    }

    setShowSuggestions(false);
    setIsLoading(false);
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    performSearch(suggestion.text);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search);
    performSearch(search);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearchResults(allProducts);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "brand":
        return <FaTag className="suggestion-icon" />;
      case "color":
        return <FaTag className="suggestion-icon" />;
      case "product":
        return <FaSearch className="suggestion-icon" />;
      default:
        return <FaSearch className="suggestion-icon" />;
    }
  };

  return (
    <div className="enhanced-search" ref={suggestionsRef}>
      <div className="search-container">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Buscar zapatos, marcas, colores..."
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="search-buttons">
          <button
            className={`search-btn ${isLoading ? "loading" : ""}`}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <div className="loading-spinner" /> : "Buscar"}
          </button>

          <button
            className="search-btn filters-btn"
            onClick={onAdvancedSearch}
            title="Búsqueda Avanzada"
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {/* Sugerencias y búsquedas */}
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {/* Sugerencias dinámicas */}
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>Sugerencias</h4>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="suggestion-text">{suggestion.text}</span>
                  {suggestion.count && (
                    <span className="suggestion-count">
                      ({suggestion.count})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Búsquedas recientes */}
          {recentSearches.length > 0 && (
            <div className="suggestions-section">
              <h4>
                <FaClock className="section-icon" />
                Recientes
              </h4>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item recent-item"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <FaClock className="suggestion-icon" />
                  <span className="suggestion-text">{search}</span>
                </div>
              ))}
            </div>
          )}

          {/* Búsquedas populares */}
          {popularSearches.length > 0 && (
            <div className="suggestions-section">
              <h4>
                <FaFire className="section-icon" />
                Populares
              </h4>
              {popularSearches.slice(0, 5).map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item popular-item"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <FaFire className="suggestion-icon" />
                  <span className="suggestion-text">{search}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;

