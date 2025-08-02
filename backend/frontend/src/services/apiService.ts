import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  logout: () => 
    api.post('/auth/logout'),
  resetPassword: (email: string) => 
    api.post('/auth/reset-password', { email }),
  debugRoles: (email: string) => 
    api.get(`/auth/debug-roles/${email}`),
  fixUserRoles: () => 
    api.post('/auth/fix-user-roles'),
};

// Organizations APIs
export const organizationsAPI = {
  getAll: (params?: { page?: number; size?: number; search?: string; sort?: string }) => 
    api.get('/organizations', { params }),
  create: (orgData: any) => 
    api.post('/organizations', orgData),
  getById: (id: number) => 
    api.get(`/organizations/${id}`),
  delete: (id: number) => 
    api.delete(`/organizations/${id}`),
};

// Tickets APIs
export const ticketsAPI = {
  getAll: (params?: { page?: number; size?: number; search?: string; sort?: string; status?: string }) => 
    api.get('/tickets', { params }),
  create: (ticketData: any) => 
    api.post('/tickets', ticketData),
  getById: (id: number) => 
    api.get(`/tickets/${id}`),
  delete: (id: number) => 
    api.delete(`/tickets/${id}`),
  getMyTickets: () => 
    api.get('/tickets/my'),
  getList: () => 
    api.get('/tickets/list'),
  resolve: (id: number, resolutionData: any) => 
    api.put(`/tickets/${id}/resolve`, resolutionData),
  updateCategory: (id: number, category: string) => 
    api.put(`/tickets/${id}/category`, { category }),
  autoAssign: (id: number) => 
    api.put(`/tickets/${id}/auto-assign`),
  assign: (id: number, userId: number) => 
    api.put(`/tickets/${id}/assign/${userId}`),
  addHistory: (id: number, historyData: any) => 
    api.post(`/tickets/${id}/history`, historyData),
  getComments: (id: number) => 
    api.get(`/tickets/${id}/comments`),
  addComment: (id: number, comment: any) => 
    api.post(`/tickets/${id}/comments`, comment),
  deleteComment: (ticketId: number, commentId: number) => 
    api.delete(`/tickets/${ticketId}/comments/${commentId}`),
  getAttachments: (id: number) => 
    api.get(`/tickets/${id}/attachments`),
  addAttachment: (id: number, formData: FormData) => 
    api.post(`/tickets/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getByOrg: (orgId: number, params?: any) => 
    api.get(`/tickets/by-org/${orgId}`, { params }),
  createByOrg: (orgId: number, ticketData: any) => 
    api.post(`/tickets/by-org/${orgId}`, ticketData),
  exportPDF: () => 
    api.get('/tickets/export/pdf', { responseType: 'blob' }),
};

// Guest Tickets APIs
export const guestTicketsAPI = {
  create: (ticketData: any) => 
    api.post('/tickets/guest', ticketData),
  getByIdAndEmail: (id: number, email: string) => 
    api.get(`/tickets/guest/${id}/${email}`),
};

// Users APIs
export const usersAPI = {
  getAll: (params?: { page?: number; size?: number; search?: string; sort?: string }) => 
    api.get('/users/all', { params }),
  create: (userData: any) => 
    api.post('/users', userData),
  getMe: () => 
    api.get('/users/me'),
  updateMe: (userData: any) => 
    api.put('/users/me', userData),
  delete: (userId: number) => 
    api.delete(`/users/${userId}`),
  toggleActive: (userId: number) => 
    api.put(`/users/${userId}/toggle-active`),
  approveAdmin: (userId: number) => 
    api.put(`/users/${userId}/approve-admin`),
  rejectAdmin: (userId: number) => 
    api.put(`/users/${userId}/reject-admin`),
  getRoles: (userId: number) => 
    api.get(`/users/${userId}/roles`),
  addRole: (userId: number, roleData: any) => 
    api.post(`/users/${userId}/roles`, roleData),
  removeRole: (userId: number, roleName: string) => 
    api.delete(`/users/${userId}/roles/${roleName}`),
  getAllRoles: () => 
    api.get('/users/roles'),
  getPendingAdmins: () => 
    api.get('/users/pending-admins'),
  getCount: () => 
    api.get('/users/count'),
  getByOrg: (orgId: number, params?: any) => 
    api.get(`/users/by-org/${orgId}`, { params }),
};

// FAQs APIs
export const faqsAPI = {
  getAll: (params?: { page?: number; size?: number; search?: string; sort?: string }) => 
    api.get('/faq', { params }),
  create: (faqData: any) => 
    api.post('/faq', faqData),
  getById: (id: number) => 
    api.get(`/faq/${id}`),
  update: (id: number, faqData: any) => 
    api.put(`/faq/${id}`, faqData),
  delete: (id: number) => 
    api.delete(`/faq/${id}`),
  getByOrg: (orgId: number, params?: any) => 
    api.get(`/faq/by-org/${orgId}`, { params }),
  createByOrg: (orgId: number, faqData: any) => 
    api.post(`/faq/by-org/${orgId}`, faqData),
  getCategories: () => 
    api.get('/faq/categories'),
  getByCategory: (category: string) => 
    api.get(`/faq/by-category/${category}`),
};

// AI Chat & Analysis APIs
export const aiAPI = {
  chat: (message: string) => 
    api.post('/v1/ai/chat', { message }),
  analyzeTicket: (ticketId: number) => 
    api.post('/v1/ai/analyze-ticket', { ticketId }),
  autoCategorize: (ticketData: any) => 
    api.post('/v1/ai/auto-categorize', ticketData),
  generateResponse: (prompt: string) => 
    api.post('/v1/ai/generate-response', { prompt }),
  searchKnowledge: (query: string) => 
    api.post('/v1/ai/search-knowledge', { query }),
  smartAssistant: (request: any) => 
    api.post('/v1/ai/smart-assistant', request),
  suggestFAQ: (content: string) => 
    api.post('/v1/ai/suggest-faq', { content }),
  getStatus: () => 
    api.get('/v1/ai/status'),
};

// Dashboard Analytics APIs
export const dashboardAPI = {
  getStats: () => 
    api.get('/v1/dashboard/stats'),
  getTicketTrends: (params?: { period?: string; orgId?: number }) => 
    api.get('/v1/dashboard/ticket-trends', { params }),
  getUserActivity: (params?: { period?: string; userId?: number }) => 
    api.get('/v1/dashboard/user-activity', { params }),
  getSLACompliance: () => 
    api.get('/v1/dashboard/sla-compliance'),
  getRealtimeUpdates: () => 
    api.get('/v1/dashboard/realtime/updates'),
  getProductMetrics: (params?: { productId?: number }) => 
    api.get('/v1/dashboard/product-metrics', { params }),
  exportReport: (params?: { type?: string; format?: string }) => 
    api.get('/v1/dashboard/export/report', { params, responseType: 'blob' }),
};

// Roles APIs
export const rolesAPI = {
  getAll: () => 
    api.get('/roles'),
  create: (roleData: any) => 
    api.post('/roles', roleData),
  getById: (id: number) => 
    api.get(`/roles/${id}`),
  update: (id: number, roleData: any) => 
    api.put(`/roles/${id}`, roleData),
  delete: (id: number) => 
    api.delete(`/roles/${id}`),
  getByName: (name: string) => 
    api.get(`/roles/name/${name}`),
  checkName: (name: string) => 
    api.get(`/roles/check-name/${name}`),
};

// Products APIs
export const productsAPI = {
  getAll: () => 
    api.get('/products/list'),
  create: (productData: any) => 
    api.post('/products/create', productData),
  getById: (id: number) => 
    api.get(`/products/${id}`),
  update: (id: number, productData: any) => 
    api.put(`/products/${id}/update`, productData),
  delete: (id: number) => 
    api.delete(`/products/${id}/delete`),
};

// Knowledge Base APIs
export const knowledgeBaseAPI = {
  getAll: () => 
    api.get('/knowledge-base/articles/list'),
  create: (articleData: any) => 
    api.post('/knowledge-base/articles/create', articleData),
  getById: (id: number) => 
    api.get(`/knowledge-base/articles/${id}`),
  update: (id: number, articleData: any) => 
    api.put(`/knowledge-base/articles/${id}/update`, articleData),
  delete: (id: number) => 
    api.delete(`/knowledge-base/articles/${id}/delete`),
  getByCategory: (category: string) => 
    api.get(`/knowledge-base/articles/category/${category}`),
  getProductCategories: () => 
    api.get('/knowledge-base/articles/product-category'),
};

// Notifications APIs
export const notificationsAPI = {
  send: (notificationData: any) => 
    api.post('/notifications/send', notificationData),
  getByOrg: (orgId: number) => 
    api.get(`/notifications/by-org/${orgId}`),
  createByOrg: (orgId: number, notificationData: any) => 
    api.post(`/notifications/by-org/${orgId}`, notificationData),
};

// Files APIs
export const filesAPI = {
  upload: (formData: FormData) => 
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getList: () => 
    api.get('/files/list'),
  download: (filename: string) => 
    api.get(`/files/download/${filename}`, { responseType: 'blob' }),
  delete: (id: number) => 
    api.delete(`/files/${id}/delete`),
};

// Hash Generator APIs
export const hashAPI = {
  generate: () => 
    api.get('/generate-hash'),
  test: () => 
    api.get('/test-hash'),
};

// Menu APIs
export const menuAPI = {
  get: () => 
    api.get('/menu'),
};

export default api;
