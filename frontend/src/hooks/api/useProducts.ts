import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useListProducts = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: async () => (await api.get('/admin/products', { params })).data,
  });

export const useSearchProducts = (q: string) =>
  useQuery({
    queryKey: ['products', 'search', q],
    queryFn: async () => (await api.get('/admin/products/search', { params: { q } })).data,
    enabled: !!q,
  });

export const useUpdateProductStatus = () => {};