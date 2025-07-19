import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, userAPI, ticketAPI, knowledgeBaseAPI, aiAPI, fileAPI } from '../services/api';
import { Product, User, Ticket, KnowledgeBaseArticle } from '../types';

// Product hooks
export const useProducts = (pageable?: any) => {
  return useQuery({
    queryKey: ['products', pageable],
    queryFn: () => productAPI.getAll(pageable),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      productAPI.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) => 
      productAPI.update(id, product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// User hooks
export const useUsers = (productId: string, pageable?: any) => {
  return useQuery({
    queryKey: ['users', productId, pageable],
    queryFn: () => userAPI.getAll(productId, pageable),
    enabled: !!productId,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, user }: { productId: string; user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }) => 
      userAPI.create(productId, user),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['users', productId] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<User> }) => 
      userAPI.update(id, user),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Ticket hooks
export const useTickets = (productId: string, pageable?: any) => {
  return useQuery({
    queryKey: ['tickets', productId, pageable],
    queryFn: () => ticketAPI.getAll(productId, pageable),
    enabled: !!productId,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, userId, ticket }: { productId: string; userId: string; ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'> }) => 
      ticketAPI.create(productId, userId, ticket),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', productId] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ticket }: { id: string; ticket: Partial<Ticket> }) => 
      ticketAPI.update(id, ticket),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ticketAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAddTicketComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, userId, comment }: { ticketId: string; userId: string; comment: { content: string } }) => 
      ticketAPI.addComment(ticketId, userId, comment),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};

// Knowledge Base hooks
export const useSearchKnowledgeBase = (productId: string, query: string, pageable?: any) => {
  return useQuery({
    queryKey: ['knowledge-base', productId, query, pageable],
    queryFn: () => knowledgeBaseAPI.search(productId, query, pageable),
    enabled: !!productId && !!query,
  });
};

export const useKnowledgeBaseArticle = (id: string) => {
  return useQuery({
    queryKey: ['knowledge-base-article', id],
    queryFn: () => knowledgeBaseAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (article: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'updatedAt'>) => 
      knowledgeBaseAPI.create(article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

export const useUpdateKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, article }: { id: string; article: Partial<KnowledgeBaseArticle> }) => 
      knowledgeBaseAPI.update(id, article),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-article', id] });
    },
  });
};

export const useDeleteKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => knowledgeBaseAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
    },
  });
};

// AI hooks
export const useAskAI = () => {
  return useMutation({
    mutationFn: ({ question, productId }: { question: string; productId: string }) => 
      aiAPI.ask(question, productId),
  });
};

// File hooks
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => fileAPI.upload(file),
  });
};

export const useDownloadFile = (filename: string) => {
  return useQuery({
    queryKey: ['file', filename],
    queryFn: () => fileAPI.download(filename),
    enabled: !!filename,
  });
}; 