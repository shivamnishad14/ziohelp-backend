// TanStack Query hooks for permissions
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsAPI } from '../services/apiService';

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsAPI.getAll().then(res => res.data),
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permissionsAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permissionsAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  });
}
