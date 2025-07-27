import React from 'react';
import { redirect } from '@tanstack/react-router';
import { authAPI } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, roles }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  let userRoles: string[] = [];
  try {
    userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  } catch {
    userRoles = [];
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
    });
  }

  // If roles prop is set, require at least one match
  if (roles && roles.length > 0 && !roles.some(r => userRoles.includes(r))) {
    throw redirect({
      to: '/unauthorized',
    });
  }

  // If requiredRole prop is set, require that role
  if (requiredRole && !userRoles.includes(requiredRole)) {
    throw redirect({
      to: '/unauthorized',
    });
  }

  return <>{children}</>;
};

export default ProtectedRoute; 