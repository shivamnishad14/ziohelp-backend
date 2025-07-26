import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/auth-context';
import UserDashboard from '@/components/pages/dashboard/UserDashboard';
import AgentDashboard from '@/components/pages/dashboard/AgentDashboard';
import AdminDashboard from '@/components/pages/dashboard/AdminDashboard';
import MasterAdminDashboard from '@/components/pages/dashboard/MasterAdminDashboard';
import DeveloperDashboard from '@/components/pages/dashboard/DeveloperDashboard';

function DashboardRouter() {
  const { hasRole } = useAuth();

  // Determine which dashboard to show based on user roles (highest priority first)
  if (hasRole('MASTER_ADMIN')) {
    return <MasterAdminDashboard />;
  } else if (hasRole('ADMIN')) {
    return <AdminDashboard />;
  } else if (hasRole('DEVELOPER')) {
    return <DeveloperDashboard />;
  } else if (hasRole('AGENT')) {
    return <AgentDashboard />;
  } else {
    return <UserDashboard />;
  }
}

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute roles={['USER', 'AGENT', 'ADMIN', 'MASTER_ADMIN', 'DEVELOPER']}>
      <Layout>
        <DashboardRouter />
      </Layout>
    </ProtectedRoute>
  ),
});
