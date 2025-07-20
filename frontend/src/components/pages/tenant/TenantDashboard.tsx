import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { onTicketEvent, connectWebSocket, disconnectWebSocket } from '@/lib/websocket';

const TenantDashboard: React.FC = () => {
  const [ticketTrends, setTicketTrends] = useState<any[]>([]);
  const [slaMetrics, setSlaMetrics] = useState<any>({});
  const [userActivity, setUserActivity] = useState<any[]>([]);

  const fetchAnalytics = useCallback(() => {
    fetch('/api/dashboard/analytics/ticket-trends')
      .then(res => res.json())
      .then(data => {
        const trends = data.ticketTrends || {};
        setTicketTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));
      });
    fetch('/api/dashboard/analytics/sla-metrics')
      .then(res => res.json())
      .then(data => setSlaMetrics(data));
    fetch('/api/dashboard/analytics/user-activity')
      .then(res => res.json())
      .then(data => {
        const activity = data.userActivity || {};
        setUserActivity(Object.entries(activity).map(([date, count]) => ({ date, count })));
      });
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    connectWebSocket();
    const handler = () => {
      fetchAnalytics();
    };
    onTicketEvent(handler);
    return () => {
      disconnectWebSocket();
    };
  }, [fetchAnalytics]);

  function exportCSV(data: any[], filename: string) {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(',')].concat(
      data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tenant Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Ticket Trends (Last 30 Days)</CardTitle></CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => exportCSV(ticketTrends, 'tenant_ticket_trends.csv')}>Export CSV</Button>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ticketTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>User Activity (Last 30 Days)</CardTitle></CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => exportCSV(userActivity, 'tenant_user_activity.csv')}>Export CSV</Button>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>SLA Metrics</CardTitle></CardHeader>
          <CardContent>
            <div>Average Resolution Time: <b>{slaMetrics.averageResolutionMinutes ?? '--'}</b> min</div>
            <div>Overdue Tickets: <b>{slaMetrics.overdueTickets ?? '--'}</b></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard; 