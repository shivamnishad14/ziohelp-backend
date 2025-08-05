// TanStack Query hooks for tickets
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI } from '../services/apiService';

export function useTickets(params?: any) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsAPI.getAll(params).then(res => res.data),
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsAPI.create,
    onSuccess: () => queryClient.invalidateQueries(['tickets']),
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsAPI.delete,
    onSuccess: () => queryClient.invalidateQueries(['tickets']),
  });
}
