import React from 'react';
import AdminUserList from './AdminUserList';
import AuditLogTable from './AuditLogTable';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminUserList />
      <AuditLogTable />
    </div>
  );
};

export default AdminDashboard; 