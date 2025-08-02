import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthProvider';

export interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  parentId: number | null;
  displayOrder: number;
  isActive: boolean;
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

// Admin CRUD/role mutations for menu management
export function useMenuMutations({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // Helper to invalidate menu query
  const invalidateMenu = () => queryClient.invalidateQueries({ queryKey: ['menu-items', user?.id] });

  const createMenuMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      return api.post('/menu', data);
    },
    onSuccess: () => {
      invalidateMenu();
      onSuccess?.();
    },
  });
  const updateMenuMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return api.put(`/menu/${id}`, data);
    },
    onSuccess: () => {
      invalidateMenu();
      onSuccess?.();
    },
  });
  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/menu/${id}`);
    },
    onSuccess: () => {
      invalidateMenu();
      onSuccess?.();
    },
  });
  const updateRolesMutation = useMutation({
    mutationFn: async ({ id, roles }: { id: number; roles: string[] }) => {
      return api.put(`/menu/${id}/roles`, roles);
    },
    onSuccess: () => {
      invalidateMenu();
      onSuccess?.();
    },
  });

  return {
    createMenu: createMenuMutation.mutate,
    updateMenu: updateMenuMutation.mutate,
    deleteMenu: deleteMenuMutation.mutate,
    updateMenuRoles: updateRolesMutation.mutate,
    createLoading: createMenuMutation.status === 'pending',
    updateLoading: updateMenuMutation.status === 'pending',
    deleteLoading: deleteMenuMutation.status === 'pending',
    updateRolesLoading: updateRolesMutation.status === 'pending',
    invalidateMenu,
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
