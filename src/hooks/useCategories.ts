import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api/apiServices';
import { Category } from '@/lib/types';

// Global cache to share across all components
let categoriesCache: Category[] | null = null;
let cachePromise: Promise<Category[]> | null = null;
let cacheTimestamp: number | null = null;

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Custom hook for fetching and caching categories
 * Uses global cache to prevent multiple API calls
 * 
 * @returns { categories, isLoading, error, refetch, clearCache }
 * 
 * @example
 * const { categories, isLoading, error } = useCategories();
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (force: boolean = false) => {
    // Check if cache is still valid
    const now = Date.now();
    const isCacheValid = cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION;

    // Return from cache if available and valid
    if (!force && categoriesCache && isCacheValid) {
      setCategories(categoriesCache);
      return;
    }

    // Wait for ongoing request
    if (cachePromise) {
      try {
        const data = await cachePromise;
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      }
      return;
    }

    // New request
    setIsLoading(true);
    setError(null);

    cachePromise = apiService.getCategories().then(res => {
      const data = res.data || res || [];
      categoriesCache = Array.isArray(data) ? data : [];
      cacheTimestamp = Date.now();
      return categoriesCache;
    });

    try {
      const data = await cachePromise;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      categoriesCache = null;
      cacheTimestamp = null;
    } finally {
      setIsLoading(false);
      cachePromise = null;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    return fetchCategories(true);
  }, [fetchCategories]);

  const clearCache = useCallback(() => {
    categoriesCache = null;
    cachePromise = null;
    cacheTimestamp = null;
  }, []);

  return { 
    categories, 
    isLoading, 
    error,
    refetch,
    clearCache
  };
};

/**
 * Function to manually clear categories cache
 * Useful when categories are updated (CRUD operations)
 */
export const clearCategoriesCache = () => {
  categoriesCache = null;
  cachePromise = null;
  cacheTimestamp = null;
};

/**
 * Function to check if categories cache exists
 */
export const hasCategoriesCache = (): boolean => {
  return categoriesCache !== null && categoriesCache.length > 0;
};
