import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Crown, Building, Users, Activity, Globe, Shield, Database, Zap } from 'lucide-react';
import type { MasterAdminDashboardResponse } from '@/types/api';

export default function MasterAdminDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'master-admin'],
    queryFn: async (): Promise<MasterAdminDashboardResponse> => {
      const response = await apiClient.get('/dashboard/master-admin');
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <Crown className="h-8 w-8 text-yellow-300" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{dashboardData?.welcomeMessage}</h1>
            <p className="text-indigo-100">Master administrative control center</p>
          </div>
        </div>
      </div>

      {/* Global Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.metrics.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Platform-wide</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData?.metrics.totalOrganizations || 0}</div>
            <p className="text-xs text-muted-foreground">Active tenants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardData?.metrics.totalTickets || 0}</div>
            <p className="text-xs text-muted-foreground">All organizations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData?.metrics.systemHealth || 0}%</div>
            <p className="text-xs text-muted-foreground">Operational status</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>Support agents across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 text-center">
              {dashboardData?.metrics.activeAgents || 0}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Admins</CardTitle>
            <CardDescription>Administrative users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 text-center">
              {dashboardData?.metrics.activeAdmins || 0}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Managing systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Admins</CardTitle>
            <CardDescription>Platform administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600 text-center">1</div>
            <p className="text-center text-sm text-muted-foreground mt-2">You + others</p>
          </CardContent>
        </Card>
      </div>

      {/* Master Admin Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Global system administration tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Multi-tenant Management</div>
                  <div className="text-sm text-gray-600">Manage organizations and tenants</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Security Management</div>
                  <div className="text-sm text-gray-600">Platform security and compliance</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Backup & Recovery</div>
                  <div className="text-sm text-gray-600">Data backup and disaster recovery</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Global Settings</div>
                  <div className="text-sm text-gray-600">Platform-wide configuration</div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Admin Features</CardTitle>
            <CardDescription>Available platform management capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardData?.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>Comprehensive system status and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{dashboardData?.metrics.totalUsers}</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{dashboardData?.metrics.totalOrganizations}</div>
              <div className="text-sm text-green-600">Organizations</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{dashboardData?.metrics.totalTickets}</div>
              <div className="text-sm text-purple-600">Total Tickets</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{dashboardData?.metrics.systemHealth}%</div>
              <div className="text-sm text-orange-600">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
