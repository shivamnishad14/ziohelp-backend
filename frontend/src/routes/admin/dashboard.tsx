import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import AdminDashboardMain from '@/components/pages/admin/AdminDashboardMain';
import ProtectedRoute from '@/components/ProtectedRoute';

export const Route = createFileRoute('/admin/dashboard')({
  component: () => (
    <ProtectedRoute roles={['ADMIN']}>
      <Layout>
        <AdminDashboardMain />
      </Layout>
    </ProtectedRoute>
  ),
});
