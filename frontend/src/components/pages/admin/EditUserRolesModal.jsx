import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditUserRolesModal({ user, onClose }) {
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/roles').then(res => setRoles(res.data));
    axios.get(`/api/users/${user.id}/roles`).then(res => setUserRoles(res.data));
  }, [user.id]);

  const handleRoleChange = (roleName) => {
    setUserRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSave = () => {
    setSaving(true);
    axios.post(`/api/users/${user.id}/roles`, userRoles)
      .then(() => {
        setSaving(false);
        onClose();
      });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>Edit Roles for {user.name}</h3>
        {roles.map(role => (
          <div key={role.id}>
            <label>
              <input
                type="checkbox"
                checked={userRoles.includes(role.name)}
                onChange={() => handleRoleChange(role.name)}
                disabled={saving}
              />
              {role.name}
            </label>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <button onClick={handleSave} disabled={saving}>Save</button>
          <button onClick={onClose} style={{ marginLeft: 10 }} disabled={saving}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditUserRolesModal; 