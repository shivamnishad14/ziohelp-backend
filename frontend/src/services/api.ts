// Role API for role endpoints
export const roleAPI = {
  getAll: async () => {
    const response = await api.get('/admin/roles');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admin/roles', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/roles/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/roles/${id}`);
    return response.data;
  },
};
// Product API for product endpoints
export const productAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admin/products', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/admin/products/${id}/status`, { status });
    return response.data;
  },
};


import axios from 'axios';

// Create axios instance
const api = axios.create({
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

export default api;

// Auth API for authentication endpoints
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Ticket API for ticket endpoints
export const ticketAPI = {
  getAll: async (params: any) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

// User API for user endpoints
export const userAPI = {
  getAll: async (params: any) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};