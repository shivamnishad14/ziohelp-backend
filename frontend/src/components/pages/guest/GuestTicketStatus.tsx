import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Search, Clock, CheckCircle, AlertCircle, XCircle, Copy, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface GuestTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  guestName: string;
  guestEmail: string;
  createdAt: string;
  updatedAt: string;
}

const GuestTicketStatus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  
  const [token, setToken] = useState(initialToken);
  const [ticket, setTicket] = useState<GuestTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searched, setSearched] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'RESOLVED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CLOSED':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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

  const searchTicket = async () => {
    if (!token.trim()) {
      setError('Please enter a ticket token');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/tickets/guest/${token.trim()}`);
      
      if (response.ok) {
        const result = await response.json();
        setTicket(result.data);
        setSearchParams({ token: token.trim() });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ticket not found');
        setTicket(null);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError('Failed to fetch ticket. Please try again.');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Ticket
          </h1>
          <p className="text-xl text-gray-600">
            Enter your ticket token to check the status of your support request
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Find Your Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your ticket token (e.g., ABC123DEF456)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchTicket()}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={searchTicket} 
                disabled={loading}
                className="px-8"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {token && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">Token:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {token}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToken}
                  className="h-6 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && searched && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ticket Details */}
        {ticket && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{ticket.subject}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority} Priority
                    </Badge>
                    <Badge variant="secondary">
                      {ticket.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ticket Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ticket Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ticket ID:</span>
                      <span className="font-medium">#{ticket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{ticket.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{ticket.guestEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Status Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {ticket.status !== 'OPEN' && (
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(ticket.status)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Status Updated to {ticket.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setToken('');
                    setTicket(null);
                    setError('');
                    setSearched(false);
                    setSearchParams({});
                  }}
                >
                  Search Another Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!ticket && !loading && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  If you don't have your ticket token, you can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Check your email for the ticket confirmation message</li>
                  <li>Contact our support team directly</li>
                  <li>Submit a new ticket through our help center</li>
                </ul>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/help-center'}
                  >
                    Go to Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GuestTicketStatus; 