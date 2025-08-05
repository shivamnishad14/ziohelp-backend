// TanStack Query hooks for FAQs
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '../services/apiService';

export function useFaqs(params?: any) {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqAPI.getAll(params).then(res => res.data),
  });
}

export function useFaq(id: number) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => faqAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: faqAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: faqAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] }),
  });
}
