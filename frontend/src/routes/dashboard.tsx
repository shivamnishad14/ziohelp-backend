import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DashboardRouter } from '@/components/dashboard';

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute roles={['USER', 'AGENT', 'ADMIN', 'MASTER_ADMIN', 'DEVELOPER', 'TENANT_ADMIN']}>
      <AdminLayout>
        <DashboardRouter />
      </AdminLayout>
    </ProtectedRoute>
  ),
});
