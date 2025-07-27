export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  productId?: number;
  product?: Product;
  organizationId: number;
  organization?: Organization;
  authorId: number;
  author: User;
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  productId?: number;
  tags?: string[];
  isPublished?: boolean;
}

export interface FAQSearchParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  productId?: number;
  isPublished?: boolean;
}

export interface PaginatedFAQs {
  content: FAQ[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  productId?: number;
  product?: Product;
  organizationId: number;
  organization?: Organization;
  authorId: number;
  author: User;
  isPublished: boolean;
  isPinned: boolean;
  viewCount: number;
  helpfulCount: number;
  tags?: string[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface KnowledgeBaseFormData {
  title: string;
  content: string;
  summary?: string;
  category: string;
  productId?: number;
  tags?: string[];
  isPublished?: boolean;
  isPinned?: boolean;
  attachments?: File[];
}

export interface KnowledgeBaseSearchParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  productId?: number;
  isPublished?: boolean;
  isPinned?: boolean;
}

export interface PaginatedKnowledgeBase {
  content: KnowledgeBaseArticle[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: number;
  user?: User;
  relatedEntityType?: string;
  relatedEntityId?: number;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  TICKET_ASSIGNED = 'TICKET_ASSIGNED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_RESOLVED = 'TICKET_RESOLVED',
  COMMENT_ADDED = 'COMMENT_ADDED',
}

export interface NotificationSearchParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface PaginatedNotifications {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Re-export common types
export type { User, Product, Organization, Attachment } from './ticket';
