import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { hasRole } from '@/utils/roleChecker';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, roles }) => {
  const location = useLocation();
  const isAuthenticated = authAPI.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 