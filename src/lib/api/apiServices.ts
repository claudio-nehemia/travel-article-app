import { API_BASE_URL, PAGINATION } from "@/constants/config";
import { AuthState } from "../types";

type UploadFile = {
  url?: string;
  attributes?: {
    url?: string;
  };
};

type UploadResponse = UploadFile[] | { data?: UploadFile[] };

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getCategories() {
    const response = await fetch(`${this.baseUrl}/api/categories`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error?.message || 'Gagal memuat kategori';
      
      if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    return response.json();
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
      const message = error.error?.message || 'Login gagal';
      
      // Provide more specific error messages
      if (response.status === 400) {
        throw new Error('Email/username atau password salah. Silakan coba lagi.');
      } else if (response.status === 429) {
        throw new Error('Terlalu banyak percobaan login. Tunggu beberapa saat.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
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
      const message = error.error?.message || 'Registrasi gagal';
      
      // Provide more specific error messages
      if (message.includes('already taken') || message.includes('sudah digunakan')) {
        throw new Error('Email atau username sudah terdaftar. Gunakan yang lain.');
      } else if (message.includes('password')) {
        throw new Error('Password harus minimal 6 karakter.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }

    return response.json();
  }

  // Article methods - updated to match API specification
 async getArticles(options: {
  page?: number;
  search?: string;
  sort?: string;
  titleExact?: string;
  categoryName?: string;
} = {}) {
  const {
    page = 1,
    search = '',
    sort = 'createdAt:desc',
    titleExact = '',
    categoryName = ''
  } = options;

  const params = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': PAGINATION.PAGE_SIZE.toString()
  });

  params.append('populate', 'category');

  if (search) {
    params.append('filters[title][$containsi]', search);
  }

  if (titleExact) {
    params.append('filters[title][$eqi]', titleExact);
  }

  if (categoryName) {
    params.append('filters[category][name][$eqi]', categoryName);
  }

  if (sort) {
    params.append('sort[0]', sort);
  }

  const response = await fetch(
    `${this.baseUrl}/api/articles?${params.toString()}`,
    {
      headers: this.getAuthHeaders()
    }
  );

  if (!response.ok) {
    let message = 'Failed to fetch articles';
    try {
      const details = await response.json();
      message = details?.error?.message || details?.message || message;
    } catch (parseError) {
      console.error('Failed to parse articles error response', parseError);
    }
    throw new Error(message);
  }

  return response.json();
}

  async getArticleById(id: string) {
  const params = new URLSearchParams();
  params.append('populate', 'category');

    const response = await fetch(`${this.baseUrl}/api/articles/${id}?${params.toString()}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error?.message || 'Gagal memuat artikel';
      
      if (response.status === 404) {
        throw new Error('Artikel tidak ditemukan.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Anda tidak memiliki akses ke artikel ini.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    return response.json();
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error?.message || 'Gagal mengunggah gambar';
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengunggah gambar. Silakan login kembali.');
      } else if (response.status === 413) {
        throw new Error('Ukuran file terlalu besar. Maksimal 5MB.');
      } else if (response.status === 415) {
        throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    return response.json();
  }

  resolveMediaUrl(path: string) {
    if (!path) return '';
    return path.startsWith('http') ? path : `${this.baseUrl}${path}`;
  }

  extractUploadUrl(uploadResponse: UploadResponse | null | undefined) {
    if (!uploadResponse) return '';

    const payload: UploadFile[] = Array.isArray(uploadResponse)
      ? uploadResponse
      : Array.isArray(uploadResponse.data)
        ? uploadResponse.data
        : [];

    const [fileData] = payload;
    const rawUrl = fileData?.url ?? fileData?.attributes?.url ?? '';

    return rawUrl ? this.resolveMediaUrl(rawUrl) : '';
  }

  async createArticle(data: { 
    title: string; 
    description: string; 
    cover_image_url?: string; 
    category?: number 
  }) {
    const response = await fetch(`${this.baseUrl}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) {
      const error = await response.json();
      const message = error.error?.message || 'Gagal membuat artikel';
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk membuat artikel. Silakan login kembali.');
      } else if (response.status === 400) {
        throw new Error('Data artikel tidak valid. Periksa kembali form Anda.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    return response.json();
  }

  async updateArticle(id: string, data: { 
    title: string; 
    description: string; 
    cover_image_url?: string; 
    category?: number 
  }) {
    const response = await fetch(`${this.baseUrl}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) {
      const error = await response.json();
      const message = error.error?.message || 'Gagal memperbarui artikel';
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengedit artikel ini.');
      } else if (response.status === 404) {
        throw new Error('Artikel tidak ditemukan.');
      } else if (response.status === 400) {
        throw new Error('Data artikel tidak valid. Periksa kembali form Anda.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    return response.json();
  }

  async deleteArticle(id: string) {
    const response = await fetch(`${this.baseUrl}/api/articles/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error?.message || 'Gagal menghapus artikel';
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk menghapus artikel ini.');
      } else if (response.status === 404) {
        throw new Error('Artikel tidak ditemukan.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      throw new Error(message);
    }
    
    if (response.status === 204) {
      return null;
    }

    const rawText = await response.text();
    if (!rawText) {
      return null;
    }

    try {
      return JSON.parse(rawText);
    } catch (error) {
      console.warn('Unable to parse delete response JSON', error);
      return null;
    }
  }

  // Comment methods - new endpoints
  async getCommentById(documentId: string) {
    const response = await fetch(`${this.baseUrl}/api/comments/${documentId}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch comment');
    return response.json();
  }

  async createComment(data: { 
    content: string; 
    article: string; // article documentId
  }) {
    const response = await fetch(`${this.baseUrl}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  }

  async updateComment(documentId: string, data: { content: string }) {
    const response = await fetch(`${this.baseUrl}/api/comments/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  }

  async deleteComment(documentId: string) {
    const response = await fetch(`${this.baseUrl}/api/comments/${documentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete comment');
    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async getCommentsForArticle(articleId: string, page = 1) {
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': '10',
      'populate[user]': '*',
      'filters[article][documentId][$eq]': articleId,
      'sort[0]': 'createdAt:desc'
    });

    const response = await fetch(`${this.baseUrl}/api/comments?${params}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  }
}

export const apiService = new ApiService();