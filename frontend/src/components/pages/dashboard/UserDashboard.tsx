import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { useMyTickets } from '@/hooks/api/useTickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketStatus, TicketPriority } from '@/types';
import { Link } from '@tanstack/react-router';

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: tickets, isLoading } = useMyTickets();

  const stats = React.useMemo(() => {
    if (!tickets?.content) return { total: 0, open: 0, inProgress: 0, resolved: 0 };
    
    const ticketList = tickets.content;
    return {
      total: ticketList.length,
      open: ticketList.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: ticketList.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: ticketList.filter(t => t.status === TicketStatus.RESOLVED).length,
    };
  }, [tickets?.content]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your support tickets and account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Your latest support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading your tickets...</div>
          ) : tickets?.content?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any tickets yet.</p>
              <Button asChild>
                <Link to="/tickets/create">Create Your First Ticket</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets?.content?.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">#{ticket.ticketNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === TicketStatus.OPEN ? 'bg-orange-100 text-orange-800' :
                      ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                      ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === TicketPriority.URGENT ? 'bg-red-100 text-red-800' :
                      ticket.priority === TicketPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === TicketPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
              {tickets?.content && tickets.content.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/tickets">View All Tickets</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild className="h-auto p-4">
              <Link to="/tickets/create" className="flex flex-col items-center space-y-2">
                <span className="text-lg">🎫</span>
                <span>Create New Ticket</span>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/tickets" className="flex flex-col items-center space-y-2">
                <span className="text-lg">📋</span>
                <span>View My Tickets</span>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
                <span className="text-lg">📚</span>
                <span>Browse Help Articles</span>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/faq" className="flex flex-col items-center space-y-2">
                <span className="text-lg">❓</span>
                <span>View FAQ</span>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/profile" className="flex flex-col items-center space-y-2">
                <span className="text-lg">👤</span>
                <span>Edit Profile</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
