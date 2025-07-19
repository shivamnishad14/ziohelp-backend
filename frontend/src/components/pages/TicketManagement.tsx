import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useListTickets, 
  useGetTicket, 
  useCreateTicket, 
  useUpdateTicket, 
  useDeleteTicket,
  useAssignTicket,
  useUpdateTicketStatus,
  useResolveTicket,
  useApproveTicket,
  useRejectTicketResolution,
  useAddTicketComment,
  useGetTicketComments,
  useSearchTickets,
  useCountTickets,
  useTicketsByAssignee,
  useTicketsByUser,
  usePendingApprovalTickets,  
  usePublicCreateTicket
} from '@/hooks/api/useTickets';
import { useListUsers } from '@/hooks/api/useUsers';
import { useListProducts } from '@/hooks/api/useProducts';
import { useAuth } from '@/hooks/api/useAuth';

interface TicketFormData {
  subject: string;
  description: string;
  priority: string;
  category: string;
  productId: number;
}

const TicketManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Remove selectedProduct if not needed for ticket queries
  // const [selectedProduct, setSelectedProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  // Queries
  const { data: ticketsData, isLoading } = useListTickets({
    page: currentPage,
    size: pageSize,
    status: statusFilter,
    search: searchQuery,
    sortBy,
    sortDir
  });
  const tickets = ticketsData?.content || [];
  const totalPages = ticketsData?.totalPages || 1;
  const totalElements = ticketsData?.totalElements || 0;
  const { data: users } = useListUsers({ productId: 1, page: 1, size: 100 }); // Assuming productId is always 1
  const userList = Array.isArray(users) ? users : users?.content || [];

  const { data: searchResults } = useSearchTickets({
    productId: 1, // Assuming productId is always 1 for now, or pass it as a prop if needed
    query: searchQuery,
    status: statusFilter,
    page: currentPage,
    size: pageSize
  });

  const { data: ticketCount } = useCountTickets({
    productId: 1, // Assuming productId is always 1 for now
    status: statusFilter
  });
  const { data: pendingApprovals } = usePendingApprovalTickets();
  const { data: products } = useListProducts();

  // Mutations
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const assignTicket = useAssignTicket();
  const updateStatus = useUpdateTicketStatus();
  const resolveTicket = useResolveTicket();
  const approveTicket = useApproveTicket();
  const rejectResolution = useRejectTicketResolution();
  const addComment = useAddTicketComment();

  // Form state
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    productId: 1 // Assuming productId is always 1 for now
  });

  const [assignData, setAssignData] = useState({
    assignedToId: 0,
    managerId: user?.id || 0
  });

  const [resolveData, setResolveData] = useState({
    resolution: ''
  });

  const [commentData, setCommentData] = useState({
    content: ''
  });

  // Handlers
  const handleCreateTicket = async () => {
    try {
      await createTicket.mutateAsync(formData);
      toast("Ticket created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
        productId: 1 // Assuming productId is always 1 for now
      });
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to create tickets.");
      } else {
        toast("Failed to create ticket");
      }
    }
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    try {
      await updateTicket.mutateAsync({
        ticketId: selectedTicket.id,
        ticket: formData
      });
      toast("Ticket updated successfully");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to update tickets.");
      } else {
        toast("Failed to update ticket");
      }
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket) return;
    try {
      await assignTicket.mutateAsync({
        ticketId: selectedTicket.id,
        assignedToId: assignData.assignedToId,
        managerId: assignData.managerId
      });
      toast("Ticket assigned successfully");
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to assign tickets.");
      } else {
        toast("Failed to assign ticket");
      }
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;
    try {
      await resolveTicket.mutateAsync({
        ticketId: selectedTicket.id,
        resolution: resolveData.resolution
      });
      toast("Ticket resolved successfully");
      setIsResolveDialogOpen(false);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to resolve tickets.");
      } else {
        toast("Failed to resolve ticket");
      }
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket) return;
    try {
      await addComment.mutateAsync({
        ticketId: selectedTicket.id,
        userId: user?.id || 0,
        content: commentData.content
      });
      toast("Comment added successfully");
      setIsCommentDialogOpen(false);
      setCommentData({ content: '' });
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to add comments.");
      } else {
        toast("Failed to add comment");
      }
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    try {
      await deleteTicket.mutateAsync(ticketId);
      toast("Ticket deleted successfully");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast("You are not authorized to delete tickets.");
      } else {
        toast("Failed to delete ticket");
      }
    }
  };

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'OPEN': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'RESOLVED': return 'outline';
      case 'CLOSED': return 'outline';
      default: return 'outline';
    }
  }

  function getPriorityBadgeVariant(priority: string) {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  }

  const displayTickets = searchQuery || statusFilter ? searchResults : tickets;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
          <p className="text-muted-foreground">
            Manage and track support tickets
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Ticket
        </Button>
      </div>

      <Separator />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Product</Label>
              <Select value={"1"} onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products?.content?.filter((product: any) => product.id && product.id !== '').map((product: any) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="assigned">My Assigned</TabsTrigger>
          <TabsTrigger value="my">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TicketsTable 
            tickets={displayTickets}
            isLoading={isLoading}
            onEdit={(ticket) => {
              setSelectedTicket(ticket);
              setFormData({
                subject: ticket.subject,
                description: ticket.description,
                priority: ticket.priority,
                category: ticket.category,
                productId: ticket.productId
              });
              setIsEditDialogOpen(true);
            }}
            onAssign={(ticket) => {
              setSelectedTicket(ticket);
              setIsAssignDialogOpen(true);
            }}
            onResolve={(ticket) => {
              setSelectedTicket(ticket);
              setIsResolveDialogOpen(true);
            }}
            onComment={(ticket) => {
              setSelectedTicket(ticket);
              setIsCommentDialogOpen(true);
            }}
            onDelete={handleDeleteTicket}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <TicketsTable 
            tickets={pendingApprovals}
            isLoading={false}
            onEdit={() => {}}
            onAssign={() => {}}
            onResolve={() => {}}
            onComment={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <TicketsTable 
            tickets={[]} // TODO: Implement assigned tickets
            isLoading={false}
            onEdit={() => {}}
            onAssign={() => {}}
            onResolve={() => {}}
            onComment={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          <TicketsTable 
            tickets={[]} // TODO: Implement my tickets
            isLoading={false}
            onEdit={() => {}}
            onAssign={() => {}}
            onResolve={() => {}}
            onComment={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {displayTickets && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new support ticket.
            </DialogDescription>
          </DialogHeader>
          <TicketForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={createTicket.isPending}>
              {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Update the ticket details.
            </DialogDescription>
          </DialogHeader>
          <TicketForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket} disabled={updateTicket.isPending}>
              {updateTicket.isPending ? 'Updating...' : 'Update Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Ticket Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Assign To</Label>
              <Select value={assignData.assignedToId.toString()} onValueChange={(value) => setAssignData({ ...assignData, assignedToId: Number(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {userList.filter((user: any) => user.id && user.id !== '').map((user: any) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTicket} disabled={assignTicket.isPending}>
              {assignTicket.isPending ? 'Assigning...' : 'Assign Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Ticket Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Provide a resolution for this ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Resolution</Label>
              <Textarea
                placeholder="Describe the resolution..."
                value={resolveData.resolution}
                onChange={(e) => setResolveData({ ...resolveData, resolution: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveTicket} disabled={resolveTicket.isPending}>
              {resolveTicket.isPending ? 'Resolving...' : 'Resolve Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to this ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Comment</Label>
              <Textarea
                placeholder="Enter your comment..."
                value={commentData.content}
                onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment} disabled={addComment.isPending}>
              {addComment.isPending ? 'Adding...' : 'Add Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Ticket Form Component
const TicketForm: React.FC<{
  formData: TicketFormData;
  setFormData: (data: TicketFormData) => void;
  products?: any[];
}> = ({ formData, setFormData, products }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Subject</Label>
        <Input
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Enter ticket subject"
        />
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the issue..."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
              <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
              <SelectItem value="BUG_REPORT">Bug Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Product</Label>
        <Select value={formData.productId.toString()} onValueChange={(value) => setFormData({ ...formData, productId: Number(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {products?.filter((product: any) => product.id && product.id !== '').map((product: any) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Tickets Table Component
const TicketsTable: React.FC<{
  tickets?: any;
  isLoading: boolean;
  onEdit: (ticket: any) => void;
  onAssign: (ticket: any) => void;
  onResolve: (ticket: any) => void;
  onComment: (ticket: any) => void;
  onDelete: (ticketId: number) => void;
}> = ({ tickets, isLoading, onEdit, onAssign, onResolve, onComment, onDelete }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  function getStatusBadgeVariant(status: any): "default" | "secondary" | "outline" | "destructive" | null | undefined {
    switch (status) {
      case 'OPEN': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'RESOLVED': return 'outline';
      case 'CLOSED': return 'outline';
      default: return 'outline';
    }
  }

  function getPriorityBadgeVariant(priority: any): "default" | "secondary" | "outline" | "destructive" | null | undefined {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>
          {totalElements} tickets found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket: any) => (
              <TableRow key={ticket.id}>
                <TableCell>#{ticket.id}</TableCell>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{ticket.assignedTo.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(ticket)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onAssign(ticket)}>
                      Assign
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onResolve(ticket)}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onComment(ticket)}>
                      Comment
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(ticket.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TicketManagement; 