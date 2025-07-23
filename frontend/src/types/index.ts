export interface Role {
  id: string;
  name: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  approved?: boolean;
  username?: string;
  organizationId?: string;
  password?: string;
}


export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  logo?: string;
  supportEmail: string;
  sla: {
    responseTime: number; // in hours
    resolutionTime: number; // in hours
  };
  settings: {
    allowPublicTickets: boolean;
    requireAuthentication: boolean;
    autoAssignTickets: boolean;
  };
  admins: User[];
  createdAt: string;
  updatedAt: string;
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketCategory {
  TECHNICAL = 'TECHNICAL',
  BILLING = 'BILLING',
  GENERAL = 'GENERAL',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  BUG_REPORT = 'BUG_REPORT',
  ACCOUNT = 'ACCOUNT',
  PRODUCT = 'PRODUCT',
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  productId: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: FileAttachment[];
  comments?: Comment[];
  guestName?: string;
  guestEmail?: string;
  guestToken?: string;
  isGuestTicket?: boolean;
}

export interface FileAttachment {
  id: string;
  ticket: Ticket;
  filename: string;
  url: string;
  uploadedBy?: User;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  ticket: Ticket;
  user: User;
  content: string;
  createdAt: string;
}

export interface TicketHistory {
  id: string;
  ticket: Ticket;
  user: User;
  action: string;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  details?: string;
  timestamp: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  productId: string;
  author: User;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAnalytics {
  productId: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number; // in hours
  averageResolutionTime: number; // in hours
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  ticketsByStatus: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'product' | 'ticket' | 'user' | 'knowledge_base';
  entityId: string;
  userId: string;
  changes: Record<string, any>;
  timestamp: string;
} 