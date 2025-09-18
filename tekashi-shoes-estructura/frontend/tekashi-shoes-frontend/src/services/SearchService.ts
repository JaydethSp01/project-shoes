import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "./ConexionApiBackend";

export interface SearchFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  tipoProductoId?: number;
  marca?: string;
  color?: string;
  talla?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
  inStock?: boolean;
}

export interface SearchResult {
  products: Product[];
  total: number;
  filters: SearchFilters;
  suggestions: string[];
}

export interface SearchSuggestion {
  text: string;
  type: "product" | "brand" | "category" | "color";
  count?: number;
}

class SearchService {
  // private _baseUrl = "https://project-shoes.onrender.com";
  private searchHistory: string[] = [];
  private popularSearches: string[] = [
    "nike air max",
    "adidas ultraboost",
    "zapatillas running",
    "zapatos formales",
    "botas invierno",
    "sneakers blancos",
  ];

  // Realizar búsqueda completa
  async search(filters: SearchFilters): Promise<SearchResult> {
    try {
      console.log("Realizando búsqueda con filtros:", filters);

      // Obtener todos los productos primero
      let allProducts = await ConexionApiBackend.obtenerProductos();

      // Aplicar filtros localmente (en producción esto se haría en el backend)
      let filteredProducts = this.applyFilters(allProducts, filters);

      // Aplicar ordenamiento
      filteredProducts = this.applySorting(filteredProducts, filters.sortBy);

      // Generar sugerencias
      const suggestions = this.generateSuggestions(
        filters.query || "",
        allProducts
      );

      // Guardar en historial si hay query
      if (filters.query) {
        this.addToSearchHistory(filters.query);
      }

      return {
        products: filteredProducts,
        total: filteredProducts.length,
        filters,
        suggestions,
      };
    } catch (error) {
      console.error("Error en búsqueda:", error);
      throw new Error("Error al realizar la búsqueda");
    }
  }

  // Búsqueda rápida (solo por texto)
  async quickSearch(query: string): Promise<Product[]> {
    if (!query.trim()) return [];

    try {
      const allProducts = await ConexionApiBackend.obtenerProductos();
      return allProducts
        .filter(
          (product: any) =>
            product.nombre?.toLowerCase().includes(query.toLowerCase()) ||
            product.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
            product.marca?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limitar a 5 resultados para búsqueda rápida
    } catch (error) {
      console.error("Error en búsqueda rápida:", error);
      return [];
    }
  }

  // Obtener sugerencias de búsqueda
  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query.trim()) return this.getPopularSearches();

    try {
      const allProducts = await ConexionApiBackend.obtenerProductos();
      const suggestions: SearchSuggestion[] = [];

      // Buscar en nombres de productos
      const productMatches = allProducts
        .filter((p: any) =>
          p.nombre?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
        .map((p: any) => ({
          text: p.nombre || "",
          type: "product" as const,
          count: 1,
        }));

      // Buscar marcas
      const brandMatches = [
        ...new Set(
          allProducts
            .filter((p: any) =>
              p.marca?.toLowerCase().includes(query.toLowerCase())
            )
            .map((p: any) => p.marca)
        ),
      ]
        .filter((brand) => brand && brand !== "")
        .slice(0, 3)
        .map((brand) => ({
          text: brand as string,
          type: "brand" as const,
        }));

      // Buscar colores
      const colorMatches = [
        ...new Set(
          allProducts
            .filter((p: any) =>
              p.color?.toLowerCase().includes(query.toLowerCase())
            )
            .map((p: any) => p.color)
        ),
      ]
        .filter((color) => color && color !== "")
        .slice(0, 2)
        .map((color) => ({
          text: color as string,
          type: "color" as const,
        }));

      // Combinar sugerencias
      suggestions.push(
        ...productMatches,
        ...brandMatches.filter((b: any) => b.text && b.text !== ""),
        ...colorMatches
      );

      // Si no hay suficientes sugerencias, agregar del historial
      if (suggestions.length < 5) {
        const historyMatches = this.searchHistory
          .filter((h) => h.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5 - suggestions.length)
          .map((text) => ({
            text,
            type: "product" as const,
          }));

        suggestions.push(...historyMatches);
      }

      return suggestions.slice(0, 8);
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
      return [];
    }
  }

  // Obtener búsquedas populares
  getPopularSearches(): SearchSuggestion[] {
    return this.popularSearches.map((search) => ({
      text: search,
      type: "product" as const,
    }));
  }

  // Obtener historial de búsqueda
  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  // Limpiar historial de búsqueda
  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  // Aplicar filtros a los productos
  private applyFilters(products: Product[], filters: SearchFilters): Product[] {
    let filtered = [...products];

    // Filtro por texto
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(query) ||
          product.descripcion?.toLowerCase().includes(query) ||
          product.marca?.toLowerCase().includes(query) ||
          product.color?.toLowerCase().includes(query)
      );
    }

    // Filtro por precio
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.precio && product.precio >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.precio && product.precio <= filters.maxPrice!
      );
    }

    // Filtro por tipo de producto
    if (filters.tipoProductoId !== undefined) {
      filtered = filtered.filter(
        (product) => product.tipoProductoId === filters.tipoProductoId
      );
    }

    // Filtro por marca
    if (filters.marca) {
      filtered = filtered.filter((product) =>
        product.marca?.toLowerCase().includes(filters.marca!.toLowerCase())
      );
    }

    // Filtro por color
    if (filters.color) {
      filtered = filtered.filter((product) =>
        product.color?.toLowerCase().includes(filters.color!.toLowerCase())
      );
    }

    // Filtro por talla
    if (filters.talla) {
      filtered = filtered.filter((product) =>
        product.talla?.toLowerCase().includes(filters.talla!.toLowerCase())
      );
    }

    // Filtro por stock
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        filtered = filtered.filter(
          (product) => product.stock && product.stock > 0
        );
      } else {
        filtered = filtered.filter(
          (product) => !product.stock || product.stock <= 0
        );
      }
    }

    return filtered;
  }

  // Aplicar ordenamiento
  private applySorting(products: Product[], sortBy?: string): Product[] {
    if (!sortBy) return products;

    const sorted = [...products];

    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));

      case "price_desc":
        return sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));

      case "name_asc":
        return sorted.sort((a, b) =>
          (a.nombre || "").localeCompare(b.nombre || "")
        );

      case "name_desc":
        return sorted.sort((a, b) =>
          (b.nombre || "").localeCompare(a.nombre || "")
        );

      case "newest":
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));

      default:
        return sorted;
    }
  }

  // Generar sugerencias basadas en la query
  private generateSuggestions(query: string, products: Product[]): string[] {
    if (!query.trim()) return [];

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Buscar productos similares
    const similarProducts = products
      .filter(
        (p) =>
          p.nombre?.toLowerCase().includes(queryLower) ||
          p.marca?.toLowerCase().includes(queryLower)
      )
      .slice(0, 3)
      .map((p) => p.nombre || "");

    suggestions.push(...similarProducts);

    // Buscar marcas similares
    const similarBrands = [
      ...new Set(
        products
          .filter((p) => p.marca?.toLowerCase().includes(queryLower))
          .map((p) => p.marca)
      ),
    ].slice(0, 2);

    suggestions.push(...(similarBrands.filter(Boolean) as string[]));

    return [...new Set(suggestions)].slice(0, 5);
  }

  // Agregar al historial de búsqueda
  private addToSearchHistory(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Remover si ya existe
    this.searchHistory = this.searchHistory.filter((h) => h !== trimmedQuery);

    // Agregar al inicio
    this.searchHistory.unshift(trimmedQuery);

    // Limitar a 10 búsquedas
    this.searchHistory = this.searchHistory.slice(0, 10);
  }

  // Búsqueda por categorías populares
  async getPopularCategories(): Promise<
    Array<{ name: string; count: number; image?: string }>
  > {
    try {
      const allProducts = await ConexionApiBackend.obtenerProductos();
      const tiposProducto = await ConexionApiBackend.obtenerTiposProducto();

      return tiposProducto.map((tipo: any) => ({
        name: tipo.nombre,
        count: allProducts.filter(
          (p: any) => p.tipoProductoId === tipo.idTipoProducto
        ).length,
        image: tipo.imagen,
      }));
    } catch (error) {
      console.error("Error obteniendo categorías populares:", error);
      return [];
    }
  }

  // Búsqueda por marcas populares
  async getPopularBrands(): Promise<Array<{ name: string; count: number }>> {
    try {
      const allProducts = await ConexionApiBackend.obtenerProductos();
      const brandCounts: { [key: string]: number } = {};

      allProducts.forEach((product: any) => {
        if (product.marca) {
          brandCounts[product.marca] = (brandCounts[product.marca] || 0) + 1;
        }
      });

      return Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    } catch (error) {
      console.error("Error obteniendo marcas populares:", error);
      return [];
    }
  }

  // Búsqueda por colores disponibles
  async getAvailableColors(): Promise<string[]> {
    try {
      const allProducts = await ConexionApiBackend.obtenerProductos();
      const colors = [
        ...new Set(allProducts.map((p: any) => p.color).filter(Boolean)),
      ] as string[];

      return colors.sort();
    } catch (error) {
      console.error("Error obteniendo colores:", error);
      return [];
    }
  }
}

export const searchService = new SearchService();
