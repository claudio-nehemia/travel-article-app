import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Article, ArticleState, FilterOptions } from "@/lib/types";

interface ArticlesSliceState {
  articleState: ArticleState;
  filters: FilterOptions;
}

const initialState: ArticlesSliceState = {
  articleState: {
    articles: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  filters: {
    search: "",
    titleExact: "",
    categoryName: "",
    sort: "createdAt:desc",
    page: 1,
  },
};

type FetchSuccessPayload = {
  data: Article[];
  page: number;
  pageCount: number;
  reset?: boolean;
};

type FiltersUpdater = FilterOptions;

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setFilters: (state: ArticlesSliceState, action: PayloadAction<FiltersUpdater>) => {
      state.filters = action.payload;
    },
    mergeFilters: (state: ArticlesSliceState, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    fetchStarted: (state: ArticlesSliceState) => {
      state.articleState.isLoading = true;
      state.articleState.error = null;
    },
    fetchSuccess: (state: ArticlesSliceState, action: PayloadAction<FetchSuccessPayload>) => {
      const { data, page, pageCount, reset } = action.payload;
      state.articleState.articles = reset ? data : [...state.articleState.articles, ...data];
      state.articleState.currentPage = page;
      state.articleState.totalPages = pageCount;
      state.articleState.isLoading = false;
      state.articleState.error = null;
      state.filters.page = page;
    },
    fetchFailure: (state: ArticlesSliceState, action: PayloadAction<string>) => {
      state.articleState.isLoading = false;
      state.articleState.error = action.payload;
    },
    resetArticles: () => initialState,
  },
});

export const articlesActions = articlesSlice.actions;
export default articlesSlice.reducer;
export type { ArticlesSliceState };
