import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RBACContextType, Permission, MenuItem, RoleMenuPermission } from '@/types/rbac';
import { useAuth } from './auth-context';
import { rbacService } from '@/services/rbac.service';

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

interface RBACProviderProps {
  children: React.ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userMenus, setUserMenus] = useState<MenuItem[]>([]);
  const [menuPermissions, setMenuPermissions] = useState<RoleMenuPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const loadUserPermissions = useCallback(async () => {
    if (!isAuthenticated || !user || !user.id) return;

    setIsLoading(true);
    try {
      // Load user permissions based on roles
      const permissionsResponse = await rbacService.getUserPermissions(user.id);
      setPermissions(permissionsResponse.data);

      // Load user menus based on role permissions
      const menusResponse = await rbacService.getUserMenus(user.id);
      setUserMenus(menusResponse.data);

      // Load menu permissions for the user
      const menuPermissionsResponse = await rbacService.getUserMenuPermissions(user.id);
      setMenuPermissions(menuPermissionsResponse.data);
    } catch (error) {
      console.error('Error loading user permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadUserPermissions();
  }, [loadUserPermissions]);

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }, [permissions]);

  const hasAnyPermission = useCallback((permissionChecks: Array<{resource: string, action: string}>): boolean => {
    return permissionChecks.some(check => hasPermission(check.resource, check.action));
  }, [hasPermission]);

  const canAccessMenu = useCallback((menuPath: string): boolean => {
    const menuPermission = menuPermissions.find(mp => mp.menuItem.path === menuPath);
    return menuPermission?.canView ?? false;
  }, [menuPermissions]);

  const canEditMenu = useCallback((menuPath: string): boolean => {
    const menuPermission = menuPermissions.find(mp => mp.menuItem.path === menuPath);
    return menuPermission?.canEdit ?? false;
  }, [menuPermissions]);

  const canDeleteMenu = useCallback((menuPath: string): boolean => {
    const menuPermission = menuPermissions.find(mp => mp.menuItem.path === menuPath);
    return menuPermission?.canDelete ?? false;
  }, [menuPermissions]);

  const refreshPermissions = useCallback(async () => {
    await loadUserPermissions();
  }, [loadUserPermissions]);

  const value: RBACContextType = {
    permissions,
    hasPermission,
    hasAnyPermission,
    canAccessMenu,
    canEditMenu,
    canDeleteMenu,
    userMenus,
    refreshPermissions,
    isLoading
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};
