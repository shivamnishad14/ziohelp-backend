import apiClient from '@/lib/api-client';
import {
  KBArticle,
  KBCategory,
  CreateKBArticleRequest,
  UpdateKBArticleRequest,
  CreateKBCategoryRequest,
  UpdateKBCategoryRequest,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

export const knowledgeBaseService = {
  // Articles
  articles: {
    // Get all articles with filters
    getAll: async (
      categoryId?: string,
      search?: string,
      published?: boolean,
      pagination?: PaginationParams
    ): Promise<PaginatedResponse<KBArticle>> => {
      const params = new URLSearchParams();
      
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);
      if (published !== undefined) params.append('published', published.toString());
      
      if (pagination) {
        Object.entries(pagination).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiClient.get<ApiResponse<PaginatedResponse<KBArticle>>>(
        `/kb/articles?${params.toString()}`
      );
      return response.data.data;
    },

    // Get article by ID
    getById: async (id: string): Promise<KBArticle> => {
      const response = await apiClient.get<ApiResponse<KBArticle>>(`/kb/articles/${id}`);
      return response.data.data;
    },

    // Get article by slug (for public access)
    getBySlug: async (slug: string): Promise<KBArticle> => {
      const response = await apiClient.get<ApiResponse<KBArticle>>(`/kb/articles/slug/${slug}`);
      return response.data.data;
    },

    // Create new article
    create: async (articleData: CreateKBArticleRequest): Promise<KBArticle> => {
      const response = await apiClient.post<ApiResponse<KBArticle>>(
        '/kb/articles',
        articleData
      );
      return response.data.data;
    },

    // Update article
    update: async (id: string, updates: UpdateKBArticleRequest): Promise<KBArticle> => {
      const response = await apiClient.put<ApiResponse<KBArticle>>(
        `/kb/articles/${id}`,
        updates
      );
      return response.data.data;
    },

    // Delete article
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/kb/articles/${id}`);
    },

    // Publish/unpublish article
    togglePublish: async (id: string, published: boolean): Promise<KBArticle> => {
      const response = await apiClient.post<ApiResponse<KBArticle>>(
        `/kb/articles/${id}/toggle-publish`,
        { published }
      );
      return response.data.data;
    },

    // Rate article (for public users)
    rate: async (id: string, rating: number): Promise<void> => {
      await apiClient.post(`/kb/articles/${id}/rate`, { rating });
    },

    // Get popular articles
    getPopular: async (limit: number = 10): Promise<KBArticle[]> => {
      const response = await apiClient.get<ApiResponse<KBArticle[]>>(
        `/kb/articles/popular?limit=${limit}`
      );
      return response.data.data;
    },

    // Search articles (full-text search)
    search: async (
      query: string,
      categoryId?: string,
      pagination?: PaginationParams
    ): Promise<PaginatedResponse<KBArticle>> => {
      const params = new URLSearchParams({ query });
      
      if (categoryId) params.append('categoryId', categoryId);
      
      if (pagination) {
        Object.entries(pagination).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiClient.get<ApiResponse<PaginatedResponse<KBArticle>>>(
        `/kb/articles/search?${params.toString()}`
      );
      return response.data.data;
    },
  },

  // Categories
  categories: {
    // Get all categories
    getAll: async (): Promise<KBCategory[]> => {
      const response = await apiClient.get<ApiResponse<KBCategory[]>>('/kb/categories');
      return response.data.data;
    },

    // Get category by ID
    getById: async (id: string): Promise<KBCategory> => {
      const response = await apiClient.get<ApiResponse<KBCategory>>(`/kb/categories/${id}`);
      return response.data.data;
    },

    // Create new category
    create: async (categoryData: CreateKBCategoryRequest): Promise<KBCategory> => {
      const response = await apiClient.post<ApiResponse<KBCategory>>(
        '/kb/categories',
        categoryData
      );
      return response.data.data;
    },

    // Update category
    update: async (id: string, updates: UpdateKBCategoryRequest): Promise<KBCategory> => {
      const response = await apiClient.put<ApiResponse<KBCategory>>(
        `/kb/categories/${id}`,
        updates
      );
      return response.data.data;
    },

    // Delete category
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/kb/categories/${id}`);
    },

    // Reorder categories
    reorder: async (categoryOrders: Array<{ id: string; order: number }>): Promise<void> => {
      await apiClient.post('/kb/categories/reorder', { categoryOrders });
    },
  },

  // Statistics and analytics
  getStats: async (): Promise<{
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    avgRating: number;
    popularArticles: Array<{ id: string; title: string; views: number }>;
    searchQueries: Array<{ query: string; count: number }>;
  }> => {
    const response = await apiClient.get<ApiResponse<{
      totalArticles: number;
      publishedArticles: number;
      totalViews: number;
      avgRating: number;
      popularArticles: Array<{ id: string; title: string; views: number }>;
      searchQueries: Array<{ query: string; count: number }>;
    }>>('/kb/stats');
    return response.data.data;
  },

  // Upload images for articles
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      '/kb/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Export articles (for backup/migration)
  exportArticles: async (format: 'json' | 'csv' | 'pdf' = 'json'): Promise<Blob> => {
    const response = await apiClient.get(`/kb/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import articles from file
  importArticles: async (file: File): Promise<{ 
    imported: number; 
    failed: number; 
    errors: string[] 
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ 
      imported: number; 
      failed: number; 
      errors: string[] 
    }>>(
      '/kb/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};
