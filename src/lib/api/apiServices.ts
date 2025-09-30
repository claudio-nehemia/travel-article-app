import { API_BASE_URL, PAGINATION } from "@/constants/config";
import { AuthState } from "../types";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getAuthHeaders(): Record<string, string> {
    const authData = this.getStoredAuth();
    return authData?.jwt 
      ? { 'Authorization': `Bearer ${authData.jwt}` }
      : {};
  }

  private getStoredAuth(): AuthState | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  }

  async login(identifier: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }

    return response.json();
  }

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Registration failed');
    }

    return response.json();
  }

  async getArticles(page = 1, search = '', sort = 'createdAt:desc') {
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': PAGINATION.PAGE_SIZE.toString(),
      'sort[0]': sort,
      'populate': '*'
    });

    if (search) {
      params.append('filters[title][$containsi]', search);
    }

    const response = await fetch(`${this.baseUrl}/api/articles?${params}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  }

  async getArticleById(id: string) {
    const response = await fetch(`${this.baseUrl}/api/articles/${id}?populate=*`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  }

  async createArticle(data: { title: string; description: string }) {
    const response = await fetch(`${this.baseUrl}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  }

  async updateArticle(id: string, data: { title: string; description: string }) {
    const response = await fetch(`${this.baseUrl}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  }

  async deleteArticle(id: string) {
    const response = await fetch(`${this.baseUrl}/api/articles/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  }
}

export const apiService = new ApiService();