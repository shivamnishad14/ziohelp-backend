import React from 'react';
import { useAuth } from '@/context/auth-context';
import Unauthorized from '../Unauthorized';

const DeveloperKnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  if (!user?.roles?.includes('DEVELOPER')) return <Unauthorized />;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Developer Knowledge Base Management</h1>
      <p>Manage and review knowledge base articles here.</p>
      {/* Add knowledge base management UI here */}
    </div>
  );
};

export default DeveloperKnowledgeBase;
