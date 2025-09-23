import React, { useState, useEffect, useCallback } from "react";
import {
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSlidersH,
  FaSearch,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Product, TipoProducto } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { searchService } from "../services/SearchService";

interface ProductFiltersProps {
  onFilterChange: (products: Product[]) => void;
  allProducts: Product[];
}

interface FilterState {
  query: string;
  minPrice: number | "";
  maxPrice: number | "";
  tipoProductoId: number | "";
  marca: string;
  color: string;
  talla: string;
  sortBy: string;
  inStock: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  allProducts,
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    minPrice: "",
    maxPrice: "",
    tipoProductoId: "",
    marca: "",
    color: "",
    talla: "",
    sortBy: "",
    inStock: false,
  });

  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Cleanup timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    // Solo aplicar filtros si hay productos cargados
    if (allProducts && allProducts.length > 0) {
      applyFilters();
    }
  }, [filters, allProducts]);

  const loadFilterOptions = async () => {
    try {
      const [tipos, brands, colors] = await Promise.all([
        ConexionApiBackend.obtenerTiposProducto(),
        searchService.getPopularBrands(),
        searchService.getAvailableColors(),
      ]);

      // Eliminar duplicados de tipos de producto
      const uniqueTipos = tipos.filter(
        (tipo: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.nombre === tipo.nombre)
      );
      setTiposProducto(uniqueTipos);

      // Eliminar duplicados de marcas
      const uniqueBrands = [...new Set(brands.map((b) => b.name))];
      setAvailableBrands(uniqueBrands);

      // Eliminar duplicados de colores
      const uniqueColors = [...new Set(colors)];
      setAvailableColors(uniqueColors);

      // Extraer tallas disponibles de los productos
      const sizes = [
        ...new Set(
          allProducts
            .map((p) => p.talla)
            .filter(Boolean)
            .flatMap((talla) => talla?.split(",") || [])
            .map((s) => s.trim())
        ),
      ].sort();
      setAvailableSizes(sizes);
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      // Verificar si hay filtros activos que requieran búsqueda en API
      const hasComplexFilters =
        filters.query || filters.minPrice || filters.maxPrice;

      if (hasComplexFilters) {
        // Usar API para búsquedas complejas
        const searchFilters = {
          query: filters.query || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          tipoProductoId: filters.tipoProductoId
            ? Number(filters.tipoProductoId)
            : undefined,
          marca: filters.marca || undefined,
          color: filters.color || undefined,
          talla: filters.talla || undefined,
          sortBy: filters.sortBy || undefined,
          inStock: filters.inStock || undefined,
        };

        const result = await searchService.search(searchFilters as any);
        onFilterChange(result.products);
      } else {
        // Usar filtros locales para filtros simples
        let filtered = [...allProducts];

        if (filters.tipoProductoId) {
          filtered = filtered.filter(
            (p) => p.tipoProductoId === Number(filters.tipoProductoId)
          );
        }

        if (filters.marca) {
          filtered = filtered.filter((p) =>
            p.marca?.toLowerCase().includes(filters.marca.toLowerCase())
          );
        }

        if (filters.color) {
          filtered = filtered.filter((p) =>
            p.color?.toLowerCase().includes(filters.color.toLowerCase())
          );
        }

        if (filters.talla) {
          filtered = filtered.filter((p) =>
            p.talla?.toLowerCase().includes(filters.talla.toLowerCase())
          );
        }

        if (filters.inStock) {
          filtered = filtered.filter((p) => p.stock && p.stock > 0);
        }

        // Aplicar ordenamiento
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "price_asc":
              filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
              break;
            case "price_desc":
              filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
              break;
            case "name_asc":
              filtered.sort((a, b) =>
                (a.nombre || "").localeCompare(b.nombre || "")
              );
              break;
            case "name_desc":
              filtered.sort((a, b) =>
                (b.nombre || "").localeCompare(a.nombre || "")
              );
              break;
            case "newest":
              filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
              break;
          }
        }

        onFilterChange(filtered);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // En caso de error, mostrar todos los productos
      onFilterChange(allProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      // Limpiar timeout anterior
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Establecer nuevo timeout para debounce
      const newTimeout = setTimeout(() => {
        handleFilterChange("query", value);
      }, 500); // 500ms de delay

      setSearchTimeout(newTimeout);
    },
    [searchTimeout, handleFilterChange]
  );

  const clearFilters = () => {
    setFilters({
      query: "",
      minPrice: "",
      maxPrice: "",
      tipoProductoId: "",
      marca: "",
      color: "",
      talla: "",
      sortBy: "",
      inStock: false,
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.query ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.tipoProductoId ||
      filters.marca ||
      filters.color ||
      filters.talla ||
      filters.sortBy ||
      filters.inStock
    );
  };

  const getSortOptions = () => [
    { value: "", label: t("products.sortBy") },
    { value: "price_asc", label: "Precio: Menor a Mayor" },
    { value: "price_desc", label: "Precio: Mayor a Menor" },
    { value: "name_asc", label: "Nombre: A-Z" },
    { value: "name_desc", label: "Nombre: Z-A" },
    { value: "newest", label: "Más Recientes" },
  ];

  return (
    <div className="product-filters">
      {/* Barra de filtros compacta */}
      <div className="filters-bar">
        <div className="search-filter">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t("products.searchPlaceholder")}
            value={filters.query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="quick-filters">
          <select
            value={filters.tipoProductoId}
            onChange={(e) =>
              handleFilterChange("tipoProductoId", e.target.value)
            }
            className="quick-filter"
          >
            <option value="">{t("products.allCategories")}</option>
            {tiposProducto &&
              tiposProducto.length > 0 &&
              tiposProducto.map((tipo) => (
                <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>
                  {tipo.nombre}
                </option>
              ))}
          </select>

          <select
            value={filters.marca}
            onChange={(e) => handleFilterChange("marca", e.target.value)}
            className="quick-filter"
          >
            <option value="">{t("products.allBrands")}</option>
            {availableBrands &&
              availableBrands.length > 0 &&
              availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="quick-filter"
          >
            {getSortOptions() &&
              getSortOptions().length > 0 &&
              getSortOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>

          <button
            className={`filters-toggle ${hasActiveFilters() ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSlidersH />
            {t("products.filters")}
            {hasActiveFilters() && <span className="active-dot">●</span>}
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Panel de filtros expandido */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Precio */}
            <div className="filter-group">
              <label>Rango de Precio</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder={t("additional.minimum")}
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder={t("additional.maximum")}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Color */}
            <div className="filter-group">
              <label>Color</label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              >
                <option value="">Todos los colores</option>
                {availableColors &&
                  availableColors.length > 0 &&
                  availableColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
              </select>
            </div>

            {/* Talla */}
            <div className="filter-group">
              <label>Talla</label>
              <select
                value={filters.talla}
                onChange={(e) => handleFilterChange("talla", e.target.value)}
              >
                <option value="">Todas las tallas</option>
                {availableSizes &&
                  availableSizes.length > 0 &&
                  availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
              </select>
            </div>

            {/* Stock */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    handleFilterChange("inStock", e.target.checked)
                  }
                />
                <span className="checkmark"></span>
                Solo productos en stock
              </label>
            </div>
          </div>

          <div className="filters-actions">
            <button className="clear-btn" onClick={clearFilters}>
              <FaTimes />
              Limpiar Filtros
            </button>
            <div className="filter-count">
              {hasActiveFilters() && (
                <span className="active-count">
                  {Object.values(filters).filter(Boolean).length} filtros
                  activos
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="filters-loading">
          <div className="loading-spinner"></div>
          <span>Aplicando filtros...</span>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
