import apiClient from '@/lib/api-client';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserRole,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

export const userService = {
  // Get all users (admin only)
  getUsers: async (
    organizationId?: string,
    role?: UserRole,
    search?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    if (organizationId) params.append('organizationId', organizationId);
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users?${params.toString()}`
    );
    return response.data.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  // Create new user (admin only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: string, updates: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, updates);
    return response.data.data;
  },

  // Update current user profile
  updateProfile: async (updates: Partial<UpdateUserRequest>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/me', updates);
    return response.data.data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/users/me/change-password', passwordData);
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Enable/disable user (admin only)
  toggleUserStatus: async (id: string, enabled: boolean): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      `/users/${id}/toggle-status`,
      { enabled }
    );
    return response.data.data;
  },

  // Get agents for assignment
  getAgents: async (organizationId?: string): Promise<User[]> => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    params.append('role', 'AGENT');

    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users?${params.toString()}`
    );
    return response.data.data;
  },

  // Invite user to organization
  inviteUser: async (email: string, role: UserRole): Promise<void> => {
    await apiClient.post('/users/invite', { email, role });
  },

  // Reset user password (admin only)
  resetPassword: async (userId: string): Promise<{ temporaryPassword: string }> => {
    const response = await apiClient.post<ApiResponse<{ temporaryPassword: string }>>(
      `/users/${userId}/reset-password`
    );
    return response.data.data;
  },

  // Upload user avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get user statistics (for admin dashboard)
  getUserStats: async (organizationId?: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: Record<UserRole, number>;
  }> => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);

    const response = await apiClient.get<ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      newUsersThisMonth: number;
      usersByRole: Record<UserRole, number>;
    }>>(`/users/stats?${params.toString()}`);
    return response.data.data;
  },
};
