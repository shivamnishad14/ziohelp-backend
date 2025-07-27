import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useTickets } from '@/hooks/api/useTickets';
import { useProducts } from '@/hooks/api/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketStatus, TicketPriority } from '@/types';
import { Link } from '@tanstack/react-router';

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const { data: tickets } = useTickets();
  const { data: products } = useProducts();

  const stats = React.useMemo(() => {
    const ticketList = tickets?.content || [];
    const bugTickets = ticketList.filter(t => t.category === 'BUG_REPORT');
    const featureTickets = ticketList.filter(t => t.category === 'FEATURE_REQUEST');
    const technicalTickets = ticketList.filter(t => t.category === 'TECHNICAL');
    
    return {
      totalTickets: tickets?.totalElements || 0,
      bugReports: bugTickets.length,
      featureRequests: featureTickets.length,
      technicalIssues: technicalTickets.length,
      urgentBugs: bugTickets.filter(t => t.priority === TicketPriority.URGENT).length,
      openBugs: bugTickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgressBugs: bugTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      totalProducts: products?.totalElements || 0,
    };
  }, [tickets, products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Developer Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Monitor bugs, features, and technical issues.
        </p>
      </div>

      {/* Developer Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bug Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bugReports}</div>
            <p className="text-xs text-muted-foreground">
              {stats.urgentBugs} urgent, {stats.openBugs} open
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featureRequests}</div>
            <p className="text-xs text-muted-foreground">
              User requested features
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.technicalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Integration & API issues
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
              Under development
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Developer Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-auto p-4">
          <Link to="/tickets?category=BUG_REPORT" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🐛</span>
            <span>Bug Reports</span>
            <span className="text-sm opacity-75">{stats.bugReports} total</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/tickets?category=FEATURE_REQUEST" className="flex flex-col items-center space-y-2">
            <span className="text-lg">✨</span>
            <span>Feature Requests</span>
            <span className="text-sm opacity-75">{stats.featureRequests} pending</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/tickets?category=TECHNICAL" className="flex flex-col items-center space-y-2">
            <span className="text-lg">⚙️</span>
            <span>Technical Issues</span>
            <span className="text-sm opacity-75">{stats.technicalIssues} issues</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/developer/api-docs" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📚</span>
            <span>API Documentation</span>
            <span className="text-sm opacity-75">Dev resources</span>
          </Link>
        </Button>
      </div>

      {/* Bug Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Bug Priority Breakdown</CardTitle>
          <CardDescription>Current bug reports by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgentBugs}</div>
              <div className="text-sm text-muted-foreground">Urgent Bugs</div>
              <div className="text-xs text-muted-foreground mt-1">Fix immediately</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.openBugs}</div>
              <div className="text-sm text-muted-foreground">Open Bugs</div>
              <div className="text-xs text-muted-foreground mt-1">Need attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressBugs}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-xs text-muted-foreground mt-1">Being worked on</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.bugReports - stats.openBugs - stats.inProgressBugs}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
              <div className="text-xs text-muted-foreground mt-1">Fixed & tested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Issues */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Critical Bug Reports</CardTitle>
            <CardDescription>High priority issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets?.content?.filter(t => 
              t.category === 'BUG_REPORT' && 
              (t.priority === TicketPriority.URGENT || t.priority === TicketPriority.HIGH)
            ).slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    #{ticket.ticketNumber} • {ticket.createdBy?.fullName || ticket.guestName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.priority === TicketPriority.URGENT ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {ticket.priority}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/tickets/${ticket.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            )) || <p className="text-muted-foreground text-center py-4">No critical bugs found.</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Request Queue</CardTitle>
            <CardDescription>Requested features from users</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets?.content?.filter(t => t.category === 'FEATURE_REQUEST').slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    #{ticket.ticketNumber} • {ticket.createdBy?.fullName || ticket.guestName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === TicketStatus.OPEN ? 'bg-blue-100 text-blue-800' :
                    ticket.status === TicketStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/tickets/${ticket.id}`}>Review</Link>
                  </Button>
                </div>
              </div>
            )) || <p className="text-muted-foreground text-center py-4">No feature requests found.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Development Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Development Tools & Resources</CardTitle>
          <CardDescription>Quick access to development resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/api-logs">API Logs</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/error-monitoring">Error Monitoring</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/performance">Performance Metrics</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/database">Database Tools</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/deployments">Deployment History</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/webhooks">Webhook Configuration</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/testing">Testing Suite</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer/documentation">Code Documentation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
