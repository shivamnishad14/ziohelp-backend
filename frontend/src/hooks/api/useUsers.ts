// Get a single user
export const useGetUser = (id: number) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => userAPI.getById(id),
    enabled: !!id,
  });

// Create a user (stub)
export const useCreateUser = () => useMutation({ mutationFn: async () => {} });

// Update a user (stub)
export const useUpdateUser = () => useMutation({ mutationFn: async () => {} });
// Pending admins (stub)
export const usePendingAdmins = () => useQuery({ queryKey: ['pendingAdmins'], queryFn: async () => [] });

// Reject admin (stub)
export const useRejectAdmin = () => useMutation({ mutationFn: async () => {} });
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services/API';
import { User, Role } from '@/types/index';

export const useListUsers = (params?: { page?: number; size?: number; search?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => userAPI.getAll(params),
  });

export const useListRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await userAPI.getAll({ role: true })).data,
  });

export const useCountUsers = () =>
  useQuery({
    queryKey: ['users', 'count'],
    queryFn: async () => (await userAPI.getAll({ count: true })).data,
  });
// Search users (stub)
export const useSearchUsers = () => useQuery({ queryKey: ['searchUsers'], queryFn: async () => [] });

// Delete user (stub)
export const useDeleteUser = () => useMutation({ mutationFn: async () => {} });

// Update user role (stub)
export const useUpdateUserRole = () => useMutation({ mutationFn: async () => {} });

// Toggle active (stub)
export const useToggleActive = () => useMutation({ mutationFn: async () => {} });

// Approve admin (stub)
export const useApproveAdmin = () => useMutation({ mutationFn: async () => {} });