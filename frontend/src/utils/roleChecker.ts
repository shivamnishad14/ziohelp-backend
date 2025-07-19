export function hasRole(required: string | string[]): boolean {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) return false;
  if (Array.isArray(required)) return required.includes(userRole);
  return userRole === required;
} 