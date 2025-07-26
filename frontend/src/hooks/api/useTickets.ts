import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useCountTickets = () =>
  useQuery({
    queryKey: ['tickets', 'count'],
    queryFn: async () => (await api.get('/tickets/count')).data,
  });

export const usePendingApprovalTickets = () =>
  useQuery({
    queryKey: ['tickets', 'pending-approval'],
    queryFn: async () => (await api.get('/tickets/pending-approval')).data,
  });