export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'AGENT';
  productId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'AGENT';
  productId: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'AGENT';
}

export interface UserListResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 