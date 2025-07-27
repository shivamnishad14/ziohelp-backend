// Re-export all types from individual type files
export * from './user';
export * from './ticket';
export * from './content';
export * from './rbac';

// Common API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue: any;
}

// Authentication context types
export interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

// Theme context types
export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Notification context types
export interface NotificationContextType {
  showNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }) => void;
  notifications: ToastNotification[];
  removeNotification: (id: string) => void;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration: number;
  createdAt: number;
}

// Search context types
export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export interface SearchResult {
  id: string;
  type: 'ticket' | 'faq' | 'article' | 'user' | 'product';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface TicketUpdateMessage {
  ticketId: number;
  type: 'status_change' | 'assignment' | 'comment' | 'created';
  data: any;
  userId?: number;
}

// File upload types
export interface FileUploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Dashboard types
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  recentTickets: Ticket[];
}

export interface AgentStats extends DashboardStats {
  assignedTickets: number;
  resolvedToday: number;
  pendingAssignment: number;
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalOrganizations: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memory: number;
    cpu: number;
  };
}

// Route types for TanStack Router
export interface RouteContext {
  auth: AuthContextType;
  title?: string;
}

export interface SearchParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  filter?: string;
} 