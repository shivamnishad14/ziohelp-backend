// TanStack Query hooks for dashboard analytics
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/apiService';

export function useUserActivity() {
  return useQuery({
    queryKey: ['user-activity'],
    queryFn: () => analyticsAPI.getUserActivity().then(res => res.data),
  });
}

export function useTicketTrends() {
  return useQuery({
    queryKey: ['ticket-trends'],
    queryFn: () => analyticsAPI.getTicketTrends().then(res => res.data),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => analyticsAPI.getStats().then(res => res.data),
  });
}

export function useSlaCompliance() {
  return useQuery({
    queryKey: ['sla-compliance'],
    queryFn: () => analyticsAPI.getSlaCompliance().then(res => res.data),
  });
}

export function useRealtimeUpdates() {
  return useQuery({
    queryKey: ['realtime-updates'],
    queryFn: () => analyticsAPI.getRealtimeUpdates().then(res => res.data),
  });
}

export function useProductMetrics() {
  return useQuery({
    queryKey: ['product-metrics'],
    queryFn: () => analyticsAPI.getProductMetrics().then(res => res.data),
  });
}
