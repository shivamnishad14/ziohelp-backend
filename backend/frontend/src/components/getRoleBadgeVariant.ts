// src/components/getRoleBadgeVariant.ts
// Utility to get badge variant for user roles
export function getRoleBadgeVariant(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'destructive';
    case 'USER':
      return 'default';
    case 'MODERATOR':
      return 'secondary';
    default:
      return 'outline';
  }
}
