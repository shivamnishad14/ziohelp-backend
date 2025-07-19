import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // For demo, use productId=1. In real app, get from context or selection.
  const productId = 1;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/dashboard/overview?productId=${productId}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load dashboard');
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load dashboard');
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!data) return null;

  // Role-specific rendering
  const role = data.role || data.metrics?.role || 'USER';

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard ({role})</h1>
      {/* Admin Dashboard */}
      {role === 'ADMIN' && (
        <>
          <section>
            <h2>Key Metrics</h2>
            <ul>
              {Object.entries(data.metrics || {}).map(([k, v]) => (
                <li key={k}><b>{k}:</b> {v as any}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Recent Activity</h2>
            <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data.recentActivity, null, 2)}</pre>
          </section>
          <section>
            <h2>Quick Actions</h2>
            <ul>
              {(data.quickActions || []).map((a: any, i: number) => (
                <li key={i}><a href={a.url}>{a.action}</a></li>
              ))}
            </ul>
          </section>
        </>
      )}
      {/* Developer/Engineer Dashboard */}
      {(role === 'DEVELOPER' || role === 'ENGINEER') && (
        <>
          <section>
            <h2>Assigned Tickets</h2>
            <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data.assignedTickets, null, 2)}</pre>
          </section>
          <section>
            <h2>Performance</h2>
            <ul>
              {Object.entries(data.performance || {}).map(([k, v]) => (
                <li key={k}><b>{k}:</b> {v as any}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Resources</h2>
            <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data.resources, null, 2)}</pre>
          </section>
          <section>
            <h2>Quick Actions</h2>
            <ul>
              {(data.quickActions || []).map((a: any, i: number) => (
                <li key={i}><a href={a.url}>{a.action}</a></li>
              ))}
            </ul>
          </section>
        </>
      )}
      {/* User Dashboard */}
      {role === 'USER' && (
        <>
          <section>
            <h2>My Tickets</h2>
            <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data.userTickets, null, 2)}</pre>
          </section>
          <section>
            <h2>Support</h2>
            <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data.support, null, 2)}</pre>
          </section>
          <section>
            <h2>Quick Actions</h2>
            <ul>
              {(data.quickActions || []).map((a: any, i: number) => (
                <li key={i}><a href={a.url}>{a.action}</a></li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard; 