import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleAPI } from '@/services/API';
import { Role } from '@/types';

// Fetch all roles with pagination, search, and filter
export function useRoles(params: { page: number; size: number; sort?: string; search?: string; filter?: string }) {
  return useQuery(['roles', params], () => roleAPI.getAll(params), {
    keepPreviousData: true,
  });
}

// Create a new role
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation((data: { name: string }) => roleAPI.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
  });
}

// Update a role
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }: { id: number; data: { name: string } }) => roleAPI.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
  });
}

// Delete a role
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation((id: number) => roleAPI.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
  });
}




// Role API
// export const roleAPI = {
//   getAll: (pageable?: any) => {
//     // Convert legacy sort format to new format
//     const params = { ...pageable };
//     if (params.sort) {
//       const [sortBy, sortDirection] = params.sort.split(',');
//       params.sortBy = sortBy || 'name';
//       params.sortDirection = sortDirection || 'asc';
//       delete params.sort;
//     }
//     return api.get<{
//       data: any; content: Role[], totalElements: number, totalPages: number 
// }>('/roles/list', { params });
//   },
//   getAllList: () => 
//     api.get<Role[]>('/roles/all'),
//   getById: (id: string) => 
//     api.get<Role>(`/roles/${id}`),
//   getByName: (name: string) => 
//     api.get<Role>(`/roles/name/${name}`),
//   create: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>) => 
//     api.post<Role>('/roles/create', role),
//   update: (id: string, role: Partial<Role>) => 
//     api.put<Role>(`/roles/${id}/update`, role),
//   delete: (id: string) => 
//     api.delete(`/roles/${id}/delete`),
//   checkNameExists: (name: string) => 
//     api.get<boolean>(`/roles/check-name/${name}`),
//   checkIdExists: (id: string) => 
//     api.get<boolean>(`/roles/check-id/${id}`),
//   search: (searchRequest: any) => 
//     api.post<{ content: Role[], totalElements: number, totalPages: number }>('/roles/search', searchRequest),
//   getCount: () => 
//     api.get<number>('/roles/count'),
// };