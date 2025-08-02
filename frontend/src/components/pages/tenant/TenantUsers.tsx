import React from 'react';
import { useAuth } from '@/context/auth-context';
import Unauthorized from '../Unauthorized';

const TenantUsers: React.FC = () => {
  const { user } = useAuth();
  if (!user?.roles?.includes('TENANT_ADMIN')) return <Unauthorized />;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant User Management</h1>
      <p>Manage users for your tenant here.</p>
      {/* Add tenant user management table and actions here */}
    </div>
  );
};

export default TenantUsers;
