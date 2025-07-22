import { useMutation, useQuery } from '@tanstack/react-query';
import { guestTicketAPI } from '../../services/api';

export function useSubmitGuestTicket() {
  return useMutation({
    mutationFn: (ticket: any) => guestTicketAPI.submit(ticket),
  });
}

export function useGuestTicketStatus(id: string | number, email: string) {
  return useQuery({
    queryKey: ['guest-ticket-status', id, email],
    queryFn: () => guestTicketAPI.getStatus(id, email).then(res => res.data),
    enabled: !!id && !!email,
  });
} 