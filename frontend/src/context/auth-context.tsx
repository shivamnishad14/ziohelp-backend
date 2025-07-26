import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { User, UserRole } from '@/types/api';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  getUserRoles: () => UserRole[];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isMasterAdmin: () => boolean;
  isAgent: () => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider mounted');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Try to get current user info from backend
      authService.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Auth context: restored user from backend', userData);
        })
        .catch((error) => {
          console.warn('Failed to restore user session:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Build credentials object for backend
      const credentials = email.includes('@') 
        ? { email, password } 
        : { username: email, password };
      
      console.log('Auth context login with:', credentials);
      const response = await authService.login(credentials as any);
      console.log('Login response:', response);
      
      // Save tokens to localStorage
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Update user state
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('Auth context: user logged in successfully', response.user);
    } catch (error: any) {
      console.error('Auth context login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear React Query cache
    queryClient.clear();
    
    console.log('Auth context: user logged out');
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      console.log('Auth context: user data refreshed', userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, logout the user
      await logout();
    }
  };

  const getUserRoles = (): UserRole[] => {
    return user?.roles || [];
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    const userRoles = getUserRoles();
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return roles.some(role => userRoles.includes(role));
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };

  const isMasterAdmin = (): boolean => {
    return hasRole('MASTER_ADMIN');
  };

  const isAgent = (): boolean => {
    return hasRole('AGENT');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        setUser,
        getUserRoles,
        hasRole,
        hasAnyRole,
        isAdmin,
        isMasterAdmin,
        isAgent,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  console.log('useAuth called');
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth: context is undefined!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};