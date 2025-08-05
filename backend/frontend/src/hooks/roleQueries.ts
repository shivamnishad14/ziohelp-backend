// TanStack Query hooks for roles
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesAPI } from '../services/apiService';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesAPI.getAll().then(res => res.data),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}
