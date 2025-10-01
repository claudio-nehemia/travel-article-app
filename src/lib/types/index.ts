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

export interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  user?: User;
  article?: string; // Article documentId
}

export interface Category {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  image?: ArticleImage;
  author?: User;
  category?: Category;
  comments?: Comment[];
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

export interface CommentState {
  comments: Comment[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  search: string;
  titleExact: string;
  categoryName: string;
  sort: string;
  page: number;
}

export type PageType = 'landing' | 'login' | 'register' | 'articles' | 'article-detail' | 'create-article' | 'edit-article';