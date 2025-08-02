import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import type { Ticket } from '../types.ts';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await api.get('/tickets');
      return response.data as Ticket[];
    },
  });
}
