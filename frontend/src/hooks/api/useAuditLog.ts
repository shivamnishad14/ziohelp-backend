import { useQuery } from '@tanstack/react-query';
import { auditLogAPI } from '../../services/api';

export function useAuditLogsByOrganization(orgId: string | number) {
  return useQuery({
    queryKey: ['audit-logs', orgId],
    queryFn: () => auditLogAPI.getByOrganization(orgId).then(res => res.data),
    enabled: !!orgId,
  });
} 