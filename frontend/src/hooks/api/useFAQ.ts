export const useFAQsByProduct = (productId: number) =>
  useQuery({
    queryKey: ['faqs', 'product', productId],
    queryFn: async () => (await api.get(`/faqs/product/${productId}`)).data,
    enabled: !!productId,
  });
import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useFAQs = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['faqs', params],
    queryFn: async () => (await api.get('/faqs', { params })).data,
  });

export const useCreateFAQ = () => {
  // You can add useMutation logic here if needed
  // Example:
  // return useMutation((data: any) => api.post('/faqs', data));
  return null;
};

export const useSearchFAQs = (q: string) =>
  useQuery({
    queryKey: ['faqs', 'search', q],
    queryFn: async () => (await api.get('/faqs/search', { params: { q } })).data,
    enabled: !!q,
  });

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