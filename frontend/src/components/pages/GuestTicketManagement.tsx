import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Eye, Clock, CheckCircle, AlertCircle, Filter, RefreshCw } from 'lucide-react';

interface GuestTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  guestName: string;
  guestEmail: string;
  guestToken: string;
  createdAt: string;
  updatedAt: string;
}

const GuestTicketManagement: React.FC = () => {
  const [tickets, setTickets] = useState<GuestTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchGuestTickets();
  }, []);

  const fetchGuestTickets = async () => {
    try {
      // Note: This endpoint would need to be created in the backend
      // For now, we'll use a placeholder
      const response = await fetch('http://localhost:8080/api/v1/tickets/guest/list');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching guest tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.guestToken.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesPriority = priorityFilter === 'all' || ticket.priority.toUpperCase() === priorityFilter.toUpperCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh the tickets list
        fetchGuestTickets();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Ticket Management</h1>
          <p className="text-gray-600">Manage tickets submitted by guests without accounts</p>
        </div>
        <Button onClick={fetchGuestTickets} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Guest Tickets ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No guest tickets found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status}</span>
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority} Priority
                          </Badge>
                          <Badge variant="secondary">{ticket.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Guest:</span> {ticket.guestName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {ticket.guestEmail}
                          </div>
                          <div>
                            <span className="font-medium">Token:</span> {ticket.guestToken}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Open ticket details modal or navigate to ticket view
                            console.log('View ticket:', ticket.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {ticket.status === 'OPEN' && (
                          <Select
                            value={ticket.status}
                            onValueChange={(value: string) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestTicketManagement; 