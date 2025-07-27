import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useRBAC } from '@/context/rbac-context';
import { useAuth } from '@/context/auth-context';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Guards routes based on user roles
 * Redirects to unauthorized page or specified route if user doesn't have required role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback,
  redirectTo = '/unauthorized',
}) => {
  const { user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }

  if (!hasAnyRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

interface PermissionRouteGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Guards routes based on specific permissions
 */
export const PermissionRouteGuard: React.FC<PermissionRouteGuardProps> = ({
  resource,
  action,
  children,
  fallback,
  redirectTo = '/unauthorized',
}) => {
  const { hasPermission } = useRBAC();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }

  if (!hasPermission(resource, action)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

interface MenuRouteGuardProps {
  menuPath: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Guards routes based on menu permissions
 */
export const MenuRouteGuard: React.FC<MenuRouteGuardProps> = ({
  menuPath,
  children,
  fallback,
  redirectTo = '/unauthorized',
}) => {
  const { canAccessMenu } = useRBAC();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }

  if (!canAccessMenu(menuPath)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};
