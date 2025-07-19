import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { roleAPI } from '@/services/api';
import { Role } from '@/types';
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable } from '@/components/ui/DataTable';

interface RoleManagementProps {
  className?: string;
}

export default function RoleManagement({ className }: RoleManagementProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null); // For debugging

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, [currentPage, pageSize, searchQuery, filterStatus]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await roleAPI.getAll({
        page: currentPage,
        size: pageSize,
        sort: 'name,asc',
      });
      console.log('API response:', response.data); // Debug log
      setLastApiResponse(response.data); // Save for debugging
      // Fix: roles are in response.data.data.content
      const apiData = response.data.data ? response.data.data : response.data;
      const content = apiData.content || [];
      setRoles(content);
      setTotalPages(apiData.totalPages || 0);
      setTotalElements(apiData.totalElements || 0);
    } catch (error: any) {
      setApiError(error.response?.data?.message || error.message || 'Unknown error');
      toast.error('Failed to load roles: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      // Validate form
      const errors: Record<string, string> = {};
      if (!formData.name.trim()) {
        errors.name = 'Role name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Role name must be at least 2 characters';
      } else if (formData.name.length > 50) {
        errors.name = 'Role name must be less than 50 characters';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      await roleAPI.create(formData);
      toast.success('Role created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      loadRoles();
    } catch (error: any) {
      toast.error('Failed to create role: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      // Validate form
      const errors: Record<string, string> = {};
      if (!formData.name.trim()) {
        errors.name = 'Role name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Role name must be at least 2 characters';
      } else if (formData.name.length > 50) {
        errors.name = 'Role name must be less than 50 characters';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      await roleAPI.update(editingRole.id, formData);
      toast.success('Role updated successfully');
      setIsEditDialogOpen(false);
      setEditingRole(null);
      resetForm();
      loadRoles();
    } catch (error: any) {
      toast.error('Failed to update role: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;

    try {
      await roleAPI.delete(deletingRole.id);
      toast.success('Role deleted successfully');
      setDeletingRole(null);
      loadRoles();
    } catch (error: any) {
      toast.error('Failed to delete role: ' + (error.response?.data?.message || error.message));
    }
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setFormErrors({});
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'with-users' && role.userCount > 0) ||
      (filterStatus === 'no-users' && role.userCount === 0);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // DataTable columns
  const columns = [
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: (info: any) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'userCount',
      header: 'Users',
      cell: (info: any) => (
        <Badge variant={info.row.original.userCount > 0 ? 'default' : 'secondary'}>
          {info.row.original.userCount} {info.row.original.userCount === 1 ? 'user' : 'users'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info: any) => info.row.original.createdAt ? formatDate(info.row.original.createdAt) : '-',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: (info: any) => info.row.original.updatedAt ? formatDate(info.row.original.updatedAt) : '-',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground tracking-tight">
            Manage user roles and permissions across the system
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" /> 
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role for users. Role names must be unique.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter role name"
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="createdAt">Created At</Label>
                {/* <Input
                  id="createdAt"
                  value={formData.createdAt ? formatDate(formData.createdAt) : '-'}
                  readOnly
                  disabled
                /> */}
              </div>
              <div>
                <Label htmlFor="updatedAt">Updated At</Label>
                {/* <Input
                  id="updatedAt"
                  value={formData.updatedAt ? formatDate(formData.updatedAt) : '-'}
                  readOnly
                  disabled
                /> */}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Roles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by role name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="filter">Filter by Users</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="with-users">With Users</SelectItem>
                  <SelectItem value="no-users">No Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            {totalElements} total roles • {filteredRoles.length} showing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : apiError ? (
            <div className="text-center text-red-500 py-8">
              Failed to load roles: {apiError}
              {lastApiResponse && (
                <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(lastApiResponse, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <DataTable
              data={filteredRoles}
              columns={columns}
              isLoading={loading}
              onEditClick={openEditDialog}
              onDeleteClick={(role) => setDeletingRole(role)}
              showEdit={true}
              showDelete={true}
              showActions={true}
              page={currentPage + 1}
              totalPages={totalPages}
              setPage={(p) => setCurrentPage(p - 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={setPageSize}
              pagination={true}
              showPagination={true}
              totalCount={totalElements}
              searchColumn="name"
              searchPlaceholder="Search by role name..."
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} roles
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role name. This will affect all users with this role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role name"
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>
            {/* <div>
              <Label htmlFor="edit-createdAt">Created At</Label>
              <Input
                id="edit-createdAt"
                value={formData.createdAt ? formatDate(formData.createdAt) : '-'}
                readOnly
                disabled
              />
            </div> */}
            {/* <div>
              <Label htmlFor="edit-updatedAt">Updated At</Label>
              <Input
                id="edit-updatedAt"
                value={formData.updatedAt ? formatDate(formData.updatedAt) : '-'}
                readOnly
                disabled
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingRole}
        onOpenChange={() => setDeletingRole(null)}
        title="Delete Role"
        desc={`Are you sure you want to delete the role "${deletingRole?.name}"? This action cannot be undone.`}
        handleConfirm={handleDeleteRole}
        confirmText="Delete"
        destructive={true}
      />
    </div>
  );
} 