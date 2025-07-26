import apiClient from '@/lib/api-client';
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketComment,
  TicketFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

export const ticketService = {
  // Get all tickets with filters and pagination
  getTickets: async (
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> => {
    const params = new URLSearchParams();
    
    // Add filter params
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    // Add pagination params
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>(
      `/tickets?${params.toString()}`
    );
    return response.data.data;
  },

  // Get ticket by ID
  getTicket: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return response.data.data;
  },

  // Create new ticket
  createTicket: async (ticketData: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<ApiResponse<Ticket>>(
      '/tickets',
      ticketData
    );
    return response.data.data;
  },

  // Update ticket
  updateTicket: async (id: string, updates: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      updates
    );
    return response.data.data;
  },

  // Delete ticket
  deleteTicket: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },

  // Assign ticket to user
  assignTicket: async (ticketId: string, assigneeId: string): Promise<Ticket> => {
    const response = await apiClient.post<ApiResponse<Ticket>>(
      `/tickets/${ticketId}/assign`,
      { assigneeId }
    );
    return response.data.data;
  },

  // Add comment to ticket
  addComment: async (
    ticketId: string,
    content: string,
    isInternal: boolean = false,
    attachments?: File[]
  ): Promise<TicketComment> => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('isInternal', isInternal.toString());
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.post<ApiResponse<TicketComment>>(
      `/tickets/${ticketId}/comments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get ticket comments
  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await apiClient.get<ApiResponse<TicketComment[]>>(
      `/tickets/${ticketId}/comments`
    );
    return response.data.data;
  },

  // Upload attachment
  uploadAttachment: async (ticketId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `/tickets/${ticketId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.url;
  },

  // Get my tickets (for current user)
  getMyTickets: async (
    filters?: Partial<TicketFilters>,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>(
      `/tickets/my?${params.toString()}`
    );
    return response.data.data;
  },

  // Get assigned tickets (for agents)
  getAssignedTickets: async (
    filters?: Partial<TicketFilters>,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Ticket>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>(
      `/tickets/assigned?${params.toString()}`
    );
    return response.data.data;
  },
};
