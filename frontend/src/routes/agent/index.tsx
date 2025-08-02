import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AgentDashboard } from '@/components/dashboard/agent/AgentDashboard';

export const Route = createFileRoute('/agent')({
  component: () => (
    <ProtectedRoute roles={['AGENT']}>
      <AgentDashboard />
    </ProtectedRoute>
  ),
});
