// src/types/index.ts
// Central type definitions for the frontend

export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  parentId: number | null;
  children: MenuItem[];
  roles: string[];
  description: string;
  category: string;
  path: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface ProductStats {
  productId: number;
  tickets: number;
  articles: number;
  faqs: number;
}
