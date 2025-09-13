import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Product, TipoProducto } from "../modelos/productTypes";

interface AdvancedSearchProps {
  products: Product[];
  onFilteredProducts: (products: Product[]) => void;
  tiposProducto: TipoProducto[];
}

interface FilterState {
  searchTerm: string;
  selectedTypes: number[];
  priceRange: [number, number];
  colorFilter: string;
  sortBy: "name" | "price_asc" | "price_desc" | "stock";
  inStockOnly: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  products,
  onFilteredProducts,
  tiposProducto,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedTypes: [],
    priceRange: [0, 1000000],
    colorFilter: "",
    sortBy: "name",
    inStockOnly: false,
  });

  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    // Extraer colores únicos
    const colors = [...new Set(products.map((p) => p.color.toLowerCase()))];
    setAvailableColors(colors);

    // Encontrar precio máximo
    const max = Math.max(...products.map((p) => p.precio));
    setMaxPrice(max);

    // Actualizar rango de precios
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, max],
    }));
  }, [products]);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.marca
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          product.color.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtro por tipos de producto
    if (filters.selectedTypes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedTypes.includes(product.tipoProductoId)
      );
    }

    // Filtro por rango de precios
    filtered = filtered.filter(
      (product) =>
        product.precio >= filters.priceRange[0] &&
        product.precio <= filters.priceRange[1]
    );

    // Filtro por color
    if (filters.colorFilter) {
      filtered = filtered.filter((product) =>
        product.color.toLowerCase().includes(filters.colorFilter.toLowerCase())
      );
    }

    // Filtro por stock
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.marca.localeCompare(b.marca);
        case "price_asc":
          return a.precio - b.precio;
        case "price_desc":
          return b.precio - a.precio;
        case "stock":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    onFilteredProducts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleTypeToggle = (typeId: number) => {
    setFilters((prev) => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(typeId)
        ? prev.selectedTypes.filter((id) => id !== typeId)
        : [...prev.selectedTypes, typeId],
    }));
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange:
        index === 0 ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, colorFilter: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handleStockToggle = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedTypes: [],
      priceRange: [0, maxPrice],
      colorFilter: "",
      sortBy: "name",
      inStockOnly: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedTypes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.colorFilter) count++;
    if (filters.inStockOnly) count++;
    return count;
  };

  return (
    <div className="advanced-search-container">
      {/* Barra de búsqueda principal */}
      <div className="search-bar">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos por marca o color..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <button
          className="filter-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaFilter />
          {getActiveFiltersCount() > 0 && (
            <span className="filter-badge">{getActiveFiltersCount()}</span>
          )}
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {isExpanded && (
        <div className="filters-panel">
          <div className="filters-header">
            <h5>Filtros Avanzados</h5>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Limpiar Filtros
            </button>
          </div>

          <div className="filters-grid">
            {/* Filtro por tipo de producto */}
            <div className="filter-group">
              <label>Tipo de Producto</label>
              <div className="type-filters">
                {tiposProducto.map((tipo) => (
                  <label key={tipo.idTipoProducto} className="type-filter-item">
                    <input
                      type="checkbox"
                      checked={filters.selectedTypes.includes(
                        tipo.idTipoProducto
                      )}
                      onChange={() => handleTypeToggle(tipo.idTipoProducto)}
                    />
                    <span>{tipo.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por rango de precios */}
            <div className="filter-group">
              <label>Rango de Precios</label>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceRangeChange(0, Number(e.target.value))
                    }
                    placeholder="Mínimo"
                    className="price-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceRangeChange(1, Number(e.target.value))
                    }
                    placeholder="Máximo"
                    className="price-input"
                  />
                </div>
                <div className="price-display">
                  ${filters.priceRange[0].toLocaleString()} - $
                  {filters.priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            {/* Filtro por color */}
            <div className="filter-group">
              <label>Color</label>
              <select
                value={filters.colorFilter}
                onChange={handleColorChange}
                className="color-select"
              >
                <option value="">Todos los colores</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="filter-group">
              <label>Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="name">Nombre (A-Z)</option>
                <option value="price_asc">Precio (Menor a Mayor)</option>
                <option value="price_desc">Precio (Mayor a Menor)</option>
                <option value="stock">Stock (Mayor a Menor)</option>
              </select>
            </div>

            {/* Filtro por disponibilidad */}
            <div className="filter-group">
              <label className="stock-filter-item">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={handleStockToggle}
                />
                <span>Solo productos disponibles</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

