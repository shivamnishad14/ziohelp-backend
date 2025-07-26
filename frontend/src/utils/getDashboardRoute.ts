export function getDashboardRoute(roles: string[]): string {
  const priority = ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'TENANT_ADMIN', 'DEVELOPER', 'USER', 'GUEST'];
  const roleToDashboard: Record<string, string> = {
    SUPER_ADMIN: '/master-admin/dashboard',
    ADMIN: '/admin/dashboard',
    AGENT: '/agent/dashboard',
    TENANT_ADMIN: '/tenant/dashboard',
    DEVELOPER: '/developer/dashboard',
    USER: '/dashboard',
    GUEST: '/guest/dashboard',
  };
  for (const role of priority) {
    if (roles.includes(role)) return roleToDashboard[role];
  }
  return '/dashboard'; // fallback
}   