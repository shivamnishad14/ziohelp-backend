import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleAPI } from '@/services/api';
import { Role } from '@/types';

export const useRoles = (params?: { page?: number; size?: number }) =>
  useQuery<{ content: Role[]; totalElements: number; totalPages: number }>({
    queryKey: ['roles', params],
    queryFn: () => roleAPI.getRoles(params).then(res => res.data),
  });

export const useRole = (id: number) =>
  useQuery<Role>({
    queryKey: ['roles', id],
    queryFn: () => roleAPI.getRole(id).then(res => res.data),
    enabled: !!id,
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string }) => roleAPI.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string } }) => 
      roleAPI.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => roleAPI.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Legacy exports
export const useListRoles = useRoles;