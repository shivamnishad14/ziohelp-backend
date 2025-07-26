export function getDashboardRoute(roles: string[]): string {
  const priority = ['ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER', 'GUEST'];
  const roleToDashboard: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    TENANT_ADMIN: '/tenant-admin/dashboard',
    DEVELOPER: '/developer/dashboard',
    USER: '/dashboard',
    GUEST: '/guest/dashboard',
  };
  for (const role of priority) {
    if (roles.includes(role)) return roleToDashboard[role];
  }
  return '/dashboard'; // fallback
}   