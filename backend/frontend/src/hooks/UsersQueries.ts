// TanStack Query hooks for users
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../services/apiService';

export function useUsers(params?: any) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersAPI.getAll(params).then((res: any) => res.data),
  });
}

// usersAPI does not have getById, so use getMe for current user or getAll for list
export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getAll({ id }).then((res: any) => {
      // Try to find user by id in the returned list
      const user = Array.isArray(res.data) ? res.data.find((u: any) => u.id === id) : null;
      return user;
    }),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
