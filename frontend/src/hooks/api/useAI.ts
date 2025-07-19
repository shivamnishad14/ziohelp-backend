import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';

export function useAISearchKnowledge() {
  return useMutation({
    mutationFn: async (payload: { query: string; productId: number }) => {
      const { data } = await api.post('/api/v1/ai/search-knowledge', payload);
      return data.data || data;
    },
  });
}

export function useAIGenerateResponse() {
  return useMutation({
    mutationFn: async (payload: { ticketId: number; productId: number; responseType: string }) => {
      const { data } = await api.post('/api/v1/ai/generate-response', payload);
      return data.data || data;
    },
  });
}

export function useAIAsk() {
  return useMutation({
    mutationFn: async (payload: { question: string; productId: number }) => {
      const { data } = await api.post('/api/v1/ai/ask', payload);
      return data.data || data;
    },
  });
}

export function useAIAnalyzeTicket() {
  return useMutation({
    mutationFn: async (payload: { ticketId: number; productId: number }) => {
      const { data } = await api.post('/api/v1/ai/analyze-ticket', payload);
      return data.data || data;
    },
  });
}

export function useAIStatus() {
  return useQuery({
    queryKey: ['ai-status'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/ai/status');
      return data.data || data;
    },
  });
} 