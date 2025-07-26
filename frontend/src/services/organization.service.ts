import apiClient from '@/lib/api-client';
import {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationSettings,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

export const organizationService = {
  // Get all organizations (master admin only)
  getOrganizations: async (
    search?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Organization>> => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Organization>>>(
      `/organizations?${params.toString()}`
    );
    return response.data.data;
  },

  // Get organization by ID
  getOrganization: async (id: string): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>(`/organizations/${id}`);
    return response.data.data;
  },

  // Get current user's organization
  getCurrentOrganization: async (): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>('/organizations/current');
    return response.data.data;
  },

  // Create new organization (master admin only)
  createOrganization: async (organizationData: CreateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.post<ApiResponse<Organization>>(
      '/organizations',
      organizationData
    );
    return response.data.data;
  },

  // Update organization
  updateOrganization: async (
    id: string,
    updates: UpdateOrganizationRequest
  ): Promise<Organization> => {
    const response = await apiClient.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      updates
    );
    return response.data.data;
  },

  // Delete organization (master admin only)
  deleteOrganization: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },

  // Enable/disable organization (master admin only)
  toggleOrganizationStatus: async (id: string, enabled: boolean): Promise<Organization> => {
    const response = await apiClient.post<ApiResponse<Organization>>(
      `/organizations/${id}/toggle-status`,
      { enabled }
    );
    return response.data.data;
  },

  // Get organization settings
  getSettings: async (organizationId?: string): Promise<OrganizationSettings> => {
    const url = organizationId 
      ? `/organizations/${organizationId}/settings`
      : '/organizations/current/settings';
      
    const response = await apiClient.get<ApiResponse<OrganizationSettings>>(url);
    return response.data.data;
  },

  // Update organization settings
  updateSettings: async (
    settings: Partial<OrganizationSettings>,
    organizationId?: string
  ): Promise<OrganizationSettings> => {
    const url = organizationId 
      ? `/organizations/${organizationId}/settings`
      : '/organizations/current/settings';
      
    const response = await apiClient.put<ApiResponse<OrganizationSettings>>(url, settings);
    return response.data.data;
  },

  // Upload organization logo
  uploadLogo: async (file: File, organizationId?: string): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const url = organizationId 
      ? `/organizations/${organizationId}/logo`
      : '/organizations/current/logo';

    const response = await apiClient.post<ApiResponse<{ logoUrl: string }>>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get organization statistics
  getStats: async (organizationId?: string): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    totalUsers: number;
    activeAgents: number;
    avgResponseTime: number;
    customerSatisfaction: number;
  }> => {
    const url = organizationId 
      ? `/organizations/${organizationId}/stats`
      : '/organizations/current/stats';
      
    const response = await apiClient.get<ApiResponse<{
      totalTickets: number;
      openTickets: number;
      resolvedTickets: number;
      totalUsers: number;
      activeAgents: number;
      avgResponseTime: number;
      customerSatisfaction: number;
    }>>(url);
    return response.data.data;
  },

  // Get organization analytics data
  getAnalytics: async (
    startDate: string,
    endDate: string,
    organizationId?: string
  ): Promise<{
    ticketTrends: Array<{ date: string; count: number }>;
    resolutionTimes: Array<{ category: string; avgTime: number }>;
    userActivity: Array<{ date: string; activeUsers: number }>;
    popularCategories: Array<{ category: string; count: number }>;
  }> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const url = organizationId 
      ? `/organizations/${organizationId}/analytics?${params.toString()}`
      : `/organizations/current/analytics?${params.toString()}`;
      
    const response = await apiClient.get<ApiResponse<{
      ticketTrends: Array<{ date: string; count: number }>;
      resolutionTimes: Array<{ category: string; avgTime: number }>;
      userActivity: Array<{ date: string; activeUsers: number }>;
      popularCategories: Array<{ category: string; count: number }>;
    }>>(url);
    return response.data.data;
  },

  // Get billing information
  getBilling: async (organizationId?: string): Promise<{
    plan: string;
    billingPeriod: string;
    nextBillingDate: string;
    amount: number;
    currency: string;
    usage: {
      tickets: number;
      users: number;
      storage: number;
    };
    limits: {
      tickets: number;
      users: number;
      storage: number;
    };
  }> => {
    const url = organizationId 
      ? `/organizations/${organizationId}/billing`
      : '/organizations/current/billing';
      
    const response = await apiClient.get<ApiResponse<{
      plan: string;
      billingPeriod: string;
      nextBillingDate: string;
      amount: number;
      currency: string;
      usage: {
        tickets: number;
        users: number;
        storage: number;
      };
      limits: {
        tickets: number;
        users: number;
        storage: number;
      };
    }>>(url);
    return response.data.data;
  },
};
