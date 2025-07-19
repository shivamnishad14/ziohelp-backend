import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface Product {
  id: number;
  name: string;
  domain: string;
  logoUrl?: string;
  themeColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useListProducts(params?: { page?: number; size?: number; sort?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products/list', { params });
      return data.data || data;
    },
  });
}

export function useGetProduct(productId: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data.data || data;
    },
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data } = await api.post('/products/create', product);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, product }: { productId: number; product: Partial<Product> }) => {
      const { data } = await api.put(`/products/${productId}/update`, product);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, status }: { productId: number; status: string }) => {
      const { data } = await api.put(`/products/${productId}/status`, { status });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const { data } = await api.delete(`/products/${productId}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSearchProducts(params: { query: string; category?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['products-search', params],
    queryFn: async () => {
      const { data } = await api.get('/products/search', { params });
      return data.data || data;
    },
    enabled: !!params.query,
  });
} 