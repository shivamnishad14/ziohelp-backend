import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../services/api';

export function useDashboardStats(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['dashboard-stats', params],
    queryFn: () => dashboardAPI.getStats(params).then(res => res.data),
  });
} 