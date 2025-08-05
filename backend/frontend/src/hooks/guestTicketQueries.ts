// TanStack Query hooks for guest ticket endpoints
import { useMutation, useQuery } from '@tanstack/react-query';
import { ticketsAPI } from '../services/apiService';

export function useGuestCreateTicket() {
  return useMutation({
    mutationFn: ticketsAPI.guestCreate,
  });
}

export function useGuestGetTicket(id: number, email: string) {
  return useQuery({
    queryKey: ['guest-ticket', id, email],
    queryFn: () => ticketsAPI.guestGet(id, email).then(res => res.data),
    enabled: !!id && !!email,
  });
}
