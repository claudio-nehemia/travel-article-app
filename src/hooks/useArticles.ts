import { useState, useEffect, useCallback, useRef } from 'react';
import { ArticleState, FilterOptions } from '@/lib/types';
import { apiService } from '@/lib/api/apiServices';

export const useArticles = (isAuthenticated: boolean) => {
  const [articleState, setArticleState] = useState<ArticleState>({
    articles: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null
  });

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sort: 'createdAt:desc',
    page: 1
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchArticles = useCallback(async (reset = false) => {
    if (articleState.isLoading || !isAuthenticated) return;

    setArticleState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiService.getArticles(
        reset ? 1 : filters.page,
        filters.search,
        filters.sort
      );

      setArticleState(prev => ({
        ...prev,
        articles: reset ? response.data : [...prev.articles, ...response.data],
        totalPages: response.meta.pagination.pageCount,
        currentPage: response.meta.pagination.page,
        isLoading: false
      }));
    } catch (error) {
      setArticleState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles'
      }));
    }
  }, [filters, articleState.isLoading, isAuthenticated]);

  // Initial fetch and filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles(true);
    }
  }, [filters.search, filters.sort, isAuthenticated]);

  // Infinite scroll
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && 
            !articleState.isLoading && 
            articleState.currentPage < articleState.totalPages) {
          setFilters(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [articleState.isLoading, articleState.currentPage, articleState.totalPages]);

  // Load more articles
  useEffect(() => {
    if (filters.page > 1) {
      fetchArticles(false);
    }
  }, [filters.page]);

  return {
    articleState,
    filters,
    setFilters,
    observerTarget,
    refetchArticles: () => fetchArticles(true)
  };
};