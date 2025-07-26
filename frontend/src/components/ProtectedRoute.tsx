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
  let userRoles: string[] = [];
  try {
    userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  } catch {
    userRoles = [];
  }
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // If roles prop is set, require at least one match
  if (roles && roles.length > 0 && !roles.some(r => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }
  // If requiredRole prop is set, require that role
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 