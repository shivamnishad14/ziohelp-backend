import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';

interface UsersTableProps {
  users?: any;
  isLoading: boolean;
  currentUser: any;
  userRole: string;
  onEdit: (user: any) => void;
  onRole: (user: any) => void;
  onToggleActive: (userId: number) => void;
  onApproveAdmin: (userId: number) => void;
  onRejectAdmin: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading, currentUser, userRole, onEdit, onRole, onToggleActive, onApproveAdmin, onRejectAdmin, onDelete }) => {
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
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (info: any) => (
        <div className="flex items-center gap-2">
          {(userRole === 'ADMIN' || userRole === 'TENANT_ADMIN') && (
            <>
              <Button size="sm" variant="outline" onClick={() => onEdit(info.row.original)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => onRole(info.row.original)}>
                Change Role
              </Button>
              <Button size="sm" variant="outline" onClick={() => onToggleActive(info.row.original.id)}>
                Toggle Active
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(info.row.original.id)}>
                Delete
              </Button>
              <Button size="sm" variant="outline" onClick={() => onApproveAdmin(info.row.original.id)}>
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => onRejectAdmin(info.row.original.id)}>
                Reject
              </Button>
            </>
          )}
        </div>
      ),
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

export default UsersTable;
