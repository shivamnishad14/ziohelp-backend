// TanStack Query hooks for auth
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/apiService';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authAPI.login(email, password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authAPI.register,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authAPI.logout,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authAPI.resetPassword,
  });
}
