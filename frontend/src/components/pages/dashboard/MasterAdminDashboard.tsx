import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useTickets } from '@/hooks/api/useTickets';
import { useUsers } from '@/hooks/api/useUsers';
import { useProducts } from '@/hooks/api/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function MasterAdminDashboard() {
  const { user } = useAuth();
  const { data: tickets } = useTickets();
  const { data: users } = useUsers();
  const { data: products } = useProducts();

  const stats = React.useMemo(() => {
    return {
      totalTickets: tickets?.totalElements || 0,
      totalUsers: users?.totalElements || 0,
      totalProducts: products?.totalElements || 0,
      activeUsers: users?.content?.filter(u => u.active).length || 0,
      pendingUsers: users?.content?.filter(u => !u.approved).length || 0,
      organizations: new Set(users?.content?.map(u => u.organizationId)).size || 0,
    };
  }, [tickets, users, products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Master Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Manage the entire ZioHelp platform.
        </p>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations}</div>
            <p className="text-xs text-muted-foreground">
              Active organizations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              Platform wide
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Managed products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingUsers}</div>
            <p className="text-xs text-muted-foreground">
              User approvals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Master Admin Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-auto p-4">
          <Link to="/master-admin/users" className="flex flex-col items-center space-y-2">
            <span className="text-lg">👥</span>
            <span>Manage All Users</span>
            <span className="text-sm opacity-75">{stats.totalUsers} users</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/organizations" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🏢</span>
            <span>Organizations</span>
            <span className="text-sm opacity-75">{stats.organizations} orgs</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/products" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📦</span>
            <span>Global Products</span>
            <span className="text-sm opacity-75">{stats.totalProducts} products</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/tickets" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🎫</span>
            <span>All Tickets</span>
            <span className="text-sm opacity-75">{stats.totalTickets} tickets</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/roles" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🔐</span>
            <span>Role Management</span>
            <span className="text-sm opacity-75">System roles</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/approvals" className="flex flex-col items-center space-y-2">
            <span className="text-lg">✅</span>
            <span>Approvals</span>
            <span className="text-sm opacity-75">{stats.pendingUsers} pending</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/system" className="flex flex-col items-center space-y-2">
            <span className="text-lg">⚙️</span>
            <span>System Settings</span>
            <span className="text-sm opacity-75">Configuration</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/master-admin/analytics" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📊</span>
            <span>Analytics</span>
            <span className="text-sm opacity-75">Platform insights</span>
          </Link>
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">&lt; 100ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15GB</div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1.2K</div>
              <div className="text-sm text-muted-foreground">Daily Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>New users joining the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {users?.content?.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.approved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {user.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            )) || <p className="text-muted-foreground">No recent registrations</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Tickets Resolved</span>
                <span className="font-bold text-green-600">2,847</span>
              </div>
              <div className="flex justify-between">
                <span>Average Resolution Time</span>
                <span className="font-bold">4.2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-bold text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Active Organizations</span>
                <span className="font-bold">{stats.organizations}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Administration</CardTitle>
          <CardDescription>Critical system management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/backup">System Backup</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/maintenance">Maintenance Mode</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/logs">System Logs</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/migrations">Database Migrations</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/notifications">Send Announcements</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/master-admin/security">Security Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
