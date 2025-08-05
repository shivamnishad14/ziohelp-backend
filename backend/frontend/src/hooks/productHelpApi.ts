import axios from 'axios';
import { API_BASE_URL } from './config';

export interface Product {
  id: number;
  name: string;
  description: string;
  domain: string;
  version: string;
  isActive: boolean;
  logoUrl?: string;
  contactEmail?: string;
  documentationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  product: Product;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  product: Product;
  createdBy: string;
  assignedTo?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ProductHelpData {
  product: Product;
  faqs: FAQ[];
  articles: KnowledgeBaseArticle[];
  tickets: Ticket[];
  recentTickets: Ticket[];
  popularArticles: KnowledgeBaseArticle[];
  faqCategories: string[];
  articleCategories: string[];
  ticketStats: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export interface ProductStats {
  faqCount: number;
  articleCount: number;
  ticketCount: number;
  categories: string[];
  recentArticles: KnowledgeBaseArticle[];
}

export interface SearchResult {
  faqs: FAQ[];
  articles: KnowledgeBaseArticle[];
  totalFaqs: number;
  totalArticles: number;
}

// Product API
export const productHelpApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/list`);
    return response.data;
  },

  // Get product by domain (public)
  getProductByDomain: async (domain: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/domain/${domain}`);
    return response.data;
  },

  // Get all help content for a product (public)
  getProductHelpByDomain: async (domain: string): Promise<ProductHelpData> => {
    const response = await axios.get(`${API_BASE_URL}/product-help/public/${domain}`);
    return response.data;
  },

  // Get product help dashboard (admin)
  getProductHelpDashboard: async (productId: number): Promise<ProductHelpData> => {
    const response = await axios.get(`${API_BASE_URL}/product-help/product/${productId}/dashboard`);
    return response.data;
  },

  // Get product statistics
  getProductStats: async (productId: number): Promise<ProductStats> => {
    const response = await axios.get(`${API_BASE_URL}/product-help/product/${productId}/stats`);
    return response.data;
  },

  // Search all help content
  searchProductHelp: async (domain: string, keyword: string, page: number = 0, size: number = 10): Promise<SearchResult> => {
    const response = await axios.get(`${API_BASE_URL}/product-help/public/${domain}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // Create ticket for product (public)
  createTicketForProduct: async (domain: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await axios.post(`${API_BASE_URL}/product-help/public/${domain}/ticket`, ticket);
    return response.data;
  },
};

// FAQ API
export const faqApi = {
  // Get FAQs by product (public)
  getPublicFaqsByProduct: async (domain: string, page: number = 0, size: number = 10): Promise<{ content: FAQ[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/faq/public/product/${domain}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get FAQs by product and category (public)
  getFaqsByProductAndCategory: async (domain: string, category: string): Promise<FAQ[]> => {
    const response = await axios.get(`${API_BASE_URL}/faq/public/product/${domain}/category/${category}`);
    return response.data;
  },

  // Search FAQs
  searchFaqs: async (domain: string, keyword: string, page: number = 0, size: number = 10): Promise<{ content: FAQ[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/faq/public/product/${domain}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // Get FAQ categories
  getFaqCategories: async (domain: string): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/faq/public/product/${domain}/categories`);
    return response.data;
  },

  // Admin APIs
  createFaq: async (productId: number, faq: Partial<FAQ>): Promise<FAQ> => {
    const response = await axios.post(`${API_BASE_URL}/faq/product/${productId}`, faq);
    return response.data;
  },

  updateFaq: async (id: number, faq: Partial<FAQ>): Promise<FAQ> => {
    const response = await axios.put(`${API_BASE_URL}/faq/${id}`, faq);
    return response.data;
  },

  deleteFaq: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/faq/${id}`);
  },
};

// Knowledge Base API
export const knowledgeBaseApi = {
  // Get articles by product (public)
  getPublicArticlesByProduct: async (domain: string, page: number = 0, size: number = 10): Promise<{ content: KnowledgeBaseArticle[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-base/articles/public/product/${domain}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get article by ID (public)
  getPublicArticle: async (id: number): Promise<KnowledgeBaseArticle> => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-base/articles/public/${id}`);
    return response.data;
  },

  // Get articles by category
  getArticlesByCategory: async (domain: string, category: string): Promise<KnowledgeBaseArticle[]> => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-base/articles/public/product/${domain}/category/${category}`);
    return response.data;
  },

  // Search articles
  searchArticles: async (domain: string, keyword: string, page: number = 0, size: number = 10): Promise<{ content: KnowledgeBaseArticle[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-base/articles/public/product/${domain}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // Get article categories
  getArticleCategories: async (domain: string): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-base/articles/public/product/${domain}/categories`);
    return response.data;
  },

  // Admin APIs
  createArticle: async (productId: number, article: Partial<KnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> => {
    const response = await axios.post(`${API_BASE_URL}/knowledge-base/articles/product/${productId}`, article);
    return response.data;
  },

  updateArticle: async (id: number, article: Partial<KnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> => {
    const response = await axios.put(`${API_BASE_URL}/knowledge-base/articles/${id}`, article);
    return response.data;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/knowledge-base/articles/${id}`);
  },
};

// Ticket API
export const ticketApi = {
  // Get tickets by product (admin)
  getTicketsByProduct: async (productId: number, page: number = 0, size: number = 10): Promise<{ content: Ticket[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/tickets/product/${productId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Create ticket
  createTicket: async (productId: number, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await axios.post(`${API_BASE_URL}/tickets/product/${productId}`, ticket);
    return response.data;
  },

  // Update ticket
  updateTicket: async (id: number, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}`, ticket);
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (id: number, status: string): Promise<Ticket> => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}/status`, { status });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },

  // Search tickets
  searchTickets: async (productId: number, keyword: string, page: number = 0, size: number = 10): Promise<{ content: Ticket[], totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/tickets/product/${productId}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },
};

export default {
  productHelpApi,
  faqApi,
  knowledgeBaseApi,
  ticketApi,
};
