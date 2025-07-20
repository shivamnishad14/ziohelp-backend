import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { onTicketEvent, connectWebSocket, disconnectWebSocket } from '@/lib/websocket';

const EngineerDashboard: React.FC = () => {
  const [assignedTrends, setAssignedTrends] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);

  const fetchAnalytics = useCallback(() => {
    // For demo, use ticket trends as assigned tickets (in real app, filter by assignedTo)
    fetch('/api/dashboard/analytics/ticket-trends')
      .then(res => res.json())
      .then(data => {
        const trends = data.ticketTrends || {};
        setAssignedTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));
      });
    // For demo, use resolved tickets as performance
    fetch('/api/dashboard/analytics/sla-metrics')
      .then(res => res.json())
      .then(data => {
        setPerformance([
          { label: 'Avg Resolution (min)', value: data.averageResolutionMinutes },
          { label: 'Overdue Tickets', value: data.overdueTickets }
        ]);
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
      <h1 className="text-2xl font-bold mb-6">Developer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Assigned Tickets (Trend)</CardTitle></CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => exportCSV(assignedTrends, 'assigned_tickets_trend.csv')}>Export CSV</Button>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={assignedTrends}>
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
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => exportCSV(performance, 'performance.csv')}>Export CSV</Button>
            <ul className="mt-4">
              {performance.map((item, i) => (
                <li key={i}><b>{item.label}:</b> {item.value ?? '--'}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngineerDashboard; 