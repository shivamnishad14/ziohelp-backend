import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useTicketsByAssignee } from '@/hooks/api/useTickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketStatus, TicketPriority } from '@/types';
import { Link } from '@tanstack/react-router';

export default function AgentDashboard() {
  const { user } = useAuth();
  const { data: assignedTickets, isLoading } = useTicketsByAssignee(user?.id || 0);

  const stats = React.useMemo(() => {
    if (!assignedTickets?.content) return { 
      total: 0, 
      open: 0, 
      inProgress: 0, 
      resolved: 0,
      urgent: 0,
      high: 0
    };
    
    const tickets = assignedTickets.content;
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      urgent: tickets.filter(t => t.priority === TicketPriority.URGENT).length,
      high: tickets.filter(t => t.priority === TicketPriority.HIGH).length,
    };
  }, [assignedTickets?.content]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Agent Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Manage your assigned tickets and help customers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
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
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-auto p-4">
          <Link to="/tickets?status=OPEN" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🆕</span>
            <span>New Tickets</span>
            <span className="text-sm opacity-75">{stats.open} waiting</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/tickets?assignedToMe=true" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📋</span>
            <span>My Tickets</span>
            <span className="text-sm opacity-75">{stats.total} assigned</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/tickets?priority=URGENT" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🚨</span>
            <span>Urgent Tickets</span>
            <span className="text-sm opacity-75">{stats.urgent} urgent</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📚</span>
            <span>Knowledge Base</span>
            <span className="text-sm opacity-75">Find answers</span>
          </Link>
        </Button>
      </div>

      {/* Recent Assigned Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Assigned Tickets</CardTitle>
          <CardDescription>Tickets that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading your tickets...</div>
          ) : assignedTickets?.content?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tickets assigned to you yet.</p>
              <Button asChild>
                <Link to="/tickets">Browse Available Tickets</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTickets?.content?.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      #{ticket.ticketNumber} • Created by {ticket.createdBy?.fullName || ticket.guestName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === TicketPriority.URGENT ? 'bg-red-100 text-red-800' :
                      ticket.priority === TicketPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === TicketPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === TicketStatus.OPEN ? 'bg-orange-100 text-orange-800' :
                      ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                      ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <Button size="sm" asChild>
                      <Link to={`/tickets/${ticket.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {assignedTickets?.content && assignedTickets.content.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/tickets?assignedToMe=true">View All Assigned Tickets</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>Your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Tickets Resolved</span>
                <span className="font-bold text-green-600">{stats.resolved}</span>
              </div>
              <div className="flex justify-between">
                <span>Tickets In Progress</span>
                <span className="font-bold text-blue-600">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="font-bold">&lt; 2 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
            <CardDescription>Current ticket priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Urgent</span>
                <span className="font-bold text-red-600">{stats.urgent}</span>
              </div>
              <div className="flex justify-between">
                <span>High</span>
                <span className="font-bold text-orange-600">{stats.high}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Assigned</span>
                <span className="font-bold">{stats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
