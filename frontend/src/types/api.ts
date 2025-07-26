// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Auth Types
export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
  organizationName?: string;
}

// User Types
export type UserRole = 'USER' | 'AGENT' | 'ADMIN' | 'MASTER_ADMIN' | 'DEVELOPER';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  roles: UserRole[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  organizationId?: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  assigneeId?: string;
  assignee?: User;
  requesterId: string;
  requester: User;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  attachments: TicketAttachment[];
  comments: TicketComment[];
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TicketComment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  isInternal: boolean;
  createdAt: string;
  attachments: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category?: string;
  tags?: string[];
  assigneeId?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assigneeId?: string;
  tags?: string[];
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  settings: OrganizationSettings;
  createdAt: string;
  userCount: number;
  ticketCount: number;
}

export interface OrganizationSettings {
  allowGuestTickets: boolean;
  autoAssignTickets: boolean;
  defaultTicketPriority: TicketPriority;
  businessHours: BusinessHours;
  branding: BrandingSettings;
}

export interface BusinessHours {
  timezone: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
}

export interface BrandingSettings {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
}

// KB & FAQ Types
export interface KBArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  category: KBCategory;
  authorId: string;
  author: User;
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KBCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isPublic: boolean;
  sortOrder: number;
  articleCount: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  category: FAQCategory;
  isPublished: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  faqCount: number;
}

// Dashboard & Analytics Types
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  ticketsByStatus: { [key in TicketStatus]: number };
  ticketsByPriority: { [key in TicketPriority]: number };
  recentTickets: Ticket[];
  topAgents: AgentStats[];
}

export interface AgentStats {
  userId: string;
  user: User;
  assignedTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  customerRating: number;
}

// Dashboard Response Types
export interface BaseDashboardResponse {
  welcomeMessage: string;
  userInfo: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
  features: string[];
}

export interface UserDashboardResponse extends BaseDashboardResponse {
  metrics: {
    myTickets: number;
    openTickets: number;
    resolvedTickets: number;
    pendingTickets: number;
  };
}

export interface AgentDashboardResponse extends BaseDashboardResponse {
  metrics: {
    assignedTickets: number;
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedToday: number;
  };
}

export interface AdminDashboardResponse extends BaseDashboardResponse {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    pendingApprovals: number;
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    resolutionRate: number;
  };
}

export interface MasterAdminDashboardResponse extends BaseDashboardResponse {
  metrics: {
    totalUsers: number;
    totalOrganizations: number;
    totalTickets: number;
    systemHealth: number;
    activeAgents: number;
    activeAdmins: number;
  };
}

export interface DeveloperDashboardResponse extends BaseDashboardResponse {
  metrics: {
    totalBugs: number;
    activeTasks: number;
    codeReviews: number;
    deployments: number;
    systemUptime: number;
    apiCalls: number;
  };
}

// Search & Filter Types
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assigneeId?: string;
  requesterId?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}
