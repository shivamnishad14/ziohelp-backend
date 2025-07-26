import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Code, Bug, Database, Cpu, Monitor, GitBranch, Terminal, Shield } from 'lucide-react';
import type { DeveloperDashboardResponse } from '@/types/api';

export default function DeveloperDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'developer'],
    queryFn: async (): Promise<DeveloperDashboardResponse> => {
      const response = await apiClient.get('/dashboard/developer');
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
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <Code className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{dashboardData?.welcomeMessage}</h1>
            <p className="text-gray-300">Developer control panel and system monitoring</p>
          </div>
        </div>
      </div>

      {/* Development Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bugs</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardData?.metrics.totalBugs || 0}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Terminal className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.metrics.activeTasks || 0}</div>
            <p className="text-xs text-muted-foreground">In development</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Reviews</CardTitle>
            <GitBranch className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardData?.metrics.codeReviews || 0}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* System Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Uptime</CardTitle>
            <CardDescription>Platform operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 text-center">
              {dashboardData?.metrics.systemUptime || 0}%
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployments</CardTitle>
            <CardDescription>Recent deployments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 text-center">
              {dashboardData?.metrics.deployments || 0}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Calls</CardTitle>
            <CardDescription>Total API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 text-center">
              {(dashboardData?.metrics.apiCalls || 0).toLocaleString()}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Developer Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Development Tools</CardTitle>
            <CardDescription>Quick access to developer utilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Database Console</div>
                  <div className="text-sm text-gray-600">Direct database access and queries</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">System Monitoring</div>
                  <div className="text-sm text-gray-600">Real-time system performance</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <GitBranch className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Code Repository</div>
                  <div className="text-sm text-gray-600">Git repository management</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Terminal className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Server Console</div>
                  <div className="text-sm text-gray-600">Server administration tools</div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Features</CardTitle>
            <CardDescription>Available development capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardData?.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common developer tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-colors">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-800">Deploy</div>
              <div className="text-xs text-blue-600">Push to production</div>
            </button>
            <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-colors">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-green-800">DB Backup</div>
              <div className="text-xs text-green-600">Create backup</div>
            </button>
            <button className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-colors">
              <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-800">Monitor</div>
              <div className="text-xs text-purple-600">System health</div>
            </button>
            <button className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-colors">
              <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-orange-800">Security</div>
              <div className="text-xs text-orange-600">Audit logs</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Real-time platform health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-green-800">Backend API</div>
                <div className="text-sm text-green-600">Operational</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-green-800">Database</div>
                <div className="text-sm text-green-600">Connected</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-green-800">Redis Cache</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
