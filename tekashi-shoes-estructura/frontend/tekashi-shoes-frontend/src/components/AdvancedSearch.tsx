import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaSlidersH,
  FaSpinner,
  FaHistory,
  FaFire,
  FaTag,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Product, TipoProducto } from "../modelos/productTypes";
import {
  searchService,
  SearchFilters,
  SearchSuggestion,
} from "../services/SearchService";
import { ConexionApiBackend } from "../services/ConexionApiBackend";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (products: Product[]) => void;
  initialQuery?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  onSearchResults,
  initialQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    minPrice: undefined,
    maxPrice: undefined,
    tipoProductoId: undefined,
    marca: "",
    color: "",
    talla: "",
    sortBy: undefined,
    inStock: undefined,
  });

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>(
    []
  );
  const [availableBrands, setAvailableBrands] = useState<
    Array<{ name: string; count: number }>
  >([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      loadSuggestions();
    } else {
      setSuggestions(popularSearches);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadInitialData = async () => {
    try {
      const [history, popular, brands, colors, tipos] = await Promise.all([
        searchService.getSearchHistory(),
        searchService.getPopularSearches(),
        searchService.getPopularBrands(),
        searchService.getAvailableColors(),
        ConexionApiBackend.obtenerTiposProducto(),
      ]);

      setSearchHistory(history);
      setPopularSearches(popular);
      setAvailableBrands(brands);
      setAvailableColors(colors);
      setTiposProducto(tipos);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggestionsData = await searchService.getSearchSuggestions(
        searchQuery
      );
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !hasActiveFilters()) return;

    setIsLoading(true);
    try {
      const searchFilters: SearchFilters = {
        ...filters,
        query: searchQuery.trim() || undefined,
      };

      const result = await searchService.search(searchFilters);
      onSearchResults(result.products);
      onClose();
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setFilters((prev) => ({ ...prev, query: suggestion.text }));
    setShowSuggestions(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    setFilters((prev) => ({ ...prev, query: historyItem }));
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: searchQuery,
      minPrice: undefined,
      maxPrice: undefined,
      tipoProductoId: undefined,
      marca: "",
      color: "",
      talla: "",
      sortBy: undefined,
      inStock: undefined,
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.minPrice ||
      filters.maxPrice ||
      filters.tipoProductoId ||
      filters.marca ||
      filters.color ||
      filters.talla ||
      filters.sortBy ||
      filters.inStock !== undefined
    );
  };

  const getSortOptions = () => [
    { value: undefined, label: "Ordenar por..." },
    { value: "price_asc", label: "Precio: Menor a Mayor" },
    { value: "price_desc", label: "Precio: Mayor a Menor" },
    { value: "name_asc", label: "Nombre: A-Z" },
    { value: "name_desc", label: "Nombre: Z-A" },
    { value: "newest", label: "Más Recientes" },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="advanced-search-overlay">
      <div className="advanced-search-modal">
        <div className="search-header">
          <h2>Búsqueda Avanzada</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="search-content">
          {/* Barra de búsqueda principal */}
          <div className="search-bar-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar zapatos, marcas, colores..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilters((prev) => ({ ...prev, query: e.target.value }));
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="spinning" /> : <FaSearch />}
              </button>
            </div>

            {/* Sugerencias */}
            {showSuggestions && (
              <div ref={suggestionsRef} className="suggestions-dropdown">
                {searchQuery.trim() ? (
                  <>
                    {suggestions.length > 0 && (
                      <div className="suggestion-section">
                        <h4>Sugerencias</h4>
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <FaTag className="suggestion-icon" />
                            <span>{suggestion.text}</span>
                            <span className="suggestion-type">
                              {suggestion.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchHistory.length > 0 && (
                      <div className="suggestion-section">
                        <h4>
                          <FaHistory />
                          Historial
                        </h4>
                        {searchHistory.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="suggestion-item history-item"
                            onClick={() => handleHistoryClick(item)}
                          >
                            <FaHistory />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="suggestion-section">
                    <h4>
                      <FaFire />
                      Búsquedas Populares
                    </h4>
                    {popularSearches.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <FaFire />
                        <span>{suggestion.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="filters-section">
            <div className="filters-header">
              <button
                className="filters-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaSlidersH />
                Filtros Avanzados
                {hasActiveFilters() && (
                  <span className="active-indicator">●</span>
                )}
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {hasActiveFilters() && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Limpiar Filtros
                </button>
              )}
            </div>

            {showFilters && (
              <div className="filters-grid">
                {/* Precio */}
                <div className="filter-group">
                  <label>Rango de Precio</label>
                  <div className="price-range">
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "minPrice",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxPrice",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div className="filter-group">
                  <label>Categoría</label>
                  <select
                    value={filters.tipoProductoId || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "tipoProductoId",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  >
                    <option value="">Todas las categorías</option>
                    {tiposProducto.map((tipo) => (
                      <option
                        key={tipo.idTipoProducto}
                        value={tipo.idTipoProducto}
                      >
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marca */}
                <div className="filter-group">
                  <label>Marca</label>
                  <select
                    value={filters.marca || ""}
                    onChange={(e) =>
                      handleFilterChange("marca", e.target.value)
                    }
                  >
                    <option value="">Todas las marcas</option>
                    {availableBrands.map((brand) => (
                      <option key={brand.name} value={brand.name}>
                        {brand.name} ({brand.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div className="filter-group">
                  <label>Color</label>
                  <select
                    value={filters.color || ""}
                    onChange={(e) =>
                      handleFilterChange("color", e.target.value)
                    }
                  >
                    <option value="">Todos los colores</option>
                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Talla */}
                <div className="filter-group">
                  <label>Talla</label>
                  <input
                    type="text"
                    placeholder="Ej: 42, M, L"
                    value={filters.talla || ""}
                    onChange={(e) =>
                      handleFilterChange("talla", e.target.value)
                    }
                  />
                </div>

                {/* Ordenamiento */}
                <div className="filter-group">
                  <label>Ordenar por</label>
                  <select
                    value={filters.sortBy || ""}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value || undefined)
                    }
                  >
                    {getSortOptions().map((option) => (
                      <option
                        key={option.value || "default"}
                        value={option.value || ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div className="filter-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.inStock || false}
                      onChange={(e) =>
                        handleFilterChange(
                          "inStock",
                          e.target.checked || undefined
                        )
                      }
                    />
                    Solo productos en stock
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="search-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinning" />
                  Buscando...
                </>
              ) : (
                <>
                  <FaSearch />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
