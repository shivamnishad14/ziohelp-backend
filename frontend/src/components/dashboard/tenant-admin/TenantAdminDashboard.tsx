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
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Shield
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';

export const TenantAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMenus } = useRBAC();

  // Mock data - replace with real API calls
  const stats = {
    totalUsers: 45,
    activeTickets: 12,
    monthlyTickets: 89,
    avgResolutionTime: '4.2 hours',
    userSatisfaction: '4.6/5',
    pendingApprovals: 3,
    organizationInfo: {
      name: user?.organization?.name || 'Your Organization',
      plan: 'Premium',
      usersLimit: 50,
      storageUsed: '2.3 GB',
      storageLimit: '10 GB'
    },
    recentActivities: [
      { 
        id: 1, 
        type: 'user_created',
        message: 'New user added: jane.doe@company.com',
        time: '1 hour ago'
      },
      { 
        id: 2, 
        type: 'ticket_resolved',
        message: 'Ticket #234 resolved by support team',
        time: '3 hours ago'
      },
      { 
        id: 3, 
        type: 'role_updated',
        message: 'User role updated for john.smith@company.com',
        time: '5 hours ago'
      },
    ],
    teamPerformance: {
      totalTicketsThisMonth: 89,
      resolvedTickets: 76,
      avgResponseTime: '1.2 hours',
      satisfactionScore: 4.6
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Manage your organization and users.
        </p>
      </div>

      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {stats.organizationInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Subscription Plan</p>
              <Badge variant="default">{stats.organizationInfo.plan}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Users</p>
              <p className="text-lg font-semibold">
                {stats.totalUsers} / {stats.organizationInfo.usersLimit}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Storage</p>
              <p className="text-lg font-semibold">
                {stats.organizationInfo.storageUsed} / {stats.organizationInfo.storageLimit}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PermissionGuard resource="USER" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +3 this month
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard resource="TICKET" action="READ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTickets}</div>
              <p className="text-xs text-muted-foreground">
                {stats.monthlyTickets} total this month
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">
              Team performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userSatisfaction}</div>
            <p className="text-xs text-muted-foreground">
              User feedback score
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
            <PermissionGuard resource="USER" action="WRITE">
              <Button asChild className="h-auto p-4">
                <Link to="/admin/users/new" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Add User</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="USER" action="READ">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/admin/users" className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Manage Users</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="TICKET" action="READ">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/tickets" className="flex flex-col items-center space-y-2">
                  <Ticket className="h-6 w-6" />
                  <span>View Tickets</span>
                </Link>
              </Button>
            </PermissionGuard>

            <PermissionGuard resource="ORGANIZATION" action="WRITE">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/admin/organization/settings" className="flex flex-col items-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Org Settings</span>
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tickets This Month</span>
                <span className="font-semibold">{stats.teamPerformance.totalTicketsThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolved Tickets</span>
                <span className="font-semibold text-green-600">
                  {stats.teamPerformance.resolvedTickets}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-semibold">{stats.teamPerformance.avgResponseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfaction Score</span>
                <span className="font-semibold">{stats.teamPerformance.satisfactionScore}/5</span>
              </div>
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/reports">View Detailed Reports</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    {activity.type === 'user_created' && <Users className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'ticket_resolved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'role_updated' && <Shield className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/activity-log">View All Activities</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {stats.pendingApprovals > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-orange-700">
                You have {stats.pendingApprovals} user requests awaiting approval.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/users?filter=pending">Review Requests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
