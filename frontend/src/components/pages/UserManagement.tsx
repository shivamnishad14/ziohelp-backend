import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useListUsers, 
  useGetUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useUpdateUserRole,
  useSearchUsers,
  useToggleActive,
  useApproveAdmin,
  useRejectAdmin,
  usePendingAdmins,
  useCountUsers,
  useListRoles,
  UserRole
} from '@/hooks/api/useUsers';
import { useListProducts } from '@/hooks/api/useProducts';
import { useAuth } from '@/hooks/api/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/DataTable';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string; // role name
  productId: number;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [showUserId, setShowUserId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Queries
  const isSearching = !!searchQuery || !!roleFilter;

  const { data: usersData, isLoading } = useListUsers({
    page: currentPage,
    size: pageSize,
    search: searchQuery,
    sortBy,
    sortDir
  });
  const users = usersData?.content || [];
  const totalPages = usersData?.totalPages || 1;
  const totalElements = usersData?.totalElements || 0;

  const { data: searchResults } = useSearchUsers({
    query: searchQuery,
    role: roleFilter === '' ? undefined : roleFilter,
    page: currentPage,
    size: pageSize
  });

  const { data: pendingAdmins } = usePendingAdmins();
  const { data: products } = useListProducts();
  const { data: totalUserCount } = useCountUsers();
  const { data: productUserCount } = useCountUsers(selectedProduct);
  const { data: roles } = useListRoles();
  const { data: userDetails } = useGetUser(showUserId as number, { enabled: !!showUserId });

  // For Super Admin role-based management tabs
  const { data: engineerUsers } = useListUsers({ productId: selectedProduct, page: currentPage, size: pageSize, role: 'ENGINEER' });
  const { data: adminUsers } = useListUsers({ productId: selectedProduct, page: currentPage, size: pageSize, role: 'ADMIN' });
  const { data: normalUsers } = useListUsers({ productId: selectedProduct, page: currentPage, size: pageSize, role: 'USER' });

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleActive();
  const approveAdmin = useApproveAdmin();
  const rejectAdmin = useRejectAdmin();

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    productId: selectedProduct
  });

  const [roleData, setRoleData] = useState({
    role: ''
  });

  // For displayUsers, always extract .content if present
  const paginatedUsers = users && 'content' in users ? users : undefined;
  const userArray = paginatedUsers ? paginatedUsers.content : Array.isArray(users) ? users : [];
  const displayUsers = isSearching
    ? (searchResults && 'content' in searchResults ? searchResults.content : Array.isArray(searchResults) ? searchResults : [])
    : userArray;
  const totalPages = (searchQuery || roleFilter)
    ? (searchResults && 'totalPages' in searchResults ? searchResults.totalPages : 1)
    : (paginatedUsers && 'totalPages' in paginatedUsers ? paginatedUsers.totalPages : 1);

  // Handlers
  const handleCreateUser = async () => {
    try {
      const roleObj = roles?.find((r: any) => r.name === formData.role);
      const payload = {
        name: formData.name,
        email: formData.email,
        passwordHash: formData.password, // or 'password' if backend expects plain
        roleId: roleObj?.id,
        productId: formData.productId,
        isActive: true
      };
      if (roleObj) {
        await createUser.mutateAsync({ productId: formData.productId, user: payload });
      }
      toast("User created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        productId: selectedProduct
      });
    } catch (error) {
      toast("Failed to create user");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await updateUser.mutateAsync({
        userId: selectedUser.id,
        user: { ...formData, role: formData.role as UserRole }
      });
      toast("User updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Failed to update user");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await updateRole.mutateAsync({
        userId: selectedUser.id,
        role: roleData.role as UserRole
      });
      toast("User role updated successfully");
      setIsRoleDialogOpen(false);
    } catch (error) {
      toast("Failed to update user role");
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      await toggleActive.mutateAsync(userId);
      toast("User status updated successfully");
    } catch (error) {
      toast("Failed to update user status");
    }
  };

  const handleApproveAdmin = async (userId: number) => {
    try {
      await approveAdmin.mutateAsync(userId);
      toast("Admin approved successfully");
    } catch (error) {
      toast("Failed to approve admin");
    }
  };

  const handleRejectAdmin = async (userId: number) => {
    try {
      await rejectAdmin.mutateAsync(userId);
      toast("Admin rejected successfully");
    } catch (error) {
      toast("Failed to reject admin");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser.mutateAsync(userId);
      toast("User deleted successfully");
    } catch (error) {
      toast("Failed to delete user");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DEVELOPER': return 'default';
      case 'USER': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  // Add type guards for totalUserCount and productUserCount
  const getTotalUsers = (countObj: any) => {
    if (typeof countObj === 'object' && countObj !== null && 'totalUsers' in countObj) {
      return (countObj as { totalUsers: number }).totalUsers;
    }
    return countObj ?? '...';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between tracking-tight">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and permissions
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            Total users (all): {getTotalUsers(totalUserCount)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Users in product: {getTotalUsers(productUserCount)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Roles: {Array.isArray(roles) ? roles.map((r: any) => r.name).join(', ') : '...'}
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New User
        </Button>
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Enter user ID to view details"
          value={showUserId ?? ''}
          onChange={e => setShowUserId(e.target.value ? Number(e.target.value) : null)}
          style={{ width: 200 }}
        />
        {userDetails && (
          <div className="text-sm text-muted-foreground">
            User: {userDetails.name} ({userDetails.email})
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchInput('');
                setRoleFilter('');
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
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="pending">Pending Admins</TabsTrigger>
          <TabsTrigger value="active">Active Users</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
          {currentUser?.role === 'ADMIN' && (
            <>
              <TabsTrigger value="engineers">Engineers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UsersTable 
            users={displayUsers}
            isLoading={isLoading}
            currentUser={currentUser}
            onEdit={(user) => {
              setSelectedUser(user);
              setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                productId: user.productId,
                password: user.password // Added missing property
              });
              setIsEditDialogOpen(true);
            }}
            onRole={(user) => {
              setSelectedUser(user);
              setRoleData({ role: user.role });
              setIsRoleDialogOpen(true);
            }}
            onToggleActive={handleToggleActive}
            onApproveAdmin={handleApproveAdmin}
            onRejectAdmin={handleRejectAdmin}
            onDelete={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <UsersTable 
            users={pendingAdmins}
            isLoading={false}
            currentUser={currentUser}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={handleApproveAdmin}
            onRejectAdmin={handleRejectAdmin}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <UsersTable 
            users={displayUsers.filter((u: any) => u.isActive)}
            isLoading={false}
            currentUser={currentUser}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={() => {}}
            onRejectAdmin={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <UsersTable 
            users={displayUsers.filter((u: any) => !u.isActive)}
            isLoading={false}
            currentUser={currentUser}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={() => {}}
            onRejectAdmin={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        {currentUser?.role === 'ADMIN' && (
          <>
            <TabsContent value="engineers" className="space-y-4">
              <UsersTable
                users={engineerUsers && 'content' in engineerUsers ? engineerUsers.content : engineerUsers || []}
                isLoading={false}
                currentUser={currentUser}
                onEdit={() => {}}
                onRole={() => {}}
                onToggleActive={() => {}}
                onApproveAdmin={() => {}}
                onRejectAdmin={() => {}}
                onDelete={() => {}}
              />
            </TabsContent>
            <TabsContent value="admins" className="space-y-4">
              <UsersTable
                users={adminUsers && 'content' in adminUsers ? adminUsers.content : adminUsers || []}
                isLoading={false}
                currentUser={currentUser}
                onEdit={() => {}}
                onRole={() => {}}
                onToggleActive={() => {}}
                onApproveAdmin={() => {}}
                onRejectAdmin={() => {}}
                onDelete={() => {}}
              />
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <UsersTable
                users={normalUsers && 'content' in normalUsers ? normalUsers.content : normalUsers || []}
                isLoading={false}
                currentUser={currentUser}
                onEdit={() => {}}
                onRole={() => {}}
                onToggleActive={() => {}}
                onApproveAdmin={() => {}}
                onRejectAdmin={() => {}}
                onDelete={() => {}}
              />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Pagination */}
      {displayUsers && (
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

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
            roles={roles}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
            roles={roles}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the user's role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <Select value={roleData.role} onValueChange={(value) => setRoleData({ role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role: any) => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRole.isPending}>
              {updateRole.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// User Form Component
const UserForm: React.FC<{
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  products?: any[];
  roles?: any[];
}> = ({ formData, setFormData, products, roles }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter full name"
        />
      </div>
      
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>
      
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
        />
      </div>
      
      <div>
        <Label>Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles?.map((role: any) => (
              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Product</Label>
        <Select value={formData.productId.toString()} onValueChange={(value) => setFormData({ ...formData, productId: Number(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product: any) => (
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

// Users Table Component
const UsersTable: React.FC<{
  users?: any;
  isLoading: boolean;
  currentUser: any;
  onEdit: (user: any) => void;
  onRole: (user: any) => void;
  onToggleActive: (userId: number) => void;
  onApproveAdmin: (userId: number) => void;
  onRejectAdmin: (userId: number) => void;
  onDelete: (userId: number) => void;
}> = ({ users, isLoading, currentUser, onEdit, onRole, onToggleActive, onApproveAdmin, onRejectAdmin, onDelete }) => {
  // Permission helpers
  const canEdit = (user: any) => currentUser.role === 'ADMIN';
  const canDelete = (user: any) => currentUser.role === 'ADMIN';
  const canApprove = (user: any) => currentUser.role === 'ADMIN';
  const canChangeRole = (user: any) => currentUser.role === 'ADMIN';

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DEVELOPER': return 'default';
      case 'USER': return 'outline';
      default: return 'outline';
    }
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: (info: any) => (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
            <AvatarImage src={info.row.original.avatar} />
            <AvatarFallback>{info.row.original.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
            <p className="font-medium">{info.row.original.name}</p>
            <p className="text-sm text-muted-foreground">#{info.row.original.id}</p>
                    </div>
                  </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info: any) => (
        <Badge variant={getRoleBadgeVariant(info.row.original.role)}>
          {info.row.original.role}
                  </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info: any) => (
        <Badge variant={getStatusBadgeVariant(info.row.original.status)}>
          {info.row.original.status}
                  </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: (info: any) => (
                  <Switch
          checked={info.row.original.isActive}
          onCheckedChange={() => onToggleActive(info.row.original.id)}
                  />
      ),
    },
    {
      accessorKey: 'productName',
      header: 'Product',
      cell: (info: any) => info.row.original.productName || '-',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info: any) =>
        info.row.original.createdAt
          ? new Date(info.row.original.createdAt).toLocaleDateString()
          : '-',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: (info: any) =>
        info.row.original.updatedAt
          ? new Date(info.row.original.updatedAt).toLocaleDateString()
          : '-',
    },
  ];

  return (
    <DataTable
      data={users?.content || users || []}
      columns={columns}
      isLoading={isLoading}
      pagination={true}
      showPagination={true}
      page={1}
      totalPages={1}
      setPage={() => {}}
      rowsPerPage={10}
      onRowsPerPageChange={() => {}}
      searchColumn="name"
      searchPlaceholder="Search by user name..."
    />
  );
};

export default UserManagement; 