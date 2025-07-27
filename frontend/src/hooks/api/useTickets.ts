import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketAPI } from '@/services/api';
import { Ticket, TicketFormData, TicketSearchParams, PaginatedTickets, TicketComment } from '@/types';

export const useTickets = (params?: TicketSearchParams) =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', params],
    queryFn: () => ticketAPI.getTickets(params).then(res => res.data),
  });

export const useTicket = (id: number) =>
  useQuery<Ticket>({
    queryKey: ['tickets', id],
    queryFn: () => ticketAPI.getTicket(id).then(res => res.data),
    enabled: !!id,
  });

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TicketFormData) => ticketAPI.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TicketFormData> }) => 
      ticketAPI.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ticketAPI.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: number; assigneeId: number }) => 
      ticketAPI.assignTicket(id, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      ticketAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useResolveTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ticketAPI.updateStatus(id, 'RESOLVED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useApproveTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ticketAPI.updateStatus(id, 'CLOSED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useRejectTicketResolution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ticketAPI.updateStatus(id, 'OPEN'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAddTicketComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) => 
      ticketAPI.addComment(id, comment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
  });
};

export const useGetTicketComments = (ticketId: number) =>
  useQuery<TicketComment[]>({
    queryKey: ['tickets', ticketId, 'comments'],
    queryFn: () => ticketAPI.getComments(ticketId).then(res => res.data),
    enabled: !!ticketId,
  });

export const useSearchTickets = (params: TicketSearchParams) =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'search', params],
    queryFn: () => ticketAPI.getTickets(params).then(res => res.data),
    enabled: !!params.search,
  });

export const useTicketsByStatus = (status: string) =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'status', status],
    queryFn: () => ticketAPI.getTickets({ status: status as any }).then(res => res.data),
    enabled: !!status,
  });

export const useTicketsByAssignee = (assigneeId: number) =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'assignee', assigneeId],
    queryFn: () => ticketAPI.getTickets({ assignedToId: assigneeId }).then(res => res.data),
    enabled: !!assigneeId,
  });

export const useTicketsByUser = (userId: number) =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'user', userId],
    queryFn: () => ticketAPI.getTickets({ createdById: userId }).then(res => res.data),
    enabled: !!userId,
  });

export const useMyTickets = () =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'my-tickets'],
    queryFn: () => ticketAPI.getTickets().then(res => res.data),
  });

export const usePublicCreateTicket = () =>
  useMutation({
    mutationFn: (data: TicketFormData) => ticketAPI.publicCreate(data),
  });

export const usePublicTicketStatus = (ticketNumber: string) =>
  useQuery<Ticket>({
    queryKey: ['tickets', 'public', ticketNumber],
    queryFn: () => ticketAPI.publicStatus(ticketNumber).then(res => res.data),
    enabled: !!ticketNumber,
  });

// Legacy exports for backward compatibility
export const useListTickets = useTickets;
export const useGetTicket = useTicket;
export const useCountTickets = () =>
  useQuery<number>({
    queryKey: ['tickets', 'count'],
    queryFn: () => ticketAPI.getTickets({ size: 1 }).then(res => res.data.totalElements),
  });

export const usePendingApprovalTickets = () =>
  useQuery<PaginatedTickets>({
    queryKey: ['tickets', 'pending-approval'],
    queryFn: () => ticketAPI.getTickets({ status: 'WAITING_FOR_CUSTOMER' as any }).then(res => res.data),
  });