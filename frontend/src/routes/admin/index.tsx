import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AdminDashboard } from '@/components/dashboard/admin/AdminDashboard';

export const Route = createFileRoute('/admin')({
  component: () => (
    <ProtectedRoute roles={['ADMIN', 'MASTER_ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
