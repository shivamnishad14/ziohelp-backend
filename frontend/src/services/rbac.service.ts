import { apiClient } from '@/lib/api-client';
import { 
  Permission, 
  MenuItem, 
  RoleExtended, 
  RoleMenuPermission, 
  RoleFormData, 
  PermissionFormData,
  MenuItemFormData,
  RoleResponse,
  PermissionResponse,
  MenuItemResponse
} from '@/types/rbac';
import { ApiResponse, PaginatedResponse } from '@/types';

class RBACService {
  // Roles
  async getRoles(params?: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<RoleResponse> {
    const { data } = await apiClient.get('/api/v1/roles', { params });
    return data;
  }

  async getRole(id: number): Promise<ApiResponse<RoleExtended>> {
    const { data } = await apiClient.get(`/api/v1/roles/${id}`);
    return data;
  }

  async createRole(roleData: RoleFormData): Promise<ApiResponse<RoleExtended>> {
    const { data } = await apiClient.post('/api/v1/roles', roleData);
    return data;
  }

  async updateRole(id: number, roleData: Partial<RoleFormData>): Promise<ApiResponse<RoleExtended>> {
    const { data } = await apiClient.put(`/api/v1/roles/${id}`, roleData);
    return data;
  }

  async deleteRole(id: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/api/v1/roles/${id}`);
    return data;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.post(`/api/v1/users/${userId}/roles/${roleId}`);
    return data;
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/api/v1/users/${userId}/roles/${roleId}`);
    return data;
  }

  // Permissions
  async getPermissions(params?: {
    page?: number;
    size?: number;
    search?: string;
    resource?: string;
    action?: string;
  }): Promise<PermissionResponse> {
    const { data } = await apiClient.get('/api/v1/permissions', { params });
    return data;
  }

  async getPermission(id: number): Promise<ApiResponse<Permission>> {
    const { data } = await apiClient.get(`/api/v1/permissions/${id}`);
    return data;
  }

  async createPermission(permissionData: PermissionFormData): Promise<ApiResponse<Permission>> {
    const { data } = await apiClient.post('/api/v1/permissions', permissionData);
    return data;
  }

  async updatePermission(id: number, permissionData: Partial<PermissionFormData>): Promise<ApiResponse<Permission>> {
    const { data } = await apiClient.put(`/api/v1/permissions/${id}`, permissionData);
    return data;
  }

  async deletePermission(id: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/api/v1/permissions/${id}`);
    return data;
  }

  async assignPermissionToRole(roleId: number, permissionId: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.post(`/api/v1/roles/${roleId}/permissions/${permissionId}`);
    return data;
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/api/v1/roles/${roleId}/permissions/${permissionId}`);
    return data;
  }

  // Menu Items
  async getMenuItems(params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<MenuItemResponse> {
    const { data } = await apiClient.get('/api/v1/menu-items', { params });
    return data;
  }

  async getMenuItem(id: number): Promise<ApiResponse<MenuItem>> {
    const { data } = await apiClient.get(`/api/v1/menu-items/${id}`);
    return data;
  }

  async createMenuItem(menuData: MenuItemFormData): Promise<ApiResponse<MenuItem>> {
    const { data } = await apiClient.post('/api/v1/menu-items', menuData);
    return data;
  }

  async updateMenuItem(id: number, menuData: Partial<MenuItemFormData>): Promise<ApiResponse<MenuItem>> {
    const { data } = await apiClient.put(`/api/v1/menu-items/${id}`, menuData);
    return data;
  }

  async deleteMenuItem(id: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/api/v1/menu-items/${id}`);
    return data;
  }

  // Role Menu Permissions
  async getRoleMenuPermissions(roleId: number): Promise<ApiResponse<RoleMenuPermission[]>> {
    const { data } = await apiClient.get(`/api/v1/roles/${roleId}/menu-permissions`);
    return data;
  }

  async updateRoleMenuPermission(
    roleId: number, 
    menuItemId: number, 
    permissions: { canView: boolean; canEdit: boolean; canDelete: boolean }
  ): Promise<ApiResponse<RoleMenuPermission>> {
    const { data } = await apiClient.put(`/api/v1/roles/${roleId}/menu-permissions/${menuItemId}`, permissions);
    return data;
  }

  // User-specific methods
  async getUserPermissions(userId: number): Promise<ApiResponse<Permission[]>> {
    const { data } = await apiClient.get(`/api/v1/users/${userId}/permissions`);
    return data;
  }

  async getUserMenus(userId: number): Promise<ApiResponse<MenuItem[]>> {
    const { data } = await apiClient.get(`/api/v1/users/${userId}/menus`);
    return data;
  }

  async getUserMenuPermissions(userId: number): Promise<ApiResponse<RoleMenuPermission[]>> {
    const { data } = await apiClient.get(`/api/v1/users/${userId}/menu-permissions`);
    return data;
  }

  // Bulk operations
  async bulkAssignRoles(userIds: number[], roleIds: number[]): Promise<ApiResponse<void>> {
    const { data } = await apiClient.post('/api/v1/roles/bulk-assign', { userIds, roleIds });
    return data;
  }

  async bulkAssignPermissions(roleIds: number[], permissionIds: number[]): Promise<ApiResponse<void>> {
    const { data } = await apiClient.post('/api/v1/permissions/bulk-assign', { roleIds, permissionIds });
    return data;
  }

  // Role templates
  async getRoleTemplates(): Promise<ApiResponse<RoleExtended[]>> {
    const { data } = await apiClient.get('/api/v1/roles/templates');
    return data;
  }

  async createRoleFromTemplate(templateId: number, roleName: string): Promise<ApiResponse<RoleExtended>> {
    const { data } = await apiClient.post(`/api/v1/roles/from-template/${templateId}`, { name: roleName });
    return data;
  }

  // Validation
  async validateRoleName(name: string, excludeId?: number): Promise<ApiResponse<{ isAvailable: boolean }>> {
    const { data } = await apiClient.get('/api/v1/roles/validate-name', { 
      params: { name, excludeId } 
    });
    return data;
  }

  async validatePermissionName(name: string, excludeId?: number): Promise<ApiResponse<{ isAvailable: boolean }>> {
    const { data } = await apiClient.get('/api/v1/permissions/validate-name', { 
      params: { name, excludeId } 
    });
    return data;
  }

  async validateMenuPath(path: string, excludeId?: number): Promise<ApiResponse<{ isAvailable: boolean }>> {
    const { data } = await apiClient.get('/api/v1/menu-items/validate-path', { 
      params: { path, excludeId } 
    });
    return data;
  }
}

export const rbacService = new RBACService();
