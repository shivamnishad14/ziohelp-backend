import React, { useEffect, useState } from 'react';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    authAPI.getCurrentUser()
      .then(res => {
        setProfile(res.data.data);
        setForm({ name: res.data.data.name, email: res.data.data.email });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authAPI.updateProfile(form);
      setSuccess(true);
      toast.success('Profile updated!');
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700 mr-4">
          {(profile?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-semibold">{profile?.name}</div>
          <div className="text-gray-500 text-sm">{profile?.email}</div>
          <div className="text-gray-400 text-xs mt-1">Role: <span className="font-medium text-gray-700">{profile?.role?.name || 'USER'}</span></div>
          <div className="text-gray-400 text-xs">Status: <span className="font-medium text-gray-700">{profile?.status || 'approved'}</span></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Save Changes</button>
        <button type="button" className="bg-gray-100 text-gray-700 px-4 py-2 rounded w-full mt-2 border border-gray-300" disabled>Change Password (coming soon)</button>
        {success && <div className="text-green-600 mt-2 text-center">Profile updated!</div>}
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
} 