import { createFileRoute, redirect } from '@tanstack/react-router';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    if (userRoles.length > 0) {
      const dashboardPath = getDashboardRoute(userRoles);
      throw redirect({ to: dashboardPath });
    }
    throw redirect({ to: '/login' });
  },
});
