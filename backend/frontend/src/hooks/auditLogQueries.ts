// TanStack Query hooks for audit logs
import { useQuery } from '@tanstack/react-query';
import { auditLogAPI } from '../services/apiService';

export function useAuditLogsByOrg(orgId: number) {
  return useQuery({
    queryKey: ['audit-logs', orgId],
    queryFn: () => auditLogAPI.getByOrg(orgId).then(res => res.data),
    enabled: !!orgId,
  });
}
