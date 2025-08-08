// src/services/productHelpApi.ts
// Placeholder API types and functions for Product Help
import type { Product, ProductStats, KnowledgeBaseArticle } from '../types';

export const productHelpAPI = {
  getProducts: async (): Promise<Product[]> => [],
  getProductStats: async (productId: number): Promise<ProductStats> => ({ productId, tickets: 0, articles: 0, faqs: 0 }),
  getArticles: async (): Promise<KnowledgeBaseArticle[]> => [],
};

export type { Product, ProductStats, KnowledgeBaseArticle };
