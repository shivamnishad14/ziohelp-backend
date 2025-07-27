export interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
  password?: string;
  active: boolean;
  emailVerified: boolean;
  approved: boolean;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  profilePictureUrl?: string;
  lastLoginAt?: string;
  organizationId: number;
  organization?: Organization;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  isSystem: boolean;
  isActive: boolean;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logoUrl?: string;
  isActive: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
  maxUsers?: number;
  customDomain?: string;
  metadata?: Record<string, any>;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  username: string;
  password?: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  organizationId?: number;
  roleIds?: number[];
}

export enum UserRole {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
  MASTER_ADMIN = 'MASTER_ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export const USER_ROLES = {
  USER: UserRole.USER,
  AGENT: UserRole.AGENT, 
  ADMIN: UserRole.ADMIN,
  MASTER_ADMIN: UserRole.MASTER_ADMIN,
  DEVELOPER: UserRole.DEVELOPER,
};

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  roles: string[];
  organization: {
    id: number;
    name: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  organizationName?: string;
  phoneNumber?: string;
  jobTitle?: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdateData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
}

export interface UserSearchParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  organizationId?: number;
  active?: boolean;
}

export interface PaginatedUsers {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
