import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

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