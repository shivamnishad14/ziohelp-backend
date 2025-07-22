import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '../../services/api';

export function useFAQs(params?: { search?: string; page?: number; size?: number; sortBy?: string; sortDir?: string }) {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqAPI.getAll(params).then(res => res.data),
  });
}

export function useFAQ(id: string | number) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => faqAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useUpdateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, faq }: { id: string | number; faq: { question: string; answer: string } }) => faqAPI.update(id, faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => faqAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useFAQsByCategory(category: string) {
  return useQuery({
    queryKey: ['faqs-category', category],
    queryFn: () => faqAPI.getByCategory(category).then(res => res.data),
    enabled: !!category,
  });
}

export function useFAQCategories() {
  return useQuery({
    queryKey: ['faq-categories'],
    queryFn: () => faqAPI.getCategories().then(res => res.data),
  });
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faq: { question: string; answer: string; organization_id?: number }) => faqAPI.create(faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useFAQsByProduct(productId: string | number) {
  return useQuery({
    queryKey: ['faqs-product', productId],
    queryFn: () => faqAPI.getByProduct(productId).then(res => res.data),
    enabled: !!productId,
  });
}

export function useSearchFAQs(query: string) {
  return useQuery({
    queryKey: ['faqs-search', query],
    queryFn: () => faqAPI.search(query).then(res => res.data),
    enabled: !!query,
  });
} 