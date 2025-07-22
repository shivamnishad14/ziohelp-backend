export function hasRole(required: string | string[]): boolean {
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  if (!userRoles || userRoles.length === 0) return false;
  if (Array.isArray(required)) return required.some(r => userRoles.includes(r));
  return userRoles.includes(required);
} 