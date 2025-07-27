import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileAPI } from '@/services/api';
import { Attachment } from '@/types';

export const useFiles = (params?: { page?: number; size?: number }) =>
  useQuery<{ content: Attachment[]; totalElements: number }>({
    queryKey: ['files', params],
    queryFn: () => fileAPI.getFiles(params).then(res => res.data),
  });

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: FormData) => fileAPI.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => fileAPI.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useListFiles = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['files', params],
    queryFn: async () => (await api.get('/admin/files', { params })).data,
  });

export const useDeleteFile = () => {};
export const useDownloadFile = () => {};