// TanStack Query hooks for menu
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuAPI } from '../services/apiService';

export function useAllMenuItems() {
  return useQuery({
    queryKey: ['menu-all'],
    queryFn: () => menuAPI.getAll().then(res => res.data),
  });
}

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: () => menuAPI.get().then(res => res.data),
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-all'] }),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-all'] }),
  });
}
