import { useQuery } from '@tanstack/react-query';
import api from '@/services/API';

export const useListFiles = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: ['files', params],
    queryFn: async () => (await api.get('/admin/files', { params })).data,
  });

export const useDeleteFile = () => {};
export const useDownloadFile = () => {};