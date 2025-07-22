import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUserRolesModal from './EditUserRolesModal';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = () => {
    axios.get(`/api/users?page=${page}&size=10&search=${search}`)
      .then(res => {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, search]);

  return (
    <div>
      <h2>User Management</h2>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search users..."
        style={{ marginBottom: 10 }}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Roles</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.roles.map(role => (
                  <span key={role} style={{
                    display: 'inline-block',
                    background: '#eee',
                    borderRadius: 4,
                    padding: '2px 8px',
                    marginRight: 4
                  }}>{role}</span>
                ))}
              </td>
              <td>
                <button onClick={() => setEditUser(user)}>Edit Roles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page + 1 >= totalPages}>Next</button>
      </div>
      {editUser && (
        <EditUserRolesModal
          user={editUser}
          onClose={() => { setEditUser(null); fetchUsers(); }}
        />
      )}
    </div>
  );
}

export default AdminUserList; 