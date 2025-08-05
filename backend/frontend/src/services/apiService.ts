
// Dashboard Analytics APIs
import api from './api';

// ------------------- ORGANIZATIONS -------------------
export const organizationsAPI = {
  getAll: (params?: { page?: number; size?: number; search?: string; sort?: string }) => api.get('/organizations', { params }),
  create: (orgData: any) => api.post('/organizations', orgData),
  getById: (id: number) => api.get(`/organizations/${id}`),
  delete: (id: number) => api.delete(`/organizations/${id}`),
};

// ------------------- TICKETS -------------------
export const ticketsAPI = {
  getAll: (params?: any) => api.get('/tickets', { params }),
  getById: (id: number) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  delete: (id: number) => api.delete(`/tickets/${id}`),
  resolve: (id: number) => api.put(`/tickets/${id}/resolve`),
  updateCategory: (id: number, category: string) => api.put(`/tickets/${id}/category`, { category }),
  autoAssign: (id: number) => api.put(`/tickets/${id}/auto-assign`),
  assign: (id: number, userId: number) => api.put(`/tickets/${id}/assign/${userId}`),
  getHistory: (id: number) => api.post(`/tickets/${id}/history`),
  getComments: (id: number) => api.get(`/tickets/${id}/comments`),
  addComment: (id: number, data: any) => api.post(`/tickets/${id}/comments`, data),
  getAttachments: (id: number) => api.get(`/tickets/${id}/attachments`),
  addAttachment: (id: number, data: any) => api.post(`/tickets/${id}/attachments`, data),
  getByOrg: (orgId: number, params?: any) => api.get(`/tickets/by-org/${orgId}`, { params }),
  createByOrg: (orgId: number, data: any) => api.post(`/tickets/by-org/${orgId}`, data),
  getMy: () => api.get('/tickets/my'),
  getList: () => api.get('/tickets/list'),
  deleteComment: (ticketId: number, commentId: number) => api.delete(`/tickets/${ticketId}/comments/${commentId}`),
  guestCreate: (data: any) => api.post('/tickets/guest', data),
  guestGet: (id: number, email: string) => api.get(`/tickets/guest/${id}/${email}`),
  exportPdf: () => api.get('/tickets/export/pdf', { responseType: 'blob' }),
};

// ------------------- USERS -------------------
export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  toggleActive: (userId: number) => api.put(`/users/${userId}/toggle-active`),
  rejectAdmin: (userId: number) => api.put(`/users/${userId}/reject-admin`),
  approveAdmin: (userId: number) => api.put(`/users/${userId}/approve-admin`),
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.put('/users/me', data),
  getRoles: (userId: number) => api.get(`/users/${userId}/roles`),
  addRole: (userId: number, data: any) => api.post(`/users/${userId}/roles`, data),
  deleteRole: (userId: number, roleName: string) => api.delete(`/users/${userId}/roles/${roleName}`),
  getAllRoles: () => api.get('/users/roles'),
  getPendingAdmins: () => api.get('/users/pending-admins'),
  getCount: () => api.get('/users/count'),
  getByOrg: (orgId: number, params?: any) => api.get(`/users/by-org/${orgId}`, { params }),
  getAllUsers: (params?: any) => api.get('/users/all', { params }),
};

// ------------------- PRODUCTS -------------------
export const productsAPI = {
  getAll: (params?: any) => api.get('/products/list', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products/create', data),
  update: (id: number, data: any) => api.put(`/products/${id}/update`, data),
  delete: (id: number) => api.delete(`/products/${id}/delete`),
  getTickets: (id: number) => api.get(`/products/${id}/tickets`),
  createTicket: (id: number, data: any) => api.post(`/products/${id}/tickets`, data),
  getFaqs: (id: number) => api.get(`/products/${id}/faqs`),
  createFaq: (id: number, data: any) => api.post(`/products/${id}/faqs`, data),
  getArticles: (id: number) => api.get(`/products/${id}/articles`),
  createArticle: (id: number, data: any) => api.post(`/products/${id}/articles`, data),
  getFaqCategories: (id: number) => api.get(`/products/${id}/faq-categories`),
  getArticleCategories: (id: number) => api.get(`/products/${id}/article-categories`),
};

// ------------------- FAQ -------------------
export const faqAPI = {
  getAll: (params?: any) => api.get('/faq', { params }),
  getById: (id: number) => api.get(`/faq/${id}`),
  create: (data: any) => api.post('/faq', data),
  update: (id: number, data: any) => api.put(`/faq/${id}`, data),
  delete: (id: number) => api.delete(`/faq/${id}`),
  getByProduct: (productId: number) => api.get(`/faq/product/${productId}`),
  createForProduct: (productId: number, data: any) => api.post(`/faq/product/${productId}`, data),
  getByOrg: (orgId: number, params?: any) => api.get(`/faq/by-org/${orgId}`, { params }),
  createByOrg: (orgId: number, data: any) => api.post(`/faq/by-org/${orgId}`, data),
  getPublicByDomain: (domain: string) => api.get(`/faq/public/product/${domain}`),
  getByProductAndCategory: (productId: number, category: string) => api.get(`/faq/product/${productId}/category/${category}`),
  getProductCategories: (productId: number) => api.get(`/faq/product/${productId}/categories`),
  getAllCategories: () => api.get('/faq/categories'),
  getByCategory: (category: string) => api.get(`/faq/by-category/${category}`),
};

// ------------------- KNOWLEDGE BASE ARTICLES -------------------
export const articleAPI = {
  getAll: (params?: any) => api.get('/knowledge-base/articles', { params }),
  getById: (id: number) => api.get(`/knowledge-base/articles/${id}`),
  create: (data: any) => api.post('/knowledge-base/articles', data),
  update: (id: number, data: any) => api.put(`/knowledge-base/articles/${id}`, data),
  delete: (id: number) => api.delete(`/knowledge-base/articles/${id}`),
  togglePublication: (id: number) => api.put(`/knowledge-base/articles/${id}/toggle-publication`),
  getByProduct: (productId: number) => api.get(`/knowledge-base/articles/product/${productId}`),
  createForProduct: (productId: number, data: any) => api.post(`/knowledge-base/articles/product/${productId}`, data),
  getPublished: (params?: any) => api.get('/knowledge-base/articles/published', { params }),
  getPublicByDomain: (domain: string) => api.get(`/knowledge-base/articles/public/product/${domain}`),
  getProductStats: (productId: number) => api.get(`/knowledge-base/articles/product/${productId}/stats`),
  searchByProduct: (productId: number, keyword: string) => api.get(`/knowledge-base/articles/product/${productId}/search`, { params: { keyword } }),
  getRecentByProduct: (productId: number) => api.get(`/knowledge-base/articles/product/${productId}/recent`),
  getByProductAndCategory: (productId: number, category: string) => api.get(`/knowledge-base/articles/product/${productId}/category/${category}`),
  getProductCategories: (productId: number) => api.get(`/knowledge-base/articles/product/${productId}/categories`),
  getByCategory: (category: string) => api.get(`/knowledge-base/articles/category/${category}`),
};

// ------------------- PERMISSIONS -------------------
export const permissionsAPI = {
  getAll: () => api.get('/permissions'),
  getById: (id: number) => api.get(`/permissions/${id}`),
  create: (data: any) => api.post('/permissions', data),
  update: (id: number, data: any) => api.put(`/permissions/${id}`, data),
  delete: (id: number) => api.delete(`/permissions/${id}`),
  getByResource: (resourceType: string) => api.get(`/permissions/resource/${resourceType}`),
  checkName: (name: string) => api.get(`/permissions/check-name/${name}`),
};

// ------------------- ROLES -------------------
export const rolesAPI = {
  getAll: () => api.get('/roles'),
  getById: (id: number) => api.get(`/roles/${id}`),
  create: (data: any) => api.post('/roles', data),
  update: (id: number, data: any) => api.put(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/roles/${id}`),
  addPermission: (roleId: number, permissionId: number) => api.post(`/roles/${roleId}/permissions/${permissionId}`),
  deletePermission: (roleId: number, permissionId: number) => api.delete(`/roles/${roleId}/permissions/${permissionId}`),
  getPermissions: (id: number) => api.get(`/roles/${id}/permissions`),
  addPermissions: (id: number, data: any) => api.post(`/roles/${id}/permissions`, data),
  getAllPermissions: () => api.get('/roles/permissions'),
  getByName: (name: string) => api.get(`/roles/name/${name}`),
  checkName: (name: string) => api.get(`/roles/check-name/${name}`),
};

// ------------------- MENU -------------------
export const menuAPI = {
  getAll: () => api.get('/menu/all'),
  get: () => api.get('/menu'),
  create: (data: any) => api.post('/menu', data),
  update: (id: number, data: any) => api.put(`/menu/${id}`, data),
  delete: (id: number) => api.delete(`/menu/${id}`),
  updateRoles: (id: number, data: any) => api.put(`/menu/${id}/roles`, data),
  bulkCreate: (data: any) => api.post('/menu/bulk', data),
  bulkDelete: (data: any) => api.delete('/menu/bulk', { data }),
  getRoles: () => api.get('/menu/roles'),
};

// ------------------- NOTIFICATIONS -------------------
export const notificationAPI = {
  send: (data: any) => api.post('/notifications/send', data),
  getByOrg: (orgId: number) => api.get(`/notifications/by-org/${orgId}`),
  createByOrg: (orgId: number, data: any) => api.post(`/notifications/by-org/${orgId}`, data),
};

// ------------------- FILES -------------------
export const fileAPI = {
  upload: (data: FormData) => api.post('/files/upload', data),
  list: () => api.get('/files/list'),
  download: (filename: string) => api.get(`/files/download/${filename}`, { responseType: 'blob' }),
  delete: (id: number) => api.delete(`/files/${id}/delete`),
};

// ------------------- AUTH -------------------
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email: string) => api.post('/auth/reset-password', { email }),
  debugRoles: (email: string) => api.get(`/auth/debug-roles/${email}`),
  fixUserRoles: () => api.post('/auth/fix-user-roles'),
  loginDebug: (data: any) => api.post('/auth/login-debug', data),
  testNativeQuery: (email: string) => api.get(`/auth/test-native-query/${email}`),
  testEntityManager: (email: string) => api.get(`/auth/test-entity-manager/${email}`),
  forceLoadRoles: (email: string) => api.get(`/auth/force-load-roles/${email}`),
};

// ------------------- ANALYTICS / DASHBOARD -------------------
export const analyticsAPI = {
  getUserActivity: () => api.get('/v1/dashboard/user-activity'),
  getTicketTrends: () => api.get('/v1/dashboard/ticket-trends'),
  getStats: () => api.get('/v1/dashboard/stats'),
  getSlaCompliance: () => api.get('/v1/dashboard/sla-compliance'),
  getRealtimeUpdates: () => api.get('/v1/dashboard/realtime/updates'),
  getProductMetrics: () => api.get('/v1/dashboard/product-metrics'),
  exportReport: () => api.get('/v1/dashboard/export/report', { responseType: 'blob' }),
};

// ------------------- AUDIT LOGS -------------------
export const auditLogAPI = {
  getByOrg: (orgId: number) => api.get(`/audit-logs/by-org/${orgId}`),
};

// ------------------- AI -------------------
export const aiAPI = {
  suggestFaq: (data: any) => api.post('/v1/ai/suggest-faq', data),
  smartAssistant: (data: any) => api.post('/v1/ai/smart-assistant', data),
  searchKnowledge: (data: any) => api.post('/v1/ai/search-knowledge', data),
  generateResponse: (data: any) => api.post('/v1/ai/generate-response', data),
  chat: (data: any) => api.post('/v1/ai/chat', data),
  autoCategorize: (data: any) => api.post('/v1/ai/auto-categorize', data),
  analyzeTicket: (data: any) => api.post('/v1/ai/analyze-ticket', data),
  getStatus: () => api.get('/v1/ai/status'),
};
// ...existing code...
