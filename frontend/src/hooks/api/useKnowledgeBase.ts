import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

// Types
export interface KnowledgeBaseArticle {
  id: number;
  productId: number;
  title: string;
  content: string;
  category: string;
  author?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleListResponse {
  content: KnowledgeBaseArticle[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// API base
const API = '/api/v1/knowledge-base/articles';

// List all articles (paginated)
export function useListArticles(params: { productId: number; page?: number; size?: number; sort?: string }) {
  return useQuery({
    queryKey: ['kb-articles', params],
    queryFn: async () => {
      const { data } = await api.get<ArticleListResponse>(`${API}/list`, { params });
      return data;
    },
  });
}

// Get article by ID
export function useGetArticle(articleId: number) {
  return useQuery({
    queryKey: ['kb-article', articleId],
    queryFn: async () => {
      const { data } = await api.get<KnowledgeBaseArticle>(`${API}/${articleId}`);
      return data;
    },
    enabled: !!articleId,
  });
}

// Create new article
export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: Partial<KnowledgeBaseArticle>) => {
      const { data } = await api.post(`${API}/create`, article);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-articles'] });
    },
  });
}

// Update article
export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ articleId, article }: { articleId: number; article: Partial<KnowledgeBaseArticle> }) => {
      const { data } = await api.put(`${API}/${articleId}/update`, article);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-articles'] });
    },
  });
}

// Publish/unpublish article
export function usePublishArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ articleId, published }: { articleId: number; published: boolean }) => {
      const { data } = await api.put(`${API}/${articleId}/publish`, null, { params: { published } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-articles'] });
    },
  });
}

// Delete article
export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: number) => {
      const { data } = await api.delete(`${API}/${articleId}/delete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-articles'] });
    },
  });
}

// Search articles
export function useSearchArticles(params: { productId: number; query: string; category?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['kb-articles-search', params],
    queryFn: async () => {
      const { data } = await api.get<ArticleListResponse>(`${API}/search`, { params });
      return data;
    },
    enabled: !!params.query,
  });
}

// Get article categories
export function useArticleCategories(productId: number) {
  return useQuery({
    queryKey: ['kb-article-categories', productId],
    queryFn: async () => {
      const { data } = await api.get<string[]>(`${API}/categories`, { params: { productId } });
      return data;
    },
    enabled: !!productId,
  });
} 