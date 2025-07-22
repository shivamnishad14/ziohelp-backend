// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    API_PREFIX: '/api',
    TIMEOUT: 30000, // 30 seconds
    WITH_CREDENTIALS: true,
};

// Derived configurations
export const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`;

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        ME: '/auth/me',
    },
    USERS: {
        BASE: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        SEARCH: '/users/search',
    },
    TICKETS: {
        BASE: '/tickets',
        BY_ID: (id: string) => `/tickets/${id}`,
        SEARCH: '/tickets/search',
    },
    // Add other endpoints as needed
};

export default API_CONFIG;
