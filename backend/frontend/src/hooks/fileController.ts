// TanStack Query hooks for files
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileAPI } from '../services/apiService';

export function useFiles() {
  return useQuery({
    queryKey: ['files'],
    queryFn: () => fileAPI.list().then(res => res.data),
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fileAPI.upload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] }),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fileAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] }),
  });
}
