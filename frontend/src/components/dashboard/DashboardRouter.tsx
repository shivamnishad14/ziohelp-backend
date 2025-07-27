import React from 'react';
import { useAuth } from '@/context/auth-context';
import { AdminDashboard } from './admin/AdminDashboard';
import { DeveloperDashboard } from './developer/DeveloperDashboard';
import { TenantAdminDashboard } from './tenant-admin/TenantAdminDashboard';
import { UserDashboard } from './user/UserDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const DashboardRouter: React.FC = () => {
  const { user, hasAnyRole } = useAuth();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to access your dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  // Role-based dashboard routing
  if (hasAnyRole(['ADMIN', 'MASTER_ADMIN'])) {
    return <AdminDashboard />;
  }

  if (hasAnyRole(['TENANT_ADMIN'])) {
    return <TenantAdminDashboard />;
  }

  if (hasAnyRole(['DEVELOPER', 'AGENT'])) {
    return <DeveloperDashboard />;
  }

  if (hasAnyRole(['USER'])) {
    return <UserDashboard />;
  }

  // Fallback for users without specific roles
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Access Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Your account doesn't have a configured role for dashboard access.</p>
          <p className="text-sm text-muted-foreground">
            Please contact your administrator to assign appropriate roles to your account.
          </p>
          <div className="mt-4">
            <p className="text-sm">
              <strong>Current roles:</strong> {user.roles?.join(', ') || 'None'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
