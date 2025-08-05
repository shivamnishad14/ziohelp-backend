// GET /api/menu/all (admin: get all menu items)
export function useAllMenuItems() {
  return useQuery<MenuItem[]>({
    queryKey: ['all-menu-items'],
    queryFn: async () => {
      const response = await api.get('/menu/all');
      return response.data as MenuItem[];
    },
  });
}

// GET /api/menu (user: get menu items for current user)
export function useUserMenuItems() {
  const { user } = useAuth();
  return useQuery<MenuItem[]>({
    queryKey: ['menu-items', user?.id],
    queryFn: async () => {
      const response = await api.get('/menu');
      return response.data as MenuItem[];
    },
    enabled: !!user,
  });
}

// POST /api/menu (create menu item)
export function useCreateMenuItem(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      const response = await api.post('/menu', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      onSuccess?.();
    },
  });
}

// PUT /api/menu/{id} (update menu item)
export function useUpdateMenuItem(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await api.put(`/menu/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      onSuccess?.();
    },
  });
}

// DELETE /api/menu/{id} (delete menu item)
export function useDeleteMenuItem(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/menu/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      onSuccess?.();
    },
  });
}

// PUT /api/menu/{id}/roles (update roles for menu item)
export function useUpdateMenuRoles(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, roles }: { id: number; roles: string[] }) => {
      await api.put(`/menu/${id}/roles`, roles);
      return { id, roles };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      onSuccess?.();
    },
  });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthProvider';

export interface MenuItem {
  id: number;
  name: string;
  path: string; // Changed from url to path to match backend
  icon: string;
  description?: string;
  sortOrder: number; // Changed from displayOrder to sortOrder
  isActive: boolean;
  category?: string;
  parentId: number | null;
  roles?: string[];
  children?: MenuItem[];
}

export function useMenuItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery<MenuItem[]>({
    queryKey: ['menu-items', user?.id],
    queryFn: async () => {
      const response = await api.get('/menu');
      return response.data as MenuItem[];
    },
    enabled: !!user,
  });
  return {
    ...query,
    invalidateMenu: () => queryClient.invalidateQueries({ queryKey: ['menu-items', user?.id] }),
  };
}

// Fetch available roles for multi-select
export function useAvailableRoles() {
  return useQuery<string[]>({
    queryKey: ['available-roles'],
    queryFn: async () => {
      const response = await api.get('/menu/roles');
      return response.data as string[];
    },
  });
}

// Admin CRUD/role mutations for menu management
export function useMenuMutations({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  
  // Helper to invalidate all menu-related queries
  const invalidateAllMenuQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
    queryClient.invalidateQueries({ queryKey: ['available-roles'] });
  };

  const createMenuMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      const response = await api.post('/menu', data);
      return response.data;
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Create menu error:', error);
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await api.put(`/menu/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Update menu error:', error);
    },
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/menu/${id}`);
      return id;
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Delete menu error:', error);
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: async ({ id, roles }: { id: number; roles: string[] }) => {
      await api.put(`/menu/${id}/roles`, roles);
      return { id, roles };
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Update roles error:', error);
    },
  });

  // Bulk operations
  const createMenuItemsMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>[]) => {
      const response = await api.post('/menu/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
  });

  const deleteMenuItemsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await api.delete('/menu/bulk', { data: ids });
      return ids;
    },
    onSuccess: () => {
      invalidateAllMenuQueries();
      onSuccess?.();
    },
  });

  return {
    // Mutation objects (for .mutate, .isLoading, etc.)
    createMenuMutation,
    updateMenuMutation,
    deleteMenuMutation,
    updateRolesMutation,
    createMenuItemsMutation,
    deleteMenuItemsMutation,
    
    // Legacy methods (deprecated)
    createMenu: createMenuMutation.mutate,
    updateMenu: updateMenuMutation.mutate,
    deleteMenu: deleteMenuMutation.mutate,
    updateMenuRoles: updateRolesMutation.mutate,
    
    // Loading states
    createLoading: createMenuMutation.status === 'pending',
    updateLoading: updateMenuMutation.status === 'pending',
    deleteLoading: deleteMenuMutation.status === 'pending',
    updateRolesLoading: updateRolesMutation.status === 'pending',
    
    // Helper
    invalidateMenu: invalidateAllMenuQueries,
  };
}

export function useAdminMenuItems() {
  return useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const res = await api.get('/menu/all');
      return res.data;
    }
  });
}
