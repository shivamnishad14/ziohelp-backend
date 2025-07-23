import { z } from 'zod';

// User schema for validation and type inference
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  roles: z.array(z.string()),
  avatar: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
