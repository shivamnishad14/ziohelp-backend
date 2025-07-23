import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/API';

export const useListFiles = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['files', params],
    queryFn: async () => (await api.get('/admin/files', { params })).data,
  });

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useDeleteFile = () => {};
export const useDownloadFile = () => {};