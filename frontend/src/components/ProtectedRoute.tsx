import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  roles?: UserRole[];
  requireAll?: boolean; // If true, user must have ALL specified roles
  fallbackPath?: string; // Custom redirect path
  showUnauthorized?: boolean; // Show unauthorized message instead of redirect
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  roles,
  requireAll = false,
  fallbackPath = '/unauthorized',
  showUnauthorized = false
}) => {
  console.log('ProtectedRoute rendered');
  const { isAuthenticated, hasRole, hasAnyRole, getUserRoles, isLoading } = useAuth();
  
  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access
  let hasAccess = true;
  
  if (requiredRole) {
    hasAccess = hasRole(requiredRole);
  } else if (roles && roles.length > 0) {
    if (requireAll) {
      // User must have ALL specified roles
      hasAccess = roles.every(role => hasRole(role));
    } else {
      // User must have at least ONE of the specified roles
      hasAccess = hasAnyRole(roles);
    }
  }

  if (!hasAccess) {
    if (showUnauthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required: {requiredRole || roles?.join(', ')} | 
              Your roles: {getUserRoles().join(', ')}
            </p>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 