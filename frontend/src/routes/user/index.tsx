import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserDashboard } from '@/components/dashboard/user/UserDashboard';

export const Route = createFileRoute('/user')({
  component: () => (
    <ProtectedRoute roles={['USER', 'AGENT', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER']}>
      <UserDashboard />
    </ProtectedRoute>
  ),
});
