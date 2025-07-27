export interface Ticket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  productId?: number;
  product?: Product;
  assignedToId?: number;
  assignedTo?: User;
  createdById?: number;
  createdBy?: User;
  organizationId: number;
  organization?: Organization;
  guestName?: string;
  guestEmail?: string;
  guestToken?: string;
  isGuestTicket: boolean;
  attachments?: Attachment[];
  comments?: TicketComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
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

export interface TicketComment {
  id: number;
  content: string;
  ticketId: number;
  userId?: number;
  user?: User;
  isInternal: boolean;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  downloadUrl: string;
  ticketId?: number;
  commentId?: number;
  uploadedById?: number;
  uploadedBy?: User;
  createdAt: string;
}

export interface TicketFormData {
  subject: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  productId?: number;
  assignedToId?: number;
  guestName?: string;
  guestEmail?: string;
  attachments?: File[];
}

export interface TicketSearchParams {
  page?: number;
  size?: number;
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedToId?: number;
  createdById?: number;
  productId?: number;
  organizationId?: number;
  isGuestTicket?: boolean;
}

export interface PaginatedTickets {
  content: Ticket[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  status: ProductStatus;
  logoUrl?: string;
  supportEmail?: string;
  websiteUrl?: string;
  version?: string;
  organizationId: number;
  organization?: Organization;
  settings?: ProductSettings;
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface ProductSettings {
  allowPublicTickets: boolean;
  requireAuthentication: boolean;
  autoAssignTickets: boolean;
  slaResponseTimeHours: number;
  slaResolutionTimeHours: number;
}

export interface ProductFormData {
  name: string;
  description?: string;
  status: ProductStatus;
  supportEmail?: string;
  websiteUrl?: string;
  version?: string;
  settings?: ProductSettings;
}

export interface PaginatedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Re-export user types
export type { User, Role, Organization, UserRole } from './user';
