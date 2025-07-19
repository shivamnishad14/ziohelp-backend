import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { userAPI } from '../../services/api';

export type UserRole = 'USER' | 'ADMIN' | 'DEVELOPER' | 'SUPER_ADMIN' | 'ENGINEER';
export type UserStatus = 'approved' | 'pending' | 'suspended' | string;

export interface Role {
  id: number;
  name: UserRole;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  productId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useListUsers(params?: { page?: number; size?: number; search?: string; sortBy?: string; sortDir?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await userAPI.getAll(params);
      return data;
    },
  });
}

export function useGetUser(userId: number, options?: { enabled?: boolean }) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data.data || data;
    },
    enabled: options?.enabled ?? !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, user }: { productId: number; user: Partial<User> }) => {
      const { data } = await api.post('/users/create', user, { params: { productId } });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, user }: { userId: number; user: Partial<User> }) => {
      const { data } = await api.put(`/users/${userId}/update`, user);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: UserRole }) => {
      const { data } = await api.put(`/users/${userId}/role`, null, { params: { role } });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await api.delete(`/users/${userId}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useSearchUsers(params: { query: string; role?: UserRole; page?: number; size?: number }) {
  return useQuery<{ content: User[]; totalElements: number; totalPages: number } | User[]>({
    queryKey: ['users-search', params],
    queryFn: async () => {
      const { data } = await api.get('/users/search', { params });
      return data.data || data;
    },
    enabled: !!params.query,
  });
}

export function useToggleActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/users/toggle-active/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useApproveAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/users/approve-admin/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useRejectAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/users/reject-admin/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function usePendingAdmins() {
  return useQuery<User[]>({
    queryKey: ['users-pending-admins'],
    queryFn: async () => {
      const { data } = await api.get('/users/pending-admins');
      return data.data || data;
    },
  });
}

export function useCountUsers(productId?: number) {
  return useQuery<number>({
    queryKey: ['users-count', productId],
    queryFn: async () => {
      const { data } = await api.get('/users/count', productId ? { params: { productId } } : undefined);
      return data.data || data;
    },
    enabled: productId === undefined || !!productId,
  });
}

export function useListRoles() {
  return useQuery<Role[]>({
    queryKey: ['users-roles'],
    queryFn: async () => {
      const { data } = await api.get('/users/roles');
      return data.data || data;
    },
  });
} 