import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import UsersTable from '@/components/admin/users/UsersTable';
import { useUsers } from '@/hooks/api/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminUsersPage() {
  const { data: users, isLoading, refetch } = useUsers();
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const userRole = userRoles[0] || 'USER';

  const handleEdit = (user: any) => {
    console.log('Edit user:', user);
    // TODO: Implement user edit functionality
  };

  const handleRole = (user: any) => {
    console.log('Change role for user:', user);
    // TODO: Implement role change functionality
  };

  const handleToggleActive = (userId: number) => {
    console.log('Toggle active for user:', userId);
    // TODO: Implement toggle active functionality
    refetch();
  };

  const handleApproveAdmin = (userId: number) => {
    console.log('Approve admin for user:', userId);
    // TODO: Implement approve admin functionality
    refetch();
  };

  const handleRejectAdmin = (userId: number) => {
    console.log('Reject admin for user:', userId);
    // TODO: Implement reject admin functionality
    refetch();
  };

  const handleDelete = (userId: number) => {
    console.log('Delete user:', userId);
    // TODO: Implement delete user functionality
    refetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable
              users={users}
              isLoading={isLoading}
              currentUser={currentUser}
              userRole={userRole}
              onEdit={handleEdit}
              onRole={handleRole}
              onToggleActive={handleToggleActive}
              onApproveAdmin={handleApproveAdmin}
              onRejectAdmin={handleRejectAdmin}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
