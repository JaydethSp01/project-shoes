import { useState, useEffect } from "react";

/**
 * Hook personalizado para implementar debounce
 * Evita llamadas excesivas a la API durante la escritura
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para búsqueda con debounce
 * Optimiza las búsquedas para evitar llamadas excesivas al API
 * Modificado para NO buscar automáticamente - solo cuando el usuario presione Enter o haga clic en el botón
 */
export function useSearchDebounce(searchTerm: string, delay: number = 500) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  // NO buscar automáticamente - solo cuando se active manualmente
  useEffect(() => {
    if (
      shouldSearch &&
      debouncedSearchTerm &&
      debouncedSearchTerm.length >= 2
    ) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [shouldSearch, debouncedSearchTerm]);

  const triggerSearch = () => {
    if (searchTerm && searchTerm.length >= 2) {
      setShouldSearch(true);
    }
  };

  const resetSearch = () => {
    setShouldSearch(false);
    setIsSearching(false);
  };

  return {
    debouncedSearchTerm,
    isSearching,
    shouldSearch:
      shouldSearch && debouncedSearchTerm && debouncedSearchTerm.length >= 2,
    triggerSearch,
    resetSearch,
  };
}
