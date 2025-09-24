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
 */
export function useSearchDebounce(searchTerm: string, delay: number = 500) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    isSearching,
    shouldSearch: debouncedSearchTerm && debouncedSearchTerm.length >= 2,
  };
}
