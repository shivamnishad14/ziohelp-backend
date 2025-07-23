export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/knowledge-base/articles/${id}/publish`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/knowledge-base/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useListArticles = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: async () => (await api.get('/knowledge-base/articles', { params })).data,
  });

export const useCreateArticle = () => {
  // You can add useMutation logic here if needed
  // Example:
  // return useMutation((data: any) => api.post('/knowledge-base/articles', data));
  return null;
};

export const useUpdateArticle = () => {
  // You can add useMutation logic here if needed
  // Example:
  // return useMutation(({ id, data }: { id: number; data: any }) => api.put(`/knowledge-base/articles/${id}`, data));
  return null;
};

export const useSearchArticles = (q: string) =>
  useQuery({
    queryKey: ['articles', 'search', q],
    queryFn: async () => (await api.get('/knowledge-base/articles/search', { params: { q } })).data,
    enabled: !!q,
  });

export const useArticleCategories = () =>
  useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => (await api.get('/knowledge-base/categories')).data,
  });