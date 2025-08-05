import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditLogAPI } from '../../services/apiService';

const AuditLogs: React.FC<{ orgId: number }> = ({ orgId }) => {
  const { data, isLoading, error } = useQuery(['audit-logs', orgId], () => auditLogAPI.getByOrg(orgId));

  if (isLoading) return <div>Loading audit logs...</div>;
  if (error) return <div>Error loading audit logs</div>;

  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {data?.data?.map((log: any) => (
          <li key={log.id}>{log.action}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogs;
