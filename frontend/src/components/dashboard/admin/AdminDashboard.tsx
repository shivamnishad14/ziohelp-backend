import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRBAC } from '@/context/rbac-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { 
  Users, 
  Shield, 
  Building, 
  Ticket, 
  Settings, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { PermissionGuard, MultiplePermissionGuard } from '@/components/rbac';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus } = useRBAC();

  // Mock data - replace with real API calls
  const stats = {
    totalUsers: 150,
    activeRoles: 8,
    totalOrganizations: 12,
    pendingTickets: 23,
    systemHealth: 'healthy',
    recentActivities: [
      { id: 1, action: 'User Created', user: 'john@example.com', time: '2 minutes ago' },
      { id: 2, action: 'Role Updated', user: 'admin@system.com', time: '15 minutes ago' },
      { id: 3, action: 'Permission Granted', user: 'manager@company.com', time: '1 hour ago' },
    ],
    systemMetrics: {
      uptime: '99.9%',
      responseTime: '120ms',
      errorRate: '0.01%',
      storage: '78%'
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Here's your system overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PermissionGuard resource="USER" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard resource="ROLE" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRoles}</div>
              <p className="text-xs text-muted-foreground">
                Role-based access control
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard resource="ORGANIZATION" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                Multi-tenant setup
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
                <Link to="/admin/users" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="ROLE" action="MANAGE">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/admin/roles" className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Manage Roles</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="ORGANIZATION" action="MANAGE">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/admin/organizations" className="flex flex-col items-center space-y-2">
                  <Building className="h-6 w-6" />
                  <span>Organizations</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="SYSTEM" action="ADMIN">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/admin/settings" className="flex flex-col items-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>System Settings</span>
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Health */}
        <PermissionGuard resource="SYSTEM" action="ADMIN">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>System Status</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-mono">{stats.systemMetrics.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-mono">{stats.systemMetrics.responseTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-mono">{stats.systemMetrics.errorRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span className="font-mono">{stats.systemMetrics.storage}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Recent Activities */}
        <PermissionGuard resource="AUDIT" action="READ">
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
                        by {activity.user}
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
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/audit-logs">View All Activities</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Available Menus */}
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
