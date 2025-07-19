import { useState } from 'react';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authAPI.login(form.email, form.password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow mt-16 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <label className="block">
        Email:
        <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <label className="block">
        Password:
        <input name="password" type="password" value={form.password} onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center" disabled={loading}>
        {loading ? <span className="loader mr-2"></span> : null}
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="text-red-600 text-center">{error}</div>}
    </form>
  );
} 