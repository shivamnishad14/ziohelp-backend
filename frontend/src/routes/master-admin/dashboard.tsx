import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import MasterAdminDashboard from '@/components/pages/admin/MasterAdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export const Route = createFileRoute('/master-admin/dashboard')({
  component: () => (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <Layout>
        <MasterAdminDashboard />
      </Layout>
    </ProtectedRoute>
  ),
});
