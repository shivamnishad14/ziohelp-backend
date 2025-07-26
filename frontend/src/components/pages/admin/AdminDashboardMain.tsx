import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Layout } from '../../../components/layout/Layout';
import { Button } from '../../../components/ui/button';
import { onTicketEvent, connectWebSocket, disconnectWebSocket } from '@/lib/websocket';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import api from '@/services/API';

const PRODUCT_ID = 1; // TODO: Make this dynamic if needed

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: { name: string } | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: { name: string } | null;
  status: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboardMain: React.FC = () => {
  const [totalTickets, setTotalTickets] = useState<number | null>(null);
  const [openTickets, setOpenTickets] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [ticketTrends, setTicketTrends] = useState<any[]>([]);
  const [slaMetrics, setSlaMetrics] = useState<any>({});
  const [userActivity, setUserActivity] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get(`/admin/users?productId=${PRODUCT_ID}&size=20&page=0`);
      setUsers(response.data.content || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchStatsAndTickets = useCallback(async () => {
    try {
      // Fetch ticket count
      const ticketCountResponse = await api.get(`/tickets/count?productId=${PRODUCT_ID}`);
      setTotalTickets(ticketCountResponse.data.data || ticketCountResponse.data);
      
      // Fetch open tickets count
      const openTicketsResponse = await api.get(`/tickets/count?productId=${PRODUCT_ID}&status=OPEN`);
      setOpenTickets(openTicketsResponse.data.data || openTicketsResponse.data);
      
      // Fetch users count
      const usersCountResponse = await api.get(`/admin/users/count?productId=${PRODUCT_ID}`);
      setTotalUsers(usersCountResponse.data.data || usersCountResponse.data);
      
      // Fetch tickets list
      const ticketsResponse = await api.get(`/tickets?productId=${PRODUCT_ID}&size=10&page=0`);
      setTickets(ticketsResponse.data.content || []);
      setLoadingTickets(false);
      
      fetchUsers();
    } catch (error) {
      console.error('Error fetching stats and tickets:', error);
      setLoadingTickets(false);
    }
  }, [fetchUsers]);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Fetch ticket trends
      const trendsResponse = await api.get('/dashboard/analytics/ticket-trends');
      const trends = trendsResponse.data.ticketTrends || {};
      setTicketTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));
      
      // Fetch SLA metrics
      const slaResponse = await api.get('/dashboard/analytics/sla-metrics');
      setSlaMetrics(slaResponse.data);
      
      // Fetch user activity
      const activityResponse = await api.get('/dashboard/analytics/user-activity');
      const activity = activityResponse.data.userActivity || {};
      setUserActivity(Object.entries(activity).map(([date, count]) => ({ date, count })));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  useEffect(() => {
    fetchStatsAndTickets();
    fetchAnalytics();
  }, [fetchStatsAndTickets, fetchAnalytics]);

  useEffect(() => {
    connectWebSocket();
    const handler = (event: any) => {
      fetchStatsAndTickets();
      fetchAnalytics();
    };
    onTicketEvent(handler);
    return () => {
      disconnectWebSocket();
    };
  }, [fetchStatsAndTickets, fetchAnalytics]);

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

  const handleToggleActive = async (userId: number) => {
    try {
      await api.post(`/admin/users/toggle-active/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user active status:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex justify-end mb-6">
          <Button asChild>
            <a href="/admin-faq-kb">Manage FAQs & Knowledge Base</a>
          </Button>
        </div>
        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets !== null ? totalTickets : '--'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets !== null ? openTickets : '--'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers !== null ? totalUsers : '--'}</div>
            </CardContent>
          </Card>
        </div>
        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>Ticket Trends (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              <Button size="sm" onClick={() => exportCSV(ticketTrends, 'ticket_trends.csv')}>Export CSV</Button>
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
              <Button size="sm" onClick={() => exportCSV(userActivity, 'user_activity.csv')}>Export CSV</Button>
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
        {/* Ticket Management Table */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Ticket Management</h2>
          <div className="bg-card dark:bg-background rounded shadow p-4 overflow-x-auto">
            {loadingTickets ? (
              <div className="text-gray-500 text-center py-8">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No tickets found for this product.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted dark:bg-muted/50">
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{ticket.subject}</td>
                      <td className="px-4 py-2">{ticket.status}</td>
                      <td className="px-4 py-2">{ticket.priority}</td>
                      <td className="px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">{ticket.assignedTo?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* User Management Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="bg-card dark:bg-background rounded shadow p-4 overflow-x-auto">
            {loadingUsers ? (
              <div className="text-gray-500 text-center py-8">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No users found for this product.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted dark:bg-muted/50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Active</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{user.name || '-'}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role?.name || '-'}</td>
                      <td className="px-4 py-2">{user.status}</td>
                      <td className="px-4 py-2">{user.isActive ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant={user.isActive ? 'secondary' : 'default'} onClick={() => handleToggleActive(user.id)}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardMain; 