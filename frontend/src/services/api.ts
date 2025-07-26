// import axios from 'axios';

// // Create axios instance
// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor for authentication
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access - clear token and redirect to login
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userRoles');
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Export api instance and types
// export default api;