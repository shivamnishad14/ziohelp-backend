import React, { useState } from 'react';
import api from '../../services/api';

const roles = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'TENANT_ADMIN', label: 'Tenant Admin' },
  { value: 'DEVELOPER', label: 'Developer' },
  { value: 'USER', label: 'User' },
  { value: 'GUEST', label: 'Guest' },
];

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    role: 'USER',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('Registration successful! Please check your email to verify.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Register</h2>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }} />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }} />
      <input name="username" placeholder="Username" onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }} />
      <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }}>
        {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>
      <button type="submit" style={{ width: '100%' }}>Register</button>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </form>
  );
};

export default Register;
