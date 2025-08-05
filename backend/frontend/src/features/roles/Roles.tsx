import React from 'react';
import { useRoles } from '../../hooks/roleQueries';

const Roles: React.FC = () => {
  const { data, isLoading, error } = useRoles();

  if (isLoading) return <div>Loading roles...</div>;
  if (error) return <div>Error loading roles</div>;

  return (
    <div>
      <h2>Roles</h2>
      <ul>
        {data?.data?.map((role: any) => (
          <li key={role.id}>{role.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;
