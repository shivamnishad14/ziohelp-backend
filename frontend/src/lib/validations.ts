// Enhanced validation utilities with comprehensive error handling
import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email or username is required')
    .refine(
      (value) => value.includes('@') ? z.string().email().safeParse(value).success : value.length >= 3,
      'Please enter a valid email address or username (min 3 characters)'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters'),
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name cannot exceed 100 characters')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
});

// Ticket validation schemas
export const createTicketSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    required_error: 'Please select a priority level',
  }),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

export const updateTicketSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().optional(),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const addCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters'),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.instanceof(File)).optional(),
});

// Organization validation schemas
export const createOrganizationSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name cannot exceed 100 characters'),
  domain: z.string()
    .min(3, 'Domain must be at least 3 characters')
    .max(50, 'Domain cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Domain can only contain letters, numbers, and hyphens'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  contactEmail: z.string().email('Please enter a valid contact email'),
});

export const updateOrganizationSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name cannot exceed 100 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  contactEmail: z.string().email('Please enter a valid contact email').optional(),
});

// Knowledge Base validation schemas
export const createKBArticleSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content cannot exceed 50000 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  metaDescription: z.string()
    .max(160, 'Meta description cannot exceed 160 characters')
    .optional(),
});

export const updateKBArticleSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  content: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content cannot exceed 50000 characters')
    .optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  metaDescription: z.string()
    .max(160, 'Meta description cannot exceed 160 characters')
    .optional(),
});

export const createKBCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name cannot exceed 50 characters'),
  description: z.string()
    .max(200, 'Description cannot exceed 200 characters')
    .optional(),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'File type not supported'
    ),
});

export const imageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, GIF, and WebP images are allowed'
    ),
});

// Search and filter validation
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query cannot exceed 100 characters'),
  filters: z.record(z.any()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
});

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Common validation error handler
export const handleValidationErrors = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const field = err.path.join('.');
    errors[field] = err.message;
  });
  
  return errors;
};

// Type inference helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;
export type AddCommentFormData = z.infer<typeof addCommentSchema>;
export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;
export type CreateKBArticleFormData = z.infer<typeof createKBArticleSchema>;
export type UpdateKBArticleFormData = z.infer<typeof updateKBArticleSchema>;
export type CreateKBCategoryFormData = z.infer<typeof createKBCategorySchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
