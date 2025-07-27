import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '@/services/api';
import { Product, ProductFormData, PaginatedProducts } from '@/types';

export const useProducts = (params?: { page?: number; size?: number; search?: string }) =>
  useQuery<PaginatedProducts>({
    queryKey: ['products', params],
    queryFn: () => productAPI.getProducts(params).then(res => res.data),
  });

export const useProduct = (id: number) =>
  useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => productAPI.getProduct(id).then(res => res.data),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProductFormData) => productAPI.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => 
      productAPI.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Legacy exports
export const useListProducts = useProducts;
export const useGetProduct = useProduct;

export const useSearchProducts = (q: string) =>
  useQuery({
    queryKey: ['products', 'search', q],
    queryFn: async () => (await api.get('/admin/products/search', { params: { q } })).data,
    enabled: !!q,
  });

export const useUpdateProductStatus = () => {};