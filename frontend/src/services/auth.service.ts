import apiClient from '@/lib/api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ApiResponse,
} from '@/types/api';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<any>(
      '/auth/login',
      credentials
    );
    
    // Handle direct response or wrapped response
    const data = response.data;
    
    console.log('Raw login response:', data);
    
    // If backend returns data directly (not wrapped in ApiResponse)
    if (data && (data.accessToken || data.token)) {
      return {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        expiresIn: data.expiresIn || 3600
      };
    }
    
    // If backend returns wrapped response
    if (data && data.data && (data.data.accessToken || data.data.token)) {
      return {
        accessToken: data.data.accessToken || data.data.token,
        refreshToken: data.data.refreshToken,
        user: data.data.user,
        expiresIn: data.data.expiresIn || 3600
      };
    }
    
    throw new Error('Invalid login response format: ' + JSON.stringify(data));
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<any>(
      '/auth/register',
      userData
    );
    
    const data = response.data;
    console.log('Raw register response:', data);
    
    // Handle direct response or wrapped response
    if (data && data.user) {
      return data.user;
    }
    if (data && data.data && data.data.user) {
      return data.data.user;
    }
    if (data && data.id) {
      return data; // User object returned directly
    }
    
    throw new Error('Invalid register response format');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<any>(
      '/auth/refresh',
      { refreshToken }
    );
    
    const data = response.data;
    console.log('Raw refresh response:', data);
    
    // Handle different response formats
    if (data && (data.accessToken || data.token)) {
      return {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        expiresIn: data.expiresIn || 3600
      };
    }
    
    if (data && data.data && (data.data.accessToken || data.data.token)) {
      return {
        accessToken: data.data.accessToken || data.data.token,
        refreshToken: data.data.refreshToken,
        user: data.data.user,
        expiresIn: data.data.expiresIn || 3600
      };
    }
    
    throw new Error('Invalid refresh token response format');
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed, continuing with local cleanup:', error);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<any>('/auth/me');
    
    const data = response.data;
    console.log('Raw current user response:', data);
    
    // Handle different response formats
    if (data && data.id) {
      return data; // User object returned directly
    }
    if (data && data.data && data.data.id) {
      return data.data;
    }
    if (data && data.user) {
      return data.user;
    }
    
    throw new Error('Invalid current user response format');
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
