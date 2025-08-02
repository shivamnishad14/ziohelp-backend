import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeBaseAPI, api } from '@/services/api';
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
    mutationFn: (data: any) => knowledgeBaseAPI.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, article }: { articleId: number; article: any }) =>
      knowledgeBaseAPI.updateArticle(articleId, article),
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

export const useSearchArticles = (params: any) =>
  useQuery({
    queryKey: ['articles', 'search', params],
    queryFn: async () => (await api.get('/knowledge-base/search', { params })).data,
    enabled: !!params && (!!params.query || !!params.category),
  });

export const useArticleCategories = (productId?: number) =>
  useQuery({
    queryKey: ['article-categories', productId],
    queryFn: async () => (await api.get('/knowledge-base/categories', { params: { productId } })).data,
  });