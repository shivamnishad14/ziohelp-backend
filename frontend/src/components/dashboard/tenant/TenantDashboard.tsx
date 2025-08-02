import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRBAC } from '@/context/rbac-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { 
  Users, 
  Ticket, 
  Settings, 
  BarChart3,
  Building,
  TrendingUp,
  Clock
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';
import Unauthorized from '@/components/pages/Unauthorized';

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus, hasPermission } = useRBAC();

  // Check if user has tenant admin access
  if (!user?.roles?.includes('TENANT_ADMIN')) {
    return <Unauthorized />;
  }

  // Mock data - replace with real API calls
  const stats = {
    tenantUsers: 45,
    pendingTickets: 12,
    resolvedTickets: 234,
    satisfaction: 94.5,
    recentActivities: [
      { id: 1, action: 'Ticket Resolved', ticket: '#T-1234', time: '5 minutes ago' },
      { id: 2, action: 'User Added', user: 'jane@company.com', time: '1 hour ago' },
      { id: 3, action: 'Category Updated', category: 'Technical Issues', time: '2 hours ago' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tenant Administration</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Manage your organization's helpdesk.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PermissionGuard resource="USER" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenant Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tenantUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard resource="TICKET" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingTickets}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
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
            <PermissionGuard resource="USER" action="MANAGE">
              <Button asChild className="h-auto p-4">
                <Link to="/tenant/users" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="TICKET" action="MANAGE">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/tenant/tickets" className="flex flex-col items-center space-y-2">
                  <Ticket className="h-6 w-6" />
                  <span>View Tickets</span>
                </Link>
              </Button>
            </PermissionGuard>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/knowledge-base" className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Knowledge Base</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/tenant/settings" className="flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.ticket || activity.user || activity.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Available Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {userMenus.slice(0, 6).map((menu) => (
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
    </div>
  );
};
