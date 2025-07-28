import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRBAC } from '@/context/rbac-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { 
  Ticket, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';

export const DeveloperDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus } = useRBAC();

  // TODO: Replace mock stats with real API data
  const stats = {
    assignedTickets: 15,
    completedToday: 3,
    avgResolutionTime: '2.5 hours',
    customerSatisfaction: '4.8/5',
    pendingReview: 2,
    recentTickets: [
      { 
        id: 1, 
        title: 'Login issue with OAuth', 
        priority: 'HIGH', 
        status: 'IN_PROGRESS',
        customer: 'john@company.com',
        assignedAt: '2 hours ago'
      },
      { 
        id: 2, 
        title: 'API rate limiting error', 
        priority: 'MEDIUM', 
        status: 'OPEN',
        customer: 'sarah@startup.io',
        assignedAt: '4 hours ago'
      },
      { 
        id: 3, 
        title: 'Database connection timeout', 
        priority: 'CRITICAL', 
        status: 'RESOLVED',
        customer: 'admin@enterprise.com',
        assignedAt: '1 day ago'
      },
    ],
    upcomingTasks: [
      { id: 1, task: 'Code review for ticket #234', due: 'Today 3:00 PM' },
      { id: 2, task: 'Update documentation', due: 'Tomorrow 10:00 AM' },
      { id: 3, task: 'Team standup meeting', due: 'Tomorrow 9:00 AM' },
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-orange-600';
      case 'IN_PROGRESS': return 'text-blue-600';
      case 'RESOLVED': return 'text-green-600';
      case 'CLOSED': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Developer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Here's your support queue overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PermissionGuard resource="TICKET" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedTickets}</div>
              <p className="text-xs text-muted-foreground">
                Active assignments
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Great progress!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">
              Below target time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
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
            <PermissionGuard resource="TICKET" action="READ">
              <Button asChild className="h-auto p-4">
                <Link to="/tickets?status=assigned&assignee=me" className="flex flex-col items-center space-y-2">
                  <Ticket className="h-6 w-6" />
                  <span>My Tickets</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="TICKET" action="WRITE">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/tickets?status=open" className="flex flex-col items-center space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>Unassigned</span>
                </Link>
              </Button>
            </PermissionGuard>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Knowledge Base</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/reports/developer" className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>My Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tickets */}
        <PermissionGuard resource="TICKET" action="READ">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Recent Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{ticket.title}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getPriorityColor(ticket.priority)} text-white`}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {ticket.customer} • {ticket.assignedAt}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tickets?assignee=me">View All My Tickets</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{task.task}</p>
                    <p className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      Due: {task.due}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Mark Done
                  </Button>
                </div>
              ))}
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Available Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
            {userMenus.map((menu) => (
              <Button
                key={menu.id}
                variant="ghost"
                size="sm"
                asChild
                className="justify-start h-auto p-3"
              >
                <Link to={menu.path}>
                  <span className="mr-2">{menu.icon}</span>
                  {menu.name}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
