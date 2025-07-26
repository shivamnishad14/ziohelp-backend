import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/components/pages/user/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute roles={['USER']}>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  ),
});
