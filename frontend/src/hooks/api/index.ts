import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { ticketService } from '@/services/ticket.service';
import { userService } from '@/services/user.service';
import { organizationService } from '@/services/organization.service';
import { knowledgeBaseService } from '@/services/knowledge-base.service';
import {
  User,
  Ticket,
  Organization,
  KBArticle,
  KBCategory,
  LoginRequest,
  RegisterRequest,
  CreateTicketRequest,
  UpdateTicketRequest,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationSettings,
  CreateKBArticleRequest,
  UpdateKBArticleRequest,
  CreateKBCategoryRequest,
  UpdateKBCategoryRequest,
  TicketFilters,
  PaginationParams,
  UserRole,
} from '@/types/api';

// Query Keys
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: ['auth', 'current-user'] as const,

  // Users
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userStats: (orgId?: string) => ['users', 'stats', orgId] as const,
  agents: (orgId?: string) => ['users', 'agents', orgId] as const,

  // Tickets
  tickets: ['tickets'] as const,
  ticket: (id: string) => ['tickets', id] as const,
  ticketComments: (id: string) => ['tickets', id, 'comments'] as const,
  myTickets: ['tickets', 'my'] as const,
  assignedTickets: ['tickets', 'assigned'] as const,

  // Organizations
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organizations', id] as const,
  currentOrganization: ['organizations', 'current'] as const,
  organizationSettings: (id?: string) => ['organizations', id || 'current', 'settings'] as const,
  organizationStats: (id?: string) => ['organizations', id || 'current', 'stats'] as const,
  organizationAnalytics: (id?: string, startDate?: string, endDate?: string) => 
    ['organizations', id || 'current', 'analytics', startDate, endDate] as const,
  organizationBilling: (id?: string) => ['organizations', id || 'current', 'billing'] as const,

  // Knowledge Base
  kbArticles: ['kb', 'articles'] as const,
  kbArticle: (id: string) => ['kb', 'articles', id] as const,
  kbArticleBySlug: (slug: string) => ['kb', 'articles', 'slug', slug] as const,
  kbCategories: ['kb', 'categories'] as const,
  kbCategory: (id: string) => ['kb', 'categories', id] as const,
  kbStats: ['kb', 'stats'] as const,
  kbPopularArticles: (limit?: number) => ['kb', 'articles', 'popular', limit] as const,
};

// ==================== AUTH HOOKS ====================

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authService.refreshToken(),
  });
};

// ==================== USER HOOKS ====================

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUsers = (
  organizationId?: string,
  role?: UserRole,
  search?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [...queryKeys.users, organizationId, role, search, pagination],
    queryFn: () => userService.getUsers(organizationId, role, search, pagination),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserRequest }) =>
      userService.updateUser(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.user(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<UpdateUserRequest>) => userService.updateProfile(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, data);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordRequest) => userService.changePassword(passwordData),
  });
};

export const useAgents = (organizationId?: string) => {
  return useQuery({
    queryKey: queryKeys.agents(organizationId),
    queryFn: () => userService.getAgents(organizationId),
  });
};

// ==================== TICKET HOOKS ====================

export const useTickets = (filters?: TicketFilters, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [...queryKeys.tickets, filters, pagination],
    queryFn: () => ticketService.getTickets(filters, pagination),
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: queryKeys.ticket(id),
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
  });
};

export const useMyTickets = (filters?: Partial<TicketFilters>, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [...queryKeys.myTickets, filters, pagination],
    queryFn: () => ticketService.getMyTickets(filters, pagination),
  });
};

export const useAssignedTickets = (filters?: Partial<TicketFilters>, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [...queryKeys.assignedTickets, filters, pagination],
    queryFn: () => ticketService.getAssignedTickets(filters, pagination),
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketData: CreateTicketRequest) => ticketService.createTicket(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.myTickets });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTicketRequest }) =>
      ticketService.updateTicket(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.ticket(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.myTickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignedTickets });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, assigneeId }: { ticketId: string; assigneeId: string }) =>
      ticketService.assignTicket(ticketId, assigneeId),
    onSuccess: (data, { ticketId }) => {
      queryClient.setQueryData(queryKeys.ticket(ticketId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignedTickets });
    },
  });
};

export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: queryKeys.ticketComments(ticketId),
    queryFn: () => ticketService.getComments(ticketId),
    enabled: !!ticketId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      ticketId, 
      content, 
      isInternal, 
      attachments 
    }: { 
      ticketId: string; 
      content: string; 
      isInternal?: boolean; 
      attachments?: File[] 
    }) => ticketService.addComment(ticketId, content, isInternal, attachments),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ticketComments(ticketId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket(ticketId) });
    },
  });
};

// ==================== ORGANIZATION HOOKS ====================

export const useOrganizations = (search?: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [...queryKeys.organizations, search, pagination],
    queryFn: () => organizationService.getOrganizations(search, pagination),
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: queryKeys.organization(id),
    queryFn: () => organizationService.getOrganization(id),
    enabled: !!id,
  });
};

export const useCurrentOrganization = () => {
  return useQuery({
    queryKey: queryKeys.currentOrganization,
    queryFn: () => organizationService.getCurrentOrganization(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orgData: CreateOrganizationRequest) => organizationService.createOrganization(orgData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateOrganizationRequest }) =>
      organizationService.updateOrganization(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.organization(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
      if (id === 'current') {
        queryClient.setQueryData(queryKeys.currentOrganization, data);
      }
    },
  });
};

export const useOrganizationSettings = (organizationId?: string) => {
  return useQuery({
    queryKey: queryKeys.organizationSettings(organizationId),
    queryFn: () => organizationService.getSettings(organizationId),
  });
};

export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      settings, 
      organizationId 
    }: { 
      settings: Partial<OrganizationSettings>; 
      organizationId?: string 
    }) => organizationService.updateSettings(settings, organizationId),
    onSuccess: (data, { organizationId }) => {
      queryClient.setQueryData(queryKeys.organizationSettings(organizationId), data);
    },
  });
};

// ==================== KNOWLEDGE BASE HOOKS ====================

export const useKBArticles = (
  categoryId?: string,
  search?: string,
  published?: boolean,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [...queryKeys.kbArticles, categoryId, search, published, pagination],
    queryFn: () => knowledgeBaseService.articles.getAll(categoryId, search, published, pagination),
  });
};

export const useKBArticle = (id: string) => {
  return useQuery({
    queryKey: queryKeys.kbArticle(id),
    queryFn: () => knowledgeBaseService.articles.getById(id),
    enabled: !!id,
  });
};

export const useKBArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.kbArticleBySlug(slug),
    queryFn: () => knowledgeBaseService.articles.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateKBArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (articleData: CreateKBArticleRequest) => 
      knowledgeBaseService.articles.create(articleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kbArticles });
    },
  });
};

export const useUpdateKBArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateKBArticleRequest }) =>
      knowledgeBaseService.articles.update(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.kbArticle(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.kbArticles });
    },
  });
};

export const useKBCategories = () => {
  return useQuery({
    queryKey: queryKeys.kbCategories,
    queryFn: () => knowledgeBaseService.categories.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateKBCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: CreateKBCategoryRequest) =>
      knowledgeBaseService.categories.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kbCategories });
    },
  });
};

export const useUpdateKBCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateKBCategoryRequest }) =>
      knowledgeBaseService.categories.update(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.kbCategory(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.kbCategories });
    },
  });
};

export const usePopularKBArticles = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.kbPopularArticles(limit),
    queryFn: () => knowledgeBaseService.articles.getPopular(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
