import React from 'react';
import { usePermissions } from '../../hooks/Permission';

const Permissions: React.FC = () => {
  const { data, isLoading, error } = usePermissions();

  if (isLoading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions</div>;

  return (
    <div>
      <h2>Permissions</h2>
      <ul>
        {data?.data?.map((perm: any) => (
          <li key={perm.id}>{perm.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Permissions;
