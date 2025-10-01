"use client";

import { useEffect, useCallback, useRef } from "react";
import type { FilterOptions } from "@/lib/types";
import { apiService } from "@/lib/api/apiServices";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { articlesActions } from "@/lib/store/slices/articlesSlice";
import type { RootState } from "@/lib/store/store";

type FiltersUpdater = FilterOptions | ((prev: FilterOptions) => FilterOptions);

export const useArticles = (isAuthenticated: boolean) => {
  const dispatch = useAppDispatch();
  const { articleState, filters } = useAppSelector(
    (state: RootState) => state.articles
  );
  const observerTarget = useRef<HTMLDivElement>(null);

  const filtersRef = useRef(filters);
  const articleStateRef = useRef(articleState);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    articleStateRef.current = articleState;
  }, [articleState]);

  const setFilters = useCallback(
    (updater: FiltersUpdater) => {
      const nextFilters =
        typeof updater === "function" ? updater(filtersRef.current) : updater;
      dispatch(articlesActions.setFilters(nextFilters));
    },
    [dispatch]
  );

  const { search, sort, titleExact, categoryName, page } = filters;

  const fetchArticles = useCallback(
    async (reset = false) => {
      if (!isAuthenticated) return;

      const currentFilters = filtersRef.current;
      const currentState = articleStateRef.current;

      if (currentState.isLoading && !reset) {
        return;
      }

      const targetPage = reset ? 1 : currentFilters.page;

      if (reset && currentFilters.page !== 1) {
        dispatch(articlesActions.mergeFilters({ page: 1 }));
      }

      dispatch(articlesActions.fetchStarted());

      try {
        const response = await apiService.getArticles({
          page: targetPage,
          search: currentFilters.search,
          sort: currentFilters.sort,
          titleExact: currentFilters.titleExact,
          categoryName: currentFilters.categoryName,
        });

        const pagination = response?.meta?.pagination ?? {
          page: targetPage,
          pageCount: response?.data?.length ? targetPage : currentState.totalPages,
        };

        dispatch(
          articlesActions.fetchSuccess({
            data: response?.data ?? [],
            page: pagination.page ?? targetPage,
            pageCount: pagination.pageCount ?? currentState.totalPages,
            reset,
          })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch articles";
        dispatch(articlesActions.fetchFailure(message));
      }
    },
    [dispatch, isAuthenticated]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchArticles(true);
  }, [fetchArticles, isAuthenticated, search, sort, titleExact, categoryName]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (page > 1) {
      fetchArticles(false);
    }
  }, [fetchArticles, isAuthenticated, page]);

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !articleState.isLoading &&
          articleState.currentPage < articleState.totalPages
        ) {
          setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [articleState.isLoading, articleState.currentPage, articleState.totalPages, setFilters]);

  return {
    articleState,
    filters,
    setFilters,
    observerTarget,
    refetchArticles: () => fetchArticles(true),
  };
};