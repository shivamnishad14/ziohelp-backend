import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRBAC } from '@/context/rbac-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Ticket,
  Plus,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search
} from 'lucide-react';
import Unauthorized from '@/components/pages/Unauthorized';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import {
  Book
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus, hasPermission } = useRBAC();

  // Check if user has access
  if (!user?.roles?.includes('USER') && !user?.roles?.some(role => ['AGENT', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER'].includes(role))) {
    return <Unauthorized />;
  }
  const { userMenus } = useRBAC();

  // Mock data - replace with real API calls
  const stats = {
    myTickets: 5,
    openTickets: 2,
    resolvedTickets: 3,
    avgResponseTime: '3.5 hours',
    recentTickets: [
      { 
        id: 1, 
        title: 'Unable to upload files', 
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdAt: '2 days ago',
        lastUpdate: '1 hour ago'
      },
      { 
        id: 2, 
        title: 'Password reset not working', 
        status: 'RESOLVED',
        priority: 'HIGH',
        createdAt: '5 days ago',
        lastUpdate: '3 days ago'
      },
      { 
        id: 3, 
        title: 'Feature request: Dark mode', 
        status: 'OPEN',
        priority: 'LOW',
        createdAt: '1 week ago',
        lastUpdate: '1 week ago'
      },
    ],
    quickLinks: [
      { name: 'How to reset password', type: 'faq', url: '/faq/reset-password' },
      { name: 'Getting started guide', type: 'guide', url: '/knowledge-base/getting-started' },
      { name: 'API documentation', type: 'docs', url: '/knowledge-base/api-docs' },
    ],
    notifications: [
      { id: 1, message: 'Your ticket #123 has been updated', time: '2 hours ago', type: 'ticket' },
      { id: 2, message: 'New feature announcement: File sharing', time: '1 day ago', type: 'feature' },
      { id: 3, message: 'Scheduled maintenance this weekend', time: '2 days ago', type: 'maintenance' },
    ]
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Hi {user?.fullName}, here's what's happening with your support requests.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myTickets}</div>
            <p className="text-xs text-muted-foreground">
              Total submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Response time
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
            <PermissionGuard resource="TICKET" action="WRITE">
              <Button asChild className="h-auto p-4">
                <Link to="/tickets/new" className="flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>New Ticket</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="TICKET" action="READ">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/tickets" className="flex flex-col items-center space-y-2">
                  <Ticket className="h-6 w-6" />
                  <span>My Tickets</span>
                </Link>
              </Button>
            </PermissionGuard>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
                <Book className="h-6 w-6" />
                <span>Knowledge Base</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/search" className="flex flex-col items-center space-y-2">
                <Search className="h-6 w-6" />
                <span>Search Help</span>
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
                {stats.recentTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No tickets yet</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link to="/tickets/new">Create your first ticket</Link>
                    </Button>
                  </div>
                ) : (
                  <>
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
                            Created {ticket.createdAt} • Updated {ticket.lastUpdate}
                          </p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/tickets">View All Tickets</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Quick Help & Notifications */}
        <div className="space-y-6">
          {/* Quick Help Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Quick Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.quickLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                    {link.type === 'faq' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {link.type === 'guide' && <Book className="h-4 w-4 text-green-500" />}
                    {link.type === 'docs' && <Search className="h-4 w-4 text-purple-500" />}
                    <Link to={link.url} className="text-sm hover:underline flex-1">
                      {link.name}
                    </Link>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/knowledge-base">Browse All Help</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-2">
                    <div className="mt-1">
                      {notification.type === 'ticket' && <Ticket className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'feature' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {notification.type === 'maintenance' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
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
