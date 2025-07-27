
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './context/notification-context';
import { AuthProvider } from './context/auth-context';
import { RBACProvider } from './context/rbac-context';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Polyfill for 'global' in browser (for sockjs-client)
(window as any).global = window;

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RBACProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
          </NotificationProvider>
        </RBACProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);