import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import type { TicketInput } from '../types.ts';

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: TicketInput) => {
      const response = await api.post('/tickets', ticket);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
