import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Code, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  MessageSquare,
  Ticket,
  Target,
  Coffee
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function DeveloperDashboard() {
  const stats = [
    {
      title: 'My Tickets',
      value: '8',
      change: '+2 today',
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'In Progress',
      value: '3',
      change: 'Active now',
      icon: Code,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Completed Today',
      value: '5',
      change: '+100%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'SLA Status',
      value: '92%',
      change: 'On track',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentTickets = [
    {
      id: '#1234',
      title: 'Fix login authentication bug',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: '2025-08-03',
      timeSpent: '2h 30m',
    },
    {
      id: '#1235',
      title: 'Implement user role permissions',
      priority: 'MEDIUM',
      status: 'ASSIGNED',
      dueDate: '2025-08-05',
      timeSpent: '0h',
    },
    {
      id: '#1236',
      title: 'Database optimization',
      priority: 'LOW',
      status: 'REVIEW',
      dueDate: '2025-08-07',
      timeSpent: '4h 15m',
    },
  ];

  const todayTasks = [
    {
      task: 'Complete authentication fix',
      estimated: '2h',
      progress: 75,
      priority: 'high',
    },
    {
      task: 'Code review for ticket #1230',
      estimated: '30m',
      progress: 0,
      priority: 'medium',
    },
    {
      task: 'Update documentation',
      estimated: '1h',
      progress: 50,
      priority: 'low',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your development workload overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Coffee className="w-4 h-4 mr-2" />
            Take Break
          </Button>
          <Button size="sm">
            <Code className="w-4 h-4 mr-2" />
            Start Coding
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
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* My Tickets */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              My Assigned Tickets
            </CardTitle>
            <CardDescription>
              Currently assigned development tasks
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
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {ticket.dueDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ticket.timeSpent}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Work on it
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dev/my-tickets">
                  View All My Tickets
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Today's Focus
            </CardTitle>
            <CardDescription>
              Priority tasks for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{task.task}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.estimated}
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {task.progress}% complete
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common development tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/dev/my-tickets">
                <Ticket className="mr-2 h-4 w-4" />
                My Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dev/comments">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comments & Updates
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dev/sla">
                <Target className="mr-2 h-4 w-4" />
                SLA Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/profile">
                <GitBranch className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Development Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>
              Your development statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tickets Completed</span>
                <span className="text-sm font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Code Reviews</span>
                <span className="text-sm font-bold text-blue-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hours Logged</span>
                <span className="text-sm font-bold text-purple-600">32h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bug Fixes</span>
                <span className="text-sm font-bold text-orange-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest development activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed ticket #1233</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Added comment to #1234</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <Code className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Started working on #1235</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
