// TanStack Query hooks for organizations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsAPI } from '../services/apiService';

export function useOrganizations(params?: any) {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => organizationsAPI.getAll(params).then(res => res.data),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationsAPI.create,
    onSuccess: () => queryClient.invalidateQueries(['organizations']),
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationsAPI.delete,
    onSuccess: () => queryClient.invalidateQueries(['organizations']),
  });
}

export function useOrganization(id: number) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationsAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
}
