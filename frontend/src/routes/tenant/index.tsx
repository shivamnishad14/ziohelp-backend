import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TenantDashboard } from '@/components/dashboard/tenant/TenantDashboard';

export const Route = createFileRoute('/tenant')({
  component: () => (
    <ProtectedRoute roles={['TENANT_ADMIN']}>
      <TenantDashboard />
    </ProtectedRoute>
  ),
});
