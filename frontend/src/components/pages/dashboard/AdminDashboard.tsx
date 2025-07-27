import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useTickets } from '@/hooks/api/useTickets';
import { useUsers } from '@/hooks/api/useUsers';
import { useProducts } from '@/hooks/api/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketStatus, TicketPriority } from '@/types';
import { Link } from '@tanstack/react-router';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: tickets } = useTickets();
  const { data: users } = useUsers();
  const { data: products } = useProducts();

  const stats = React.useMemo(() => {
    const ticketList = tickets?.content || [];
    const userList = users?.content || [];
    
    return {
      totalTickets: tickets?.totalElements || 0,
      openTickets: ticketList.filter(t => t.status === TicketStatus.OPEN).length,
      inProgressTickets: ticketList.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolvedTickets: ticketList.filter(t => t.status === TicketStatus.RESOLVED).length,
      urgentTickets: ticketList.filter(t => t.priority === TicketPriority.URGENT).length,
      totalUsers: users?.totalElements || 0,
      activeUsers: userList.filter(u => u.active).length,
      totalProducts: products?.totalElements || 0,
      unassignedTickets: ticketList.filter(t => !t.assignedToId).length,
    };
  }, [tickets, users, products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}! Here's your organization overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openTickets} open, {stats.inProgressTickets} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalUsers} total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentTickets}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
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
              Active products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button asChild className="h-auto p-4">
          <Link to="/admin/tickets" className="flex flex-col items-center space-y-2">
            <span className="text-lg">🎫</span>
            <span>Manage Tickets</span>
            <span className="text-sm opacity-75">{stats.unassignedTickets} unassigned</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/admin/users" className="flex flex-col items-center space-y-2">
            <span className="text-lg">👥</span>
            <span>Manage Users</span>
            <span className="text-sm opacity-75">{stats.totalUsers} users</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/admin/products" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📦</span>
            <span>Manage Products</span>
            <span className="text-sm opacity-75">{stats.totalProducts} products</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/admin/knowledge-base" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📚</span>
            <span>Knowledge Base</span>
            <span className="text-sm opacity-75">Manage articles</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/admin/faqs" className="flex flex-col items-center space-y-2">
            <span className="text-lg">❓</span>
            <span>Manage FAQs</span>
            <span className="text-sm opacity-75">Help customers</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-4">
          <Link to="/admin/reports" className="flex flex-col items-center space-y-2">
            <span className="text-lg">📊</span>
            <span>Reports</span>
            <span className="text-sm opacity-75">Analytics & insights</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets?.content?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No tickets yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets?.content?.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        #{ticket.ticketNumber} • {ticket.createdBy?.fullName || ticket.guestName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === TicketPriority.URGENT ? 'bg-red-100 text-red-800' :
                        ticket.priority === TicketPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === TicketStatus.OPEN ? 'bg-orange-100 text-orange-800' :
                        ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/tickets">View All</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>System Status</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Email Service</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>File Storage</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Available
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Status Overview</CardTitle>
          <CardDescription>Current distribution of ticket statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.openTickets}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressTickets}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.unassignedTickets}</div>
              <div className="text-sm text-muted-foreground">Unassigned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
