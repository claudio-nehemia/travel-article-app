export interface User {
    id: number;
    username: string;
    email: string;
    blocked: boolean;
}

export interface ArticleImage {
    id: number;
    url: string;
    name?: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  image?: ArticleImage;
  author?: User;
}

export interface AuthState {
  user: User | null;
  jwt: string | null;
  isAuthenticated: boolean;
}

export interface ArticleState {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  search: string;
  sort: string;
  page: number;
}

export type PageType = 'landing' | 'login' | 'register' | 'articles' | 'article-detail' | 'create-article' | 'edit-article';