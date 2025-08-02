import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRBAC } from '@/context/rbac-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { 
  Ticket, 
  Clock, 
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';
import Unauthorized from '@/components/pages/Unauthorized';

export const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus, hasPermission } = useRBAC();

  // Check if user has agent access
  if (!user?.roles?.includes('AGENT')) {
    return <Unauthorized />;
  }

  // Mock data - replace with real API calls
  const stats = {
    assignedTickets: 8,
    resolvedToday: 12,
    avgResponseTime: '2.5 hours',
    satisfaction: 96.2,
    ticketQueue: [
      { id: 'T-1001', subject: 'Login Issue', priority: 'High', customer: 'John Doe', time: '5 min ago' },
      { id: 'T-1002', subject: 'Email Setup', priority: 'Medium', customer: 'Jane Smith', time: '15 min ago' },
      { id: 'T-1003', subject: 'Password Reset', priority: 'Low', customer: 'Bob Wilson', time: '30 min ago' },
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Ready to help customers today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assignedTickets}</div>
            <p className="text-xs text-muted-foreground">
              Active assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Below target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.satisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              Customer feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4">
              <Link to="/agent/tickets" className="flex flex-col items-center space-y-2">
                <Ticket className="h-6 w-6" />
                <span>My Tickets</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/agent/queue" className="flex flex-col items-center space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span>Ticket Queue</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Knowledge Base</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/agent/profile" className="flex flex-col items-center space-y-2">
                <User className="h-6 w-6" />
                <span>My Profile</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ticket Queue</span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/agent/queue">View All</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.ticketQueue.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{ticket.id}</span>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    Customer: {ticket.customer}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{ticket.time}</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/agent/tickets/${ticket.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
