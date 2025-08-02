
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routes';
import { AuthProvider } from './features/auth/AuthProvider';
import { PermissionsProvider } from './context/PermissionContext';
import './index.css';

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PermissionsProvider>
          <RouterProvider router={router} />
        </PermissionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
