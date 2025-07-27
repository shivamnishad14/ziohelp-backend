import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { User, UserFormData, UserSearchParams, PaginatedUsers, UserUpdateData, UserRole, USER_ROLES } from '@/types';

export const useUsers = (params?: UserSearchParams) =>
  useQuery<PaginatedUsers>({
    queryKey: ['users', params],
    queryFn: () => userAPI.getUsers(params).then(res => res.data),
  });

export const useUser = (id: number) =>
  useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => userAPI.getUser(id).then(res => res.data),
    enabled: !!id,
  });

export const useUserProfile = () =>
  useQuery<User>({
    queryKey: ['users', 'profile'],
    queryFn: () => userAPI.getProfile().then(res => res.data),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserFormData) => userAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateData }) => 
      userAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserUpdateData) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) => 
      userAPI.updateUserRole(id, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useToggleActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userAPI.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useSearchUsers = (params: UserSearchParams) =>
  useQuery<PaginatedUsers>({
    queryKey: ['users', 'search', params],
    queryFn: () => userAPI.getUsers(params).then(res => res.data),
    enabled: !!params.search,
  });

export const useApproveAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userAPI.updateUser(id, { approved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useRejectAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const usePendingAdmins = () =>
  useQuery<PaginatedUsers>({
    queryKey: ['users', 'pending-admins'],
    queryFn: () => userAPI.getUsers({ role: 'ADMIN', approved: false }).then(res => res.data),
  });

export const useListUsers = (params?: UserSearchParams) => useUsers(params);
export const useGetUser = (id: number) => useUser(id);
export const useCountUsers = () =>
  useQuery<number>({
    queryKey: ['users', 'count'],
    queryFn: () => userAPI.getUsers({ size: 1 }).then(res => res.data.totalElements),
  });

// Export UserRole for backward compatibility
export { USER_ROLES as UserRole };