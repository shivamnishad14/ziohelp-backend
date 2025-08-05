import { useOrganizations, useCreateOrganization, useDeleteOrganization } from '../../hooks/OrganizationsQueries';
import { useState } from 'react';

export default function Organizations() {
  const { data: organizations, isLoading } = useOrganizations();
  const createOrg = useCreateOrganization();
  const deleteOrg = useDeleteOrganization();
  const [newOrg, setNewOrg] = useState({ name: '' });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <form onSubmit={e => { e.preventDefault(); createOrg.mutate(newOrg); }} className="mb-4">
        <input className="border p-2 mr-2" value={newOrg.name} onChange={e => setNewOrg({ name: e.target.value })} placeholder="Organization name" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {organizations?.content?.map((org: any) => (
            <li key={org.id} className="flex items-center justify-between border-b py-2">
              <span>{org.name}</span>
              <button className="text-red-500" onClick={() => deleteOrg.mutate(org.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
