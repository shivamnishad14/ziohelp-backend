import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Types
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  isApproved?: boolean;
}

interface UserCount {
  count: number;
  total: number;
}

// GET /api/users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data.content; // Use the paginated content array
    },
  });
};

// GET /api/users/me
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/users/me');
      return res.data;
    },
  });
};

// PUT /api/users/me
export const useUpdateMe = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put('/users/me', data);
      return res.data;
    },
  });
};

// GET /api/users/{userId}/roles
export const useUserRoles = (userId: string | number) => {
  return useQuery({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/roles`);
      return res.data;
    },
  });
};

// POST /api/users/{userId}/roles
export const useAddUserRole = () => {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string | number; role: string }) => {
      const res = await api.post(`/users/${userId}/roles`, { role });
      return res.data;
    },
  });
};

// DELETE /api/users/{userId}/roles/{roleName}
export const useDeleteUserRole = () => {
  return useMutation({
    mutationFn: async ({ userId, roleName }: { userId: string | number; roleName: string }) => {
      const res = await api.delete(`/users/${userId}/roles/${roleName}`);
      return res.data;
    },
  });
};

// PUT /api/users/{userId}/toggle-active
export const useToggleUserActive = () => {
  return useMutation({
    mutationFn: async (userId: string | number) => {
      const res = await api.put(`/users/${userId}/toggle-active`);
      return res.data;
    },
  });
};

// PUT /api/users/{userId}/reject-admin
export const useRejectAdmin = () => {
  return useMutation({
    mutationFn: async (userId: string | number) => {
      const res = await api.put(`/users/${userId}/reject-admin`);
      return res.data;
    },
  });
};

// PUT /api/users/{userId}/approve-admin
export const useApproveAdmin = () => {
  return useMutation({
    mutationFn: async (userId: string | number) => {
      const res = await api.put(`/users/${userId}/approve-admin`);
      return res.data;
    },
  });
};

// GET /api/users/roles
export const useAllRoles = () => {
  return useQuery({
    queryKey: ['allRoles'],
    queryFn: async () => {
      const res = await api.get('/users/roles');
      return res.data;
    },
  });
};

// GET /api/users/pending-admins
export const usePendingAdmins = () => {
  return useQuery<User[]>({
    queryKey: ['pendingAdmins'],
    queryFn: async () => {
      const res = await api.get('/users/pending-admins');
      return res.data || [];
    },
  });
};

// GET /api/users/count
export const useUserCount = () => {
  return useQuery<UserCount>({
    queryKey: ['userCount'],
    queryFn: async () => {
      const res = await api.get('/users/count');
      return res.data;
    },
  });
};

// GET /api/users/by-org/{orgId}
export const useUsersByOrg = (orgId: string | number) => {
  return useQuery({
    queryKey: ['usersByOrg', orgId],
    queryFn: async () => {
      const res = await api.get(`/users/by-org/${orgId}`);
      return res.data;
    },
  });
};

// GET /api/users/all
export const useAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await api.get('/users/all');
      return res.data;
    },
  });
};

// POST /api/users
export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/users', data);
      return res.data;
    },
  });
};

// DELETE /api/users/{userId}
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string | number) => {
      const res = await api.delete(`/users/${userId}`);
      return res.data;
    },
  });
};
