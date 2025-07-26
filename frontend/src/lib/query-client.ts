import { QueryClient } from '@tanstack/react-query';

// Create and configure React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query configuration
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, or 404 errors
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Global mutation configuration
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for server errors (5xx)
        return failureCount < 2;
      },
    },
  },
});

// Error handler for React Query
export const onQueryError = (error: any) => {
  console.error('React Query Error:', error);
  
  // Handle specific error cases
  if (error?.response?.status === 401) {
    // Token expired or invalid - redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
};

// Success handler for React Query
export const onQuerySuccess = (data: any) => {
  // Global success handling if needed
  console.log('Query successful:', data);
};

// Configure global error boundary for React Query
queryClient.setMutationDefaults(['auth', 'login'], {
  mutationFn: async (variables: any) => {
    // This is just an example - actual implementation is in the hooks
    throw new Error('Use specific mutation hooks');
  },
  onError: onQueryError,
  onSuccess: onQuerySuccess,
});

// Utility function to invalidate related queries
export const invalidateQueriesAfterAuth = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['auth'] });
  queryClient.invalidateQueries({ queryKey: ['users'] });
  queryClient.invalidateQueries({ queryKey: ['organizations'] });
  queryClient.invalidateQueries({ queryKey: ['tickets'] });
};

// Utility function to clear sensitive data on logout
export const clearSensitiveQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: ['users'] });
  queryClient.removeQueries({ queryKey: ['tickets'] });
  queryClient.removeQueries({ queryKey: ['organizations'] });
  // Keep non-sensitive data like public KB articles
};

export default queryClient;
