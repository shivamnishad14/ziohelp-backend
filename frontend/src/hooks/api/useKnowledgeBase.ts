import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeBaseAPI } from '@/services/api';
import { KnowledgeBaseArticle, KnowledgeBaseFormData, KnowledgeBaseSearchParams, PaginatedKnowledgeBase } from '@/types';

export const useArticles = (params?: KnowledgeBaseSearchParams) =>
  useQuery<PaginatedKnowledgeBase>({
    queryKey: ['knowledge-base', params],
    queryFn: () => knowledgeBaseAPI.getArticles(params).then(res => res.data),
  });

export const useArticle = (id: number) =>
  useQuery<KnowledgeBaseArticle>({
    queryKey: ['knowledge-base', id],
    queryFn: () => knowledgeBaseAPI.getArticle(id).then(res => res.data),
    enabled: !!id,
  });

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: KnowledgeBaseFormData) => knowledgeBaseAPI.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: KnowledgeBaseFormData }) => 
      knowledgeBaseAPI.updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => knowledgeBaseAPI.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => knowledgeBaseAPI.publishArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

// Legacy exports
export const useListArticles = useArticles;
export const useGetArticle = useArticle;

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