import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRoles');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (credentials: { username?: string; email?: string; password: string }) =>
    api.post('/auth/login', credentials),
  loginDebug: (rawBody: any) =>
    api.post('/auth/login-debug', rawBody),
  register: (userData: any) => api.post('/auth/register', userData),
  forgotPassword: (email: string) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getUsers: (params?: any) => api.get('/users', { params }),
  getUser: (id: number) => api.get(`/users/${id}`),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
  updateUserRole: (id: number, roleId: number) => api.put(`/users/${id}/role`, { roleId }),
  toggleActive: (id: number) => api.put(`/users/${id}/toggle-active`),
};

export const roleAPI = {
  getRoles: (params?: any) => api.get('/roles', { params }),
  getRole: (id: number) => api.get(`/roles/${id}`),
  createRole: (data: { name: string }) => api.post('/roles', data),
  updateRole: (id: number, data: { name: string }) => api.put(`/roles/${id}`, data),
  deleteRole: (id: number) => api.delete(`/roles/${id}`),
};

export const ticketAPI = {
  getTickets: (params?: any) => api.get('/tickets', { params }),
  getTicket: (id: number) => api.get(`/tickets/${id}`),
  createTicket: (data: any) => api.post('/tickets', data),
  updateTicket: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  deleteTicket: (id: number) => api.delete(`/tickets/${id}`),
  assignTicket: (id: number, assigneeId: number) => api.put(`/tickets/${id}/assign`, { assigneeId }),
  updateStatus: (id: number, status: string) => api.put(`/tickets/${id}/status`, { status }),
  addComment: (id: number, comment: string) => api.post(`/tickets/${id}/comments`, { comment }),
  getComments: (id: number) => api.get(`/tickets/${id}/comments`),
  uploadAttachment: (id: number, file: FormData) => api.post(`/tickets/${id}/attachments`, file, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  publicCreate: (data: any) => api.post('/public/tickets', data),
  publicStatus: (ticketNumber: string) => api.get(`/public/tickets/${ticketNumber}/status`),
};

export const faqAPI = {
  getFAQs: (params?: any) => api.get('/faqs', { params }),
  getFAQ: (id: number) => api.get(`/faqs/${id}`),
  createFAQ: (data: any) => api.post('/faqs', data),
  updateFAQ: (id: number, data: any) => api.put(`/faqs/${id}`, data),
  deleteFAQ: (id: number) => api.delete(`/faqs/${id}`),
  searchFAQs: (query: string) => api.get('/faqs/search', { params: { query } }),
};

export const knowledgeBaseAPI = {
  getArticles: (params?: any) => api.get('/knowledge-base', { params }),
  getArticle: (id: number) => api.get(`/knowledge-base/${id}`),
  createArticle: (data: any) => api.post('/knowledge-base', data),
  updateArticle: (id: number, data: any) => api.put(`/knowledge-base/${id}`, data),
  deleteArticle: (id: number) => api.delete(`/knowledge-base/${id}`),
  publishArticle: (id: number) => api.put(`/knowledge-base/${id}/publish`),
};

export const productAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: number) => api.get(`/products/${id}`),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: number, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

export const organizationAPI = {
  getOrganizations: (params?: any) => api.get('/organizations', { params }),
  getOrganization: (id: number) => api.get(`/organizations/${id}`),
  createOrganization: (data: any) => api.post('/organizations', data),
  updateOrganization: (id: number, data: any) => api.put(`/organizations/${id}`, data),
  deleteOrganization: (id: number) => api.delete(`/organizations/${id}`),
};

export const fileAPI = {
  upload: (file: FormData) => api.post('/files/upload', file, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFiles: (params?: any) => api.get('/files', { params }),
  deleteFile: (id: number) => api.delete(`/files/${id}`),
};

export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
};

// Export api instance as default
export default api;