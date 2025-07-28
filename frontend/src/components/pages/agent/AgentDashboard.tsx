import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { connectWebSocket, disconnectWebSocket, onTicketEvent } from '@/lib/websocket';
import api from '@/services/api';

// TODO: Make PRODUCT_ID dynamic if needed in the future.
const PRODUCT_ID = 1;

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: { name: string } | null;
}

const AgentDashboard: React.FC = () => {
  const [assignedTickets, setAssignedTickets] = useState<number | null>(null);
  const [openTickets, setOpenTickets] = useState<number | null>(null);
  const [resolvedToday, setResolvedToday] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketTrends, setTicketTrends] = useState<any[]>([]);

  const fetchStatsAndTickets = useCallback(async () => {
    try {
      // Fetch assigned tickets count
      const assignedResponse = await api.get(`/tickets/count?productId=${PRODUCT_ID}&assignedToMe=true`);
      setAssignedTickets(assignedResponse.data.data || assignedResponse.data);
      
      // Fetch open tickets count
      const openTicketsResponse = await api.get(`/tickets/count?productId=${PRODUCT_ID}&status=OPEN&assignedToMe=true`);
      setOpenTickets(openTicketsResponse.data.data || openTicketsResponse.data);
      
      // Fetch resolved today count
      const resolvedResponse = await api.get(`/tickets/count?productId=${PRODUCT_ID}&status=RESOLVED&resolvedToday=true&assignedToMe=true`);
      setResolvedToday(resolvedResponse.data.data || resolvedResponse.data);
      
      // Fetch assigned tickets list
      const ticketsResponse = await api.get(`/tickets?productId=${PRODUCT_ID}&size=10&page=0&assignedToMe=true`);
      setTickets(ticketsResponse.data.content || []);
      setLoadingTickets(false);
    } catch (error) {
      console.error('Error fetching agent stats and tickets:', error);
      setLoadingTickets(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Fetch agent-specific ticket trends
      const trendsResponse = await api.get('/dashboard/analytics/agent-ticket-trends');
      const trends = trendsResponse.data.ticketTrends || {};
      setTicketTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));
    } catch (error) {
      console.error('Error fetching agent analytics:', error);
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

  const handleTicketAction = async (ticketId: number, action: string) => {
    try {
      await api.post(`/tickets/${ticketId}/${action}`);
      fetchStatsAndTickets();
    } catch (error) {
      console.error(`Error performing ${action} on ticket ${ticketId}:`, error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
        
        {/* Agent Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedTickets !== null ? assignedTickets : '--'}</div>
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
              <CardTitle>Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedToday !== null ? resolvedToday : '--'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Trends */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>My Ticket Trends (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
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
        </div>

        {/* My Assigned Tickets */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Assigned Tickets</h2>
            <Button asChild>
              <a href="/agent/tickets">View All Tickets</a>
            </Button>
          </div>
          <div className="bg-card dark:bg-background rounded shadow p-4 overflow-x-auto">
            {loadingTickets ? (
              <div className="text-gray-500 text-center py-8">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No assigned tickets found.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted dark:bg-muted/50">
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{ticket.subject}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {ticket.status === 'OPEN' && (
                            <Button size="sm" onClick={() => handleTicketAction(ticket.id, 'start')}>
                              Start
                            </Button>
                          )}
                          {ticket.status === 'IN_PROGRESS' && (
                            <Button size="sm" onClick={() => handleTicketAction(ticket.id, 'resolve')}>
                              Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/tickets/${ticket.id}`}>View</a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <a href="/agent/tickets">Manage All Tickets</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/agent/knowledge-base">Knowledge Base</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agent Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <a href="/profile">My Profile</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/help-center">Help Center</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDashboard;
