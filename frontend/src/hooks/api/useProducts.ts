
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '@/services/API';

export const useListProducts = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productAPI.getAll(params),
  });

export const useSearchProducts = (q: string) =>
  useQuery({
    queryKey: ['products', 'search', q],
    queryFn: async () => (await productAPI.getAll({ q })),
    enabled: !!q,
  });


export const useGetProduct = (id: number) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
    enabled: !!id,
  });


export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => productAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};