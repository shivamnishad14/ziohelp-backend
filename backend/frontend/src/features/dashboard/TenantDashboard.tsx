import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Building, 
  Users, 
  Ticket, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  UserCog,
  FileText,
  BarChart3,
  Activity,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function TenantDashboard() {
  const stats = [
    {
      title: 'Total Tickets',
      value: '156',
      change: '+12%',
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'My Developers',
      value: '8',
      change: '+1 this week',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Resolved Tickets',
      value: '142',
      change: '+91%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Avg Resolution',
      value: '4.2h',
      change: 'Improved',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'Senior Developer',
      tickets: 8,
      status: 'active',
      lastActive: '2 hours ago',
    },
    {
      name: 'Sarah Wilson',
      role: 'Frontend Developer',
      tickets: 5,
      status: 'active',
      lastActive: '30 min ago',
    },
    {
      name: 'Mike Johnson',
      role: 'Backend Developer',
      tickets: 6,
      status: 'away',
      lastActive: '1 day ago',
    },
    {
      name: 'Emily Davis',
      role: 'Full Stack Developer',
      tickets: 7,
      status: 'active',
      lastActive: '1 hour ago',
    },
  ];

  const recentTickets = [
    {
      id: '#1240',
      title: 'Payment gateway integration',
      assignee: 'John Smith',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      created: '2025-08-02',
    },
    {
      id: '#1241',
      title: 'UI responsive design fixes',
      assignee: 'Sarah Wilson',
      priority: 'MEDIUM',
      status: 'REVIEW',
      created: '2025-08-01',
    },
    {
      id: '#1242',
      title: 'Database performance optimization',
      assignee: 'Mike Johnson',
      priority: 'LOW',
      status: 'ASSIGNED',
      created: '2025-08-01',
    },
  ];

  const projectMetrics = [
    {
      name: 'ZioHelp Core',
      progress: 85,
      tickets: 24,
      developers: 4,
      deadline: '2025-08-15',
    },
    {
      name: 'Mobile App',
      progress: 65,
      tickets: 18,
      developers: 3,
      deadline: '2025-08-30',
    },
    {
      name: 'API Enhancement',
      progress: 40,
      tickets: 12,
      developers: 2,
      deadline: '2025-09-10',
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'default';
      case 'ASSIGNED':
        return 'secondary';
      case 'REVIEW':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'away':
        return 'text-orange-600';
      case 'offline':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your development team and track project progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button size="sm">
            <UserCog className="w-4 h-4 mr-2" />
            Assign Tickets
          </Button>
        </div>
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
        {/* Team Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Development Team
            </CardTitle>
            <CardDescription>
              Your team members and their current workload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === 'active' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-orange-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{member.tickets} tickets</Badge>
                    </div>
                    <p className={`text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link to="/tenant/developers">
                  Manage Team
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/tenant/tickets">
                <Ticket className="mr-2 h-4 w-4" />
                View All Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tenant/assign">
                <UserCog className="mr-2 h-4 w-4" />
                Assign Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tenant/developers">
                <Users className="mr-2 h-4 w-4" />
                Manage Developers
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tenant/export">
                <FileText className="mr-2 h-4 w-4" />
                Export Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-orange-600" />
              Recent Tickets
            </CardTitle>
            <CardDescription>
              Latest tickets assigned to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge variant={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant={getStatusBadge(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{ticket.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Assigned to: {ticket.assignee}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {ticket.created}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Project Progress
            </CardTitle>
            <CardDescription>
              Current project status overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectMetrics.map((project) => (
                <div key={project.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <span className="text-sm font-bold text-green-600">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.tickets} tickets • {project.developers} developers</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Team Performance
            </CardTitle>
            <CardDescription>
              Key performance indicators for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="text-2xl font-bold text-blue-600">94%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                <div className="text-2xl font-bold text-green-600">3.8h</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <div className="text-2xl font-bold text-orange-600">156</div>
                <div className="text-sm text-muted-foreground">Total Tickets</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-muted-foreground">Team Size</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">3 high priority tickets overdue</p>
                  <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <Clock className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Project deadline approaching</p>
                  <p className="text-xs text-muted-foreground">ZioHelp Core due in 13 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New developer onboarding</p>
                  <p className="text-xs text-muted-foreground">Alex Chen starts Monday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
