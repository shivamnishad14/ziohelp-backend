import React from 'react';
import { useRBAC } from '@/context/rbac-context';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions listed
}

/**
 * Guards content based on user permissions
 * Only renders children if user has required permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useRBAC();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface MultiplePermissionGuardProps {
  permissions: Array<{ resource: string; action: string }>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions listed
}

/**
 * Guards content based on multiple permissions
 * Can require ALL permissions or ANY permission
 */
export const MultiplePermissionGuard: React.FC<MultiplePermissionGuardProps> = ({
  permissions,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { hasPermission, hasAnyPermission } = useRBAC();

  const hasAccess = requireAll 
    ? permissions.every(p => hasPermission(p.resource, p.action))
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface MenuGuardProps {
  menuPath: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  permission?: 'view' | 'edit' | 'delete';
}

/**
 * Guards content based on menu permissions
 */
export const MenuGuard: React.FC<MenuGuardProps> = ({
  menuPath,
  children,
  fallback = null,
  permission = 'view',
}) => {
  const { canAccessMenu, canEditMenu, canDeleteMenu } = useRBAC();

  let hasAccess = false;
  switch (permission) {
    case 'view':
      hasAccess = canAccessMenu(menuPath);
      break;
    case 'edit':
      hasAccess = canEditMenu(menuPath);
      break;
    case 'delete':
      hasAccess = canDeleteMenu(menuPath);
      break;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
