import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Users, Shield, Settings, BarChart3, FileText, CheckCircle, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminDashboardData {
  welcomeMessage: string;
  userInfo: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    pendingApprovals: number;
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    resolutionRate: number;
  };
  features: string[];
}

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async (): Promise<AdminDashboardData> => {
      const response = await apiClient.get('/dashboard/admin');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">{dashboardData?.welcomeMessage}</h1>
        <p className="text-purple-100">Administrative control panel for system management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.metrics.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData?.metrics.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData?.metrics.pendingApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData?.metrics.resolutionRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">Ticket resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.metrics.totalTickets || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{dashboardData?.metrics.openTickets || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{dashboardData?.metrics.resolvedTickets || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Administrative Actions</CardTitle>
            <CardDescription>Common admin tasks and management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">User Management</div>
                  <div className="text-sm text-gray-600">Manage users, roles, and permissions</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">System Settings</div>
                  <div className="text-sm text-gray-600">Configure global system preferences</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Analytics & Reports</div>
                  <div className="text-sm text-gray-600">View detailed system analytics</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">Security & Audit</div>
                  <div className="text-sm text-gray-600">Review audit logs and security</div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Features</CardTitle>
            <CardDescription>Available administrative capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardData?.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
          <CardDescription>Current status of key system metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">Users</div>
              <div className="text-2xl font-bold text-blue-800">{dashboardData?.metrics.activeUsers}</div>
              <div className="text-sm text-blue-600">Active / {dashboardData?.metrics.totalUsers} Total</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">Tickets</div>
              <div className="text-2xl font-bold text-green-800">{dashboardData?.metrics.resolvedTickets}</div>
              <div className="text-sm text-green-600">Resolved / {dashboardData?.metrics.totalTickets} Total</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-600">Pending</div>
              <div className="text-2xl font-bold text-orange-800">{dashboardData?.metrics.pendingApprovals}</div>
              <div className="text-sm text-orange-600">Need Approval</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">Performance</div>
              <div className="text-2xl font-bold text-purple-800">
                {dashboardData?.metrics.resolutionRate?.toFixed(0) || '0'}%
              </div>
              <div className="text-sm text-purple-600">Resolution Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
