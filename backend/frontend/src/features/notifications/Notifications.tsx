import React from 'react';
import { useNotificationsByOrg } from '../../hooks/notificationQueries';

const Notifications: React.FC<{ orgId: number }> = ({ orgId }) => {
  const { data, isLoading, error } = useNotificationsByOrg(orgId);

  if (isLoading) return <div>Loading notifications...</div>;
  if (error) return <div>Error loading notifications</div>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {data?.data?.map((notif: any) => (
          <li key={notif.id}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
