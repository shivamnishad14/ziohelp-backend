import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketAPI } from '@/services/API';
// List all tickets
export const useListTickets = (params?: any) =>
  useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketAPI.getAll(params),
  });

// Get a single ticket
export const useGetTicket = (id: number) =>
  useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketAPI.getById(id),
    enabled: !!id,
  });

// Create a ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// Update a ticket
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ticketAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// Delete a ticket
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ticketAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// Assign a ticket (stub)
export const useAssignTicket = () => useMutation({ mutationFn: async () => {} });

// Update ticket status (stub)
export const useUpdateTicketStatus = () => useMutation({ mutationFn: async () => {} });

// Resolve a ticket (stub)
export const useResolveTicket = () => useMutation({ mutationFn: async () => {} });

// Approve a ticket (stub)
export const useApproveTicket = () => useMutation({ mutationFn: async () => {} });

// Reject ticket resolution (stub)
export const useRejectTicketResolution = () => useMutation({ mutationFn: async () => {} });

// Add ticket comment (stub)
export const useAddTicketComment = () => useMutation({ mutationFn: async () => {} });

// Get ticket comments (stub)
export const useGetTicketComments = () => useQuery({ queryKey: ['ticketComments'], queryFn: async () => [] });

// Search tickets (stub)
export const useSearchTickets = () => useQuery({ queryKey: ['searchTickets'], queryFn: async () => [] });

// Tickets by assignee (stub)
export const useTicketsByAssignee = () => useQuery({ queryKey: ['ticketsByAssignee'], queryFn: async () => [] });

// Tickets by user (stub)
export const useTicketsByUser = () => useQuery({ queryKey: ['ticketsByUser'], queryFn: async () => [] });

// Public create ticket (stub)
export const usePublicCreateTicket = () => useMutation({ mutationFn: async () => {} });

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