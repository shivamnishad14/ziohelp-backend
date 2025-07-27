export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  category: string;
  parentId?: number;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  role: Role;
  permission: Permission;
}

export interface RoleMenuPermission {
  id: number;
  role: Role;
  menuItem: MenuItem;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
  menuPermissions: RoleMenuPermission[];
}

export interface UserWithRoleDetails {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  active: boolean;
  emailVerified: boolean;
  approved: boolean;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  avatarUrl?: string;
  lastLoginAt?: string;
  loginAttempts: number;
  lockedUntil?: string;
  organizationId: number;
  organization?: Organization;
  roles: RoleWithPermissions[];
  createdAt: string;
  updatedAt: string;
}

// Enhanced Role interface
export interface RoleExtended extends Role {
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  permissions?: Permission[];
  menuPermissions?: RoleMenuPermission[];
  userCount?: number;
}

// RBAC Context Types
export interface RBACContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: Array<{resource: string, action: string}>) => boolean;
  canAccessMenu: (menuPath: string) => boolean;
  canEditMenu: (menuPath: string) => boolean;
  canDeleteMenu: (menuPath: string) => boolean;
  userMenus: MenuItem[];
  refreshPermissions: () => Promise<void>;
  isLoading: boolean;
}

// Permission Check Types
export interface PermissionCheck {
  resource: string;
  action: string;
}

export interface MenuPermissionCheck {
  path: string;
  permission: 'view' | 'edit' | 'delete';
}

// Form Types for RBAC Management
export interface RoleFormData {
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds: number[];
  menuPermissions: Array<{
    menuItemId: number;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }>;
}

export interface PermissionFormData {
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface MenuItemFormData {
  name: string;
  path: string;
  icon: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  category: string;
  parentId?: number;
}

// API Response Types
export interface RoleResponse {
  content: RoleExtended[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PermissionResponse {
  content: Permission[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface MenuItemResponse {
  content: MenuItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Constants
export const RESOURCES = {
  USER: 'USER',
  ROLE: 'ROLE',
  ORGANIZATION: 'ORGANIZATION',
  TICKET: 'TICKET',
  SYSTEM: 'SYSTEM',
  AUDIT: 'AUDIT',
  MENU: 'MENU',
  PERMISSION: 'PERMISSION'
} as const;

export const ACTIONS = {
  READ: 'READ',
  WRITE: 'WRITE',
  DELETE: 'DELETE',
  MANAGE: 'MANAGE',
  ASSIGN: 'ASSIGN',
  ADMIN: 'ADMIN'
} as const;

export const MENU_CATEGORIES = {
  GENERAL: 'GENERAL',
  ADMIN: 'ADMIN',
  USER: 'USER',
  REPORTS: 'REPORTS',
  SETTINGS: 'SETTINGS'
} as const;

export type ResourceType = keyof typeof RESOURCES;
export type ActionType = keyof typeof ACTIONS;
export type MenuCategory = keyof typeof MENU_CATEGORIES;
