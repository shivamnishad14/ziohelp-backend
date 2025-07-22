import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../../services/api';
import { User } from '../../types/api/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  data: AuthUser;
  id: number;
  email: string;
  name: string;
  role: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post('/api/auth/login', payload);
      return data.data || data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/api/auth/logout');
      return data.data || data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; name: string }) => {
      const { data } = await api.post('/api/auth/register', payload);
      return data.data || data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post('/api/auth/forgot-password', payload);
      return data.data || data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { token: string; newPassword: string }) => {
      const { data } = await api.post('/api/auth/reset-password', payload);
      return data.data || data;
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<AuthUser>('/api/auth/me');
      return data.data || data;
    },
  });
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing user info:', error);
        authAPI.clearAuth();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authAPI.login(credentials.email, credentials.password);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
        
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authAPI.clearAuth();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        const user = response.data.data;
        setAuthState(prev => ({ ...prev, user }));
        return user;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const hasRole = useCallback((role: string) => {
    return authState.user?.role === role;
  }, [authState.user]);

  const hasPermission = useCallback((permission: string) => {
    // Implement permission checking logic based on user role
    const userRole = authState.user?.role;
    
    switch (userRole) {
      case 'ADMIN':
        return true; // Admin has all permissions
      case 'AGENT':
        return ['read', 'write', 'update'].includes(permission);
      case 'USER':
        return ['read'].includes(permission);
      default:
        return false;
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    getCurrentUser,
    hasRole,
    hasPermission
  };
}; 