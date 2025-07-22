import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(res => res.ok ? res.text() : Promise.reject(res.text()))
      .then(msg => {
        setStatus('success');
        setMessage(msg || 'Email verified successfully!');
      })
      .catch(async err => {
        setStatus('error');
        setMessage(typeof err === 'string' ? err : 'Verification failed.');
      });
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={status === 'error' ? 'text-red-500' : 'text-green-600'}>{message}</p>
          {status === 'success' && (
            <Button className="mt-4 w-full" onClick={() => navigate('/login')}>Go to Login</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail; 