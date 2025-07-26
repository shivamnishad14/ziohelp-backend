import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useFAQsByCategory = (categoryId: number) =>
  useQuery({
    queryKey: ['faqs', 'category', categoryId],
    queryFn: async () => (await api.get(`/faqs/category/${categoryId}`)).data,
    enabled: !!categoryId,
  });

export const useFAQCategories = () =>
  useQuery({
    queryKey: ['faq-categories'],
    queryFn: async () => (await api.get('/faqs/categories')).data,
  });