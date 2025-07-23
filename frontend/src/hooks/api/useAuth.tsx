import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI } from '@/services/API';

interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => void;
  getUserRoles: () => string[];
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !!localStorage.getItem('authToken'),
    retry: false,
  });

  useEffect(() => {
    if (error) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRoles');
    }
  }, [error]);
  
  useEffect(() => {
    if (
      currentUser &&
      typeof currentUser === 'object' &&
      'id' in currentUser &&
      'username' in currentUser &&
      'email' in currentUser &&
      'roles' in currentUser
    ) {
      setUser(currentUser as User);
    } else {
      setUser(null);
    }
  }, [currentUser]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Ensure username is a string (fallback to empty string if undefined)
      const payload = {
        username: credentials.username ?? '',
        email: credentials.email,
        password: credentials.password,
      };
      return authAPI.login(payload);
    },
    onSuccess: (response) => {
      // Store JWT token for Bearer authentication
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      // Store roles from response (array)
      let roles = response.roles;
      if (!roles || !Array.isArray(roles) || roles.length === 0) {
        roles = ['USER'];
      }
      localStorage.setItem('userRoles', JSON.stringify(roles));
      // Always set user object for context
      let userObj;
      if (response.user && response.user.id && response.user.email) {
        userObj = {
          id: response.user.id,
          username: response.user.username || response.user.email,
          email: response.user.email,
          roles: Array.isArray(response.user.roles) ? response.user.roles : roles,
        };
      } else {
        userObj = {
          id: response.userId,
          username: response.email,
          email: response.email,
          roles: roles,
        };
      }
      setUser(userObj);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Login successful!');
      // Navigate to dashboard based on role
      if (roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('AGENT')) {
        navigate('/agent/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  });

  // Logout function
  const logout = useCallback(() => {
    // Call logout API if needed
    authAPI.logout().catch(console.error);
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    
    // Clear user from state
    setUser(null);
    
    // Clear all queries from cache
    queryClient.clear();
    
    toast.success('Successfully logged out');
    navigate('/login');
  }, [navigate, queryClient]);

  // Get current user roles
  const getUserRoles = useCallback((): string[] => {
    if (user?.roles) return user.roles;
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : [];
  }, [user]);

  // Check if user has required role(s)
  const hasRole = useCallback((role: string | string[]): boolean => {
    const userRoles = getUserRoles();
    if (!userRoles.length) return false;
    
    if (typeof role === 'string') {
      return userRoles.includes(role);
    }
    
    return role.some(r => userRoles.includes(r));
  }, [getUserRoles]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutateAsync,
    logout,
    getUserRoles,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}