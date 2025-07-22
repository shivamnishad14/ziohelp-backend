import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuditLog {
  id: number;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  organizationId?: number;
}

const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/audit-logs?type=ROLE_UPDATE')
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading audit logs...</div>;

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Recent Role Changes (Audit Log)</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.userEmail}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable; 