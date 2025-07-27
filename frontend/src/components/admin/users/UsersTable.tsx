// import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';

interface User {
  id: number;
  fullName: string;
  email: string;
  roles: Array<{ name: string }>;
  active: boolean;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: {
    name: string;
  };
  avatarUrl?: string;
}

interface UsersTableProps {
  users?: {
    content?: User[];
  } | User[];
  isLoading: boolean;
  currentUser: any;
  userRole: string;
  onEdit: (user: User) => void;
  onRole: (user: User) => void;
  onToggleActive: (userId: number) => void;
  onApproveAdmin: (userId: number) => void;
  onRejectAdmin: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  isLoading, 
  currentUser, 
  userRole, 
  onEdit, 
  onRole, 
  onToggleActive, 
  onApproveAdmin, 
  onRejectAdmin, 
  onDelete 
}) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DEVELOPER': return 'default';
      case 'USER': return 'outline';
      case 'TENANT_ADMIN': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (isActive: boolean, isApproved: boolean) => {
    if (!isActive) return 'destructive';
    if (!isApproved) return 'secondary';
    return 'default';
  };

  const getStatusText = (isActive: boolean, isApproved: boolean) => {
    if (!isActive) return 'Inactive';
    if (!isApproved) return 'Pending';
    return 'Active';
  };

  const columns = [
    {
      accessorKey: 'user',
      header: 'User',
      cell: (info: any) => {
        const user = info.row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.fullName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.fullName}</p>
              <p className="text-sm text-muted-foreground">#{user.id}</p>
            </div>
          </div>
        );
      },
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      cell: (info: any) => (
        <span className="text-sm">{info.row.original.email}</span>
      ),
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: (info: any) => {
        const user = info.row.original;
        const roles = user.roles || [];
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.map((role: any, index: number) => (
              <Badge key={index} variant={getRoleBadgeVariant(role.name || role)}>
                {role.name || role}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info: any) => {
        const user = info.row.original;
        return (
          <Badge variant={getStatusBadgeVariant(user.active, user.approved)}>
            {getStatusText(user.active, user.approved)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: (info: any) => {
        const user = info.row.original;
        return (
          <Switch
            checked={user.active}
            onCheckedChange={() => onToggleActive(user.id)}
            disabled={user.id === currentUser?.id}
          />
        );
      },
    },
    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: (info: any) => {
        const user = info.row.original;
        return user.organization?.name || '-';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info: any) => {
        const user = info.row.original;
        return user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : '-';
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (info: any) => {
        const user = info.row.original;
        const isCurrentUser = user.id === currentUser?.id;
        
        return (
          <div className="flex items-center gap-2">
            {(userRole === 'ADMIN' || userRole === 'TENANT_ADMIN') && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onRole(user)}
                  disabled={isCurrentUser}
                >
                  Roles
                </Button>
                {!user.approved && (
                  <>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => onApproveAdmin(user.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onRejectAdmin(user.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDelete(user.id)}
                  disabled={isCurrentUser}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Normalize users data
  const userData = Array.isArray(users) ? users : (users?.content || []);

  return (
    <DataTable
      data={userData}
      columns={columns}
      isLoading={isLoading}
      pagination={true}
      showPagination={true}
      page={1}
      totalPages={1}
      setPage={() => {}}
      rowsPerPage={10}
      onRowsPerPageChange={() => {}}
      searchColumn="fullName"
      searchPlaceholder="Search by user name..."
    />
  );
};

export default UsersTable;
