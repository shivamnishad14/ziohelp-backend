import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosProgressEvent } from 'axios';
import api from '../../services/api';

export interface FileInfo {
  filename: string;
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

export function useListFiles() {
  return useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/files/list');
      return data.data || data;
    },
  });
}

export function useGetFileInfo(filename: string) {
  return useQuery({
    queryKey: ['file-info', filename],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/files/${filename}`);
      return data.data || data;
    },
    enabled: !!filename,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, onUploadProgress }: { formData: FormData; onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => {
      const { data } = await api.post('/api/v1/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (filename: string) => {
      const { data } = await api.get(`/api/v1/files/download/${filename}`, { responseType: 'blob' });
      return data;
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filename: string) => {
      const { data } = await api.delete(`/api/v1/files/${filename}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
} 