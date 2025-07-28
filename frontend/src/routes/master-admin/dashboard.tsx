import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import { AdminDashboard } from '@/components/dashboard/admin/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export const Route = createFileRoute('/master-admin/dashboard')({
  component: () => (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <Layout>
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  ),
});
