import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Plus, Search, Filter, MoreHorizontal, Eye, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { Ticket, TicketPriority } from './types';

const Tickets = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicket, setNewTicket] = useState<Ticket>({
    id: 0,
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdBy: { id: 0, username: '' },
    createdDate: '',
    updatedDate: '',
  });

  const { data: tickets, isLoading, error } = useQuery<Ticket[]>({
    queryKey: ['tickets', selectedTab, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: selectedTab,
        search: searchTerm,
      });
      const response = await api.get(`/tickets?${params.toString()}`);
      return response.data;
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: Ticket) => {
      const response = await api.post('/tickets', ticket);
      return response.data;
    },
    onSuccess: () => {
      setShowCreateForm(false);
      setNewTicket({ id: 0, title: '', description: '', priority: 'MEDIUM', status: 'OPEN', createdBy: { id: 0, username: '' }, createdDate: '', updatedDate: '' });
      queryClient.invalidateQueries({ queryKey: ['tickets', selectedTab, searchTerm] });
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.put(`/tickets/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', selectedTab, searchTerm] });
    },
  });

  const queryClient = useQueryClient();

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createTicketMutation.mutate(newTicket);
  };

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    updateTicketStatusMutation.mutate({ id: ticketId, status: newStatus });
  };

  const getPriorityBadgeVariant = (priority: string) => {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'destructive';
      case 'IN_PROGRESS':
        return 'default';
      case 'CLOSED':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Eye className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />;
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter tickets based on tab and search
  const filteredTickets = tickets?.filter(ticket => {
    const matchesTab = selectedTab === 'all' || ticket.status.toLowerCase().replace('_', '-') === selectedTab;
    const matchesSearch = searchTerm === '' || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  const ticketCounts = {
    all: tickets?.length || 0,
    open: tickets?.filter(t => t.status === 'OPEN').length || 0,
    'in-progress': tickets?.filter(t => t.status === 'IN_PROGRESS').length || 0,
    closed: tickets?.filter(t => t.status === 'CLOSED').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading tickets. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track support tickets
          </p>
        </div>
        
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Ticket
              </DialogTitle>
              <DialogDescription>
                Create a new support ticket with the details below. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Ticket Title *
                </Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue and steps to reproduce"
                  rows={5}
                  required
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority Level *
                </Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as TicketPriority })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW" className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">LOW</Badge>
                      Low Priority
                    </SelectItem>
                    <SelectItem value="MEDIUM" className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">MEDIUM</Badge>
                      Medium Priority
                    </SelectItem>
                    <SelectItem value="HIGH" className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">HIGH</Badge>
                      High Priority
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTicketMutation.isPending}
                  className="h-11 gap-2"
                >
                  {createTicketMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            Overview of all support tickets in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                All <Badge variant="secondary">{ticketCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="gap-2">
                Open <Badge variant="secondary">{ticketCounts.open}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="gap-2">
                In Progress <Badge variant="secondary">{ticketCounts['in-progress']}</Badge>
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-2">
                Closed <Badge variant="secondary">{ticketCounts.closed}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {filteredTickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">#{ticket.id}</TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="space-y-1">
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {ticket.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(ticket.status)} className="gap-1">
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{ticket.createdBy.username}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(ticket.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(ticket.id, 'OPEN')}
                                disabled={ticket.status === 'OPEN'}
                              >
                                Mark as Open
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')}
                                disabled={ticket.status === 'IN_PROGRESS'}
                              >
                                Mark as In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(ticket.id, 'CLOSED')}
                                disabled={ticket.status === 'CLOSED'}
                              >
                                Mark as Closed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg font-medium">No tickets found</div>
                  <div className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search' : 'Create your first ticket to get started'}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;
