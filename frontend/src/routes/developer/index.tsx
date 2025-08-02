import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DeveloperDashboard } from '@/components/dashboard/developer/DeveloperDashboard';

export const Route = createFileRoute('/developer')({
  component: () => (
    <ProtectedRoute roles={['DEVELOPER']}>
      <DeveloperDashboard />
    </ProtectedRoute>
  ),
});
