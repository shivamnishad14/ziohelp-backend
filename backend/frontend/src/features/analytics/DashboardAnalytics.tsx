import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../../services/apiService';

const DashboardAnalytics: React.FC = () => {
  const { data, isLoading, error } = useQuery(['dashboard-analytics'], analyticsAPI.getStats);

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div>
      <h2>Dashboard Analytics</h2>
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
    </div>
  );
};

export default DashboardAnalytics;
