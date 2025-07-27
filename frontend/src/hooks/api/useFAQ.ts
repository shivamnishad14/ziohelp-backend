import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '@/services/api';
import { FAQ, FAQFormData, FAQSearchParams, PaginatedFAQs } from '@/types';

export const useFAQs = (params?: FAQSearchParams) =>
  useQuery<PaginatedFAQs>({
    queryKey: ['faqs', params],
    queryFn: () => faqAPI.getFAQs(params).then(res => res.data),
  });

export const useFAQ = (id: number) =>
  useQuery<FAQ>({
    queryKey: ['faqs', id],
    queryFn: () => faqAPI.getFAQ(id).then(res => res.data),
    enabled: !!id,
  });

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FAQFormData) => faqAPI.createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FAQFormData }) => 
      faqAPI.updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => faqAPI.deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useSearchFAQs = (query: string) =>
  useQuery<FAQ[]>({
    queryKey: ['faqs', 'search', query],
    queryFn: () => faqAPI.searchFAQs(query).then(res => res.data),
    enabled: !!query && query.length > 2,
  });

export const useFAQsByProduct = (productId: number) =>
  useQuery<PaginatedFAQs>({
    queryKey: ['faqs', 'product', productId],
    queryFn: () => faqAPI.getFAQs({ productId }).then(res => res.data),
    enabled: !!productId,
  });

export const useFAQsByCategory = (categoryId: number) =>
  useQuery<FAQ[]>({
    queryKey: ['faqs', 'category', categoryId],
    queryFn: () => faqAPI.getFAQs({ category: categoryId.toString() }).then(res => res.data.content),
    enabled: !!categoryId,
  });

export const useFAQCategories = () =>
  useQuery<string[]>({
    queryKey: ['faq-categories'],
    queryFn: () => faqAPI.getFAQs().then(res => {
      const categories = new Set(res.data.content.map((faq: FAQ) => faq.category));
      return Array.from(categories);
    }),
  });