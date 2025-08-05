// TanStack Query hooks for Knowledge Base Articles
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleAPI } from '../services/apiService';

export function useArticles(params?: any) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleAPI.getAll(params).then(res => res.data),
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articleAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
}
