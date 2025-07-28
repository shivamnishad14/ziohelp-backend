
import React, { useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authAPI } from '@/services/api';

const ResetPassword: React.FC = () => {
  const search = useSearch({ from: '/reset-password' });
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = search.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
      return;
    }
    setStatus('loading');
    try {
      await authAPI.resetPassword(token, newPassword); // now sends { token, newPassword }
      setStatus('success');
      setMessage('Password reset successful!');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <>
              <p className="text-green-600">{message}</p>
              <Button className="mt-4 w-full" onClick={() => navigate('/login')}>Go to Login</Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              {status === 'error' && <p className="text-red-500">{message}</p>}
              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword; 