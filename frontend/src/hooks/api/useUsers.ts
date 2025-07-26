import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';
import { User, Role } from '@/types/user';

export const useListUsers = (params?: { page?: number; size?: number; search?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: async () => (await api.get('/admin/users', { params })).data,
  });

export const useListRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/admin/roles')).data,
  });

export const useCountUsers = () =>
  useQuery({
    queryKey: ['users', 'count'],
    queryFn: async () => (await api.get('/admin/users/count')).data,
  });