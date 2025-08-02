import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Loader2, Users as UsersIcon, UserCheck, UserX, Mail, Building } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization?: string;
  active: boolean;
  createdAt: string;
}

const Users = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll(),
  });

  const users = usersResponse?.data;

  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => usersAPI.toggleActive(id),
    onMutate: ({ id }) => {
      setLoading(prev => ({ ...prev, [id]: true }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error toggling user status:', error);
    },
    onSettled: (_, __, { id }) => {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  });

  const handleToggleUserStatus = (userId: number) => {
    toggleUserStatusMutation.mutate({ id: userId });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'TENANT_ADMIN': return 'default';
      case 'DEVELOPER': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserX className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600">Error Loading Users</h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load users'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <UsersIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-4">
        {users?.map((user: User) => (
          <Card key={user.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>@{user.username}</span>
                      {user.organization && (
                        <>
                          <span>•</span>
                          <Building className="h-3 w-3" />
                          <span>{user.organization}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.active ? 'default' : 'secondary'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Status:
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => handleToggleUserStatus(user.id)}
                      disabled={loading[user.id]}
                    />
                    {loading[user.id] && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Users Found</h3>
          <p className="text-muted-foreground">There are no users to display.</p>
        </div>
      )}
    </div>
  );
};

export default Users;
