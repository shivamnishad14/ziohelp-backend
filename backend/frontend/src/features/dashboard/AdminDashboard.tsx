import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Ticket, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  UserPlus,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useUserCount, usePendingAdmins } from '../../hooks/useUsersApi';

export default function AdminDashboard() {
  const { data: userCount } = useUserCount();
  const { data: pendingAdmins } = usePendingAdmins();

  const stats = [
    {
      title: 'Total Users',
      value: userCount?.count || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Tickets',
      value: '1,234',
      change: '+5%',
      icon: Ticket,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Resolved Today',
      value: '89',
      change: '+23%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Pending Approvals',
      value: Array.isArray(pendingAdmins) ? pendingAdmins.length.toString() : '0',
      change: 'New',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivity = [
    {
      type: 'user_registered',
      message: 'New user John Doe registered',
      time: '2 minutes ago',
      status: 'pending',
    },
    {
      type: 'ticket_created',
      message: 'High priority ticket #1235 created',
      time: '5 minutes ago',
      status: 'urgent',
    },
    {
      type: 'user_approved',
      message: 'Developer Sarah Wilson approved',
      time: '10 minutes ago',
      status: 'completed',
    },
    {
      type: 'system_alert',
      message: 'Server maintenance scheduled',
      time: '1 hour ago',
      status: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your ZioHelp system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/approvals">
                <UserPlus className="mr-2 h-4 w-4" />
                Review Approvals ({Array.isArray(pendingAdmins) ? pendingAdmins.length : 0})
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/tickets">
                <Ticket className="mr-2 h-4 w-4" />
                View All Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative">
                    {activity.status === 'urgent' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {activity.status === 'pending' && (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    {activity.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {activity.status === 'info' && (
                      <Calendar className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={
                      activity.status === 'urgent' ? 'destructive' :
                      activity.status === 'pending' ? 'secondary' :
                      activity.status === 'completed' ? 'default' : 'outline'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Response Time</span>
                <Badge variant="default">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Performance</span>
                <Badge variant="default">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Service</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Background Jobs</span>
                <Badge variant="outline">3 running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ticket Resolution Rate</span>
                <span className="text-sm font-medium">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Response Time</span>
                <span className="text-sm font-medium">2.3 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">System Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
