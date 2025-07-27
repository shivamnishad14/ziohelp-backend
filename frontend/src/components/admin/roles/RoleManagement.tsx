import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { RoleExtended } from '@/types/rbac';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Plus, Search, Edit, Trash2, Users, Shield } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac';
import { RoleForm } from './RoleForm';
import { useToast } from '@/hooks/use-toast';
import { ColumnDef } from '@tanstack/react-table';

interface RoleManagementProps {
  onRoleSelect?: (role: RoleExtended) => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ onRoleSelect }) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleExtended | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleExtended | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['roles', page, search],
    queryFn: () => rbacService.getRoles({ page, size: 10, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: rbacService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
      setDeletingRole(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete role',
        variant: 'destructive',
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      rbacService.updateRole(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Success',
        description: 'Role status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role status',
        variant: 'destructive',
      });
    },
  });

  const columns: ColumnDef<RoleExtended>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.description && (
              <div className="text-sm text-muted-foreground">
                {row.original.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'isSystem',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.isSystem ? 'default' : 'secondary'}>
          {row.original.isSystem ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      accessorKey: 'userCount',
      header: 'Users',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.userCount || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <PermissionGuard resource="ROLE" action="WRITE">
            <Switch
              checked={row.original.isActive}
              onCheckedChange={(checked) =>
                toggleActiveMutation.mutate({
                  id: row.original.id,
                  isActive: checked,
                })
              }
              disabled={row.original.isSystem}
            />
          </PermissionGuard>
          <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onRoleSelect?.(row.original)}
            >
              <Shield className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <PermissionGuard resource="ROLE" action="WRITE">
              <DropdownMenuItem
                onClick={() => setEditingRole(row.original)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard resource="ROLE" action="DELETE">
              <DropdownMenuItem
                onClick={() => setDeletingRole(row.original)}
                disabled={row.original.isSystem}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    queryClient.invalidateQueries({ queryKey: ['roles'] });
    toast({
      title: 'Success',
      description: 'Role created successfully',
    });
  };

  const handleEditSuccess = () => {
    setEditingRole(null);
    queryClient.invalidateQueries({ queryKey: ['roles'] });
    toast({
      title: 'Success',
      description: 'Role updated successfully',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <PermissionGuard resource="ROLE" action="WRITE">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role and assign permissions.
                </DialogDescription>
              </DialogHeader>
              <RoleForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={rolesData?.content || []}
        pageCount={rolesData?.totalPages || 0}
        pageIndex={page}
        pageSize={10}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No roles found"
      />

      {/* Edit Dialog */}
      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role details and permissions.
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              role={editingRole}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingRole(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deletingRole && (
        <AlertDialog open={!!deletingRole} onOpenChange={() => setDeletingRole(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the role "{deletingRole.name}"?
                This action cannot be undone and will remove all associated permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(deletingRole.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
