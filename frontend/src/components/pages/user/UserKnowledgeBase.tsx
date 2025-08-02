import React from 'react';
import { useAuth } from '@/context/auth-context';
import Unauthorized from '../Unauthorized';

const UserKnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  if (!user?.roles?.includes('USER')) return <Unauthorized />;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      <p>Browse and search articles relevant to you.</p>
      {/* Add article list and search here */}
    </div>
  );
};

export default UserKnowledgeBase;
