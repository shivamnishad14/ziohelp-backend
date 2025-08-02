import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Plus, 
  Ticket, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  Bot,
  Star,
  TrendingUp
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function UserDashboard() {
  const stats = [
    {
      title: 'My Tickets',
      value: '12',
      change: '+2 this week',
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Resolved',
      value: '8',
      change: '67% resolved',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'In Progress',
      value: '3',
      change: 'Avg 2 days',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending',
      value: '1',
      change: 'Needs attention',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const recentTickets = [
    {
      id: '#1234',
      title: 'Unable to login to account',
      status: 'in_progress',
      priority: 'high',
      created: '2 hours ago',
      lastUpdate: '30 mins ago',
    },
    {
      id: '#1233',
      title: 'Feature request: Dark mode',
      status: 'completed',
      priority: 'low',
      created: '1 day ago',
      lastUpdate: '2 hours ago',
    },
    {
      id: '#1232',
      title: 'Payment processing issue',
      status: 'pending',
      priority: 'high',
      created: '2 days ago',
      lastUpdate: '1 day ago',
    },
  ];

  const quickActions = [
    {
      title: 'Raise New Ticket',
      description: 'Get help with your issues',
      icon: Plus,
      href: '/user/raise-ticket',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Browse FAQs',
      description: 'Find quick answers',
      icon: HelpCircle,
      href: '/faqs',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Chat Assistant',
      description: 'Get instant AI help',
      icon: Bot,
      href: '/chatbot',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your support tickets and quick actions
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
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get help and find answers quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Button 
                key={action.title}
                asChild 
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
              >
                <Link to={action.href}>
                  <action.icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tickets</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/user/tickets">View All</Link>
              </Button>
            </div>
            <CardDescription>
              Your latest support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{ticket.id}</span>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <h4 className="font-medium">{ticket.title}</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Created {ticket.created}</span>
                    <span>Updated {ticket.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help & Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Help & Resources</CardTitle>
            <CardDescription>
              Popular help topics and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Popular Articles</h4>
                <div className="space-y-2">
                  <Link to="/faqs/getting-started" className="block p-2 rounded hover:bg-muted text-sm">
                    <div className="flex items-center justify-between">
                      <span>Getting Started Guide</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </Link>
                  <Link to="/faqs/password-reset" className="block p-2 rounded hover:bg-muted text-sm">
                    <div className="flex items-center justify-between">
                      <span>How to Reset Password</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </Link>
                  <Link to="/faqs/billing" className="block p-2 rounded hover:bg-muted text-sm">
                    <div className="flex items-center justify-between">
                      <span>Billing & Payments</span>
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/chatbot">
                    <Bot className="mr-2 h-4 w-4" />
                    Ask AI Assistant
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tips</CardTitle>
          <CardDescription>
            Make the most of our support system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <HelpCircle className="h-8 w-8 text-blue-500" />
              <h4 className="font-medium">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Provide detailed descriptions of your issues for faster resolution
              </p>
            </div>
            <div className="space-y-2">
              <MessageSquare className="h-8 w-8 text-green-500" />
              <h4 className="font-medium">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Check your tickets regularly for updates from our support team
              </p>
            </div>
            <div className="space-y-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <h4 className="font-medium">Rate Your Experience</h4>
              <p className="text-sm text-muted-foreground">
                Help us improve by rating resolved tickets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
