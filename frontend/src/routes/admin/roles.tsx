import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { RoleGuard } from '@/components/rbac';
import { RoleManagement } from '@/components/admin/roles';

export const Route = createFileRoute('/admin/roles')({
  component: () => (
    <RoleGuard allowedRoles={['ADMIN', 'MASTER_ADMIN']}>
      <AdminLayout>
        <RoleManagement />
      </AdminLayout>
    </RoleGuard>
  ),
});
