import React from 'react';
import { useAuth } from '@/context/auth-context';
import Unauthorized from '../Unauthorized';

const TicketQueue: React.FC = () => {
  const { user } = useAuth();
  if (!user?.roles?.includes('AGENT')) return <Unauthorized />;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Ticket Queue</h1>
      <p>View and manage assigned tickets here.</p>
      {/* Add ticket list and actions here */}
    </div>
  );
};

export default TicketQueue;
