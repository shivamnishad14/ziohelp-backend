import { useUsers, useCreateUser, useDeleteUser } from '../../hooks/UsersQueries';
import { useState } from 'react';

export default function UsersAdmin() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [newUser, setNewUser] = useState({ email: '', fullName: '', role: 'USER', password: '' });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <form onSubmit={e => { e.preventDefault(); createUser.mutate(newUser); }} className="mb-4">
        <input className="border p-2 mr-2" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
        <input className="border p-2 mr-2" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} placeholder="Full Name" />
        <input className="border p-2 mr-2" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} placeholder="Role" />
        <input className="border p-2 mr-2" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" type="password" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {Array.isArray(users) ? users.map((user: any) => (
            <li key={user.id} className="flex items-center justify-between border-b py-2">
              <span>{user.email} - {user.fullName}</span>
              <button className="text-red-500" onClick={() => deleteUser.mutate(user.id)}>Delete</button>
            </li>
          )) : null}
        </ul>
      )}
    </div>
  );
}
