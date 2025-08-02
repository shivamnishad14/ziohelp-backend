import { RootRoute, Route, Outlet, createRoute } from '@tanstack/react-router';
import AdminPasswordReset from './features/auth/AdminPasswordReset';
import AdminDashboard from './features/dashboard/AdminDashboard';
import UserDashboard from './features/dashboard/UserDashboard';
import DeveloperDashboard from './features/dashboard/DeveloperDashboard';
import TenantDashboard from './features/dashboard/TenantDashboard';
import UsersManagement from './features/users/UsersManagement';
import Menu from './features/menu/Menu';

export const adminMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menu',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <Menu />
    </Protected>
  ),
});
import HelpCenter from './features/help/HelpCenter';
import CommentsPage from './features/developer/CommentsPage';
import NotFound from './components/NotFound';
import AppLayout from './components/AppLayout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { useAuth } from './features/auth/AuthProvider';

// Protected Route Wrapper
function Protected({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }
  return <AppLayout>{children}</AppLayout>;
}

// Public Route Wrapper (for login)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (user) {
    // Redirect based on user role
    switch (user.role) {
      case 'ADMIN':
        window.location.href = '/admin/dashboard';
        break;
      case 'TENANT_ADMIN':
        window.location.href = '/tenant/dashboard';
        break;
      case 'DEVELOPER':
        window.location.href = '/dev/dashboard';
        break;
      case 'USER':
        window.location.href = '/user/dashboard';
        break;
      default:
        window.location.href = '/dashboard';
    }
    return null;
  }

  return <>{children}</>;
}

const rootRoute = new RootRoute({
  component: () => <Outlet />,
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <PublicRoute>
      <Login />
    </PublicRoute>
  ),
});

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <PublicRoute>
      <Register />
    </PublicRoute>
  ),
});

export const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: () => <AdminPasswordReset />,
});

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { user } = useAuth();
    
    if (!user) {
      window.location.href = '/login';
      return null;
    }
    
    // Redirect to role-specific dashboard
    switch (user.role) {
      case 'ADMIN':
        window.location.href = '/admin/dashboard';
        break;
      case 'TENANT_ADMIN':
        window.location.href = '/tenant/dashboard';
        break;
      case 'DEVELOPER':
        window.location.href = '/dev/dashboard';
        break;
      case 'USER':
        window.location.href = '/user/dashboard';
        break;
      default:
        window.location.href = '/user/dashboard';
    }
    return null;
  },
});

// Admin routes
export const adminDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </Protected>
  ),
});

export const adminUsersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <UsersManagement />
    </Protected>
  ),
});

export const adminTicketsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/tickets',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Tickets - Coming Soon</div>
    </Protected>
  ),
});

export const adminSettingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Settings - Coming Soon</div>
    </Protected>
  ),
});

export const adminApprovalsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/approvals',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Approvals - Coming Soon</div>
    </Protected>
  ),
});

export const adminAnalyticsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/analytics',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Analytics - Coming Soon</div>
    </Protected>
  ),
});

export const adminRolesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Roles & Permissions - Coming Soon</div>
    </Protected>
  ),
});

export const adminAssignRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/assign',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Assign Tickets - Coming Soon</div>
    </Protected>
  ),
});

export const adminFaqsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/faqs',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin FAQ/Articles - Coming Soon</div>
    </Protected>
  ),
});

export const adminEmailTemplatesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/email-templates',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Email Templates - Coming Soon</div>
    </Protected>
  ),
});

export const adminProductsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Products/Tenants - Coming Soon</div>
    </Protected>
  ),
});

export const adminApiLogsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/api-logs',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin API Logs - Coming Soon</div>
    </Protected>
  ),
});

export const adminAuditLogsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/audit-logs',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Audit Logs - Coming Soon</div>
    </Protected>
  ),
});

export const adminExportRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/export',
  component: () => (
    <Protected allowedRoles={['ADMIN']}>
      <div>Admin Export Data - Coming Soon</div>
    </Protected>
  ),
});

// User routes
export const userDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/user/dashboard',
  component: () => (
    <Protected allowedRoles={['USER']}>
      <UserDashboard />
    </Protected>
  ),
});

export const userTicketsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/user/tickets',
  component: () => (
    <Protected allowedRoles={['USER']}>
      <div>My Tickets - Coming Soon</div>
    </Protected>
  ),
});

export const userRaiseTicketRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/user/raise-ticket',
  component: () => (
    <Protected allowedRoles={['USER']}>
      <div>Raise Ticket - Coming Soon</div>
    </Protected>
  ),
});

// Developer routes
export const devDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dev/dashboard',
  component: () => (
    <Protected allowedRoles={['DEVELOPER']}>
      <DeveloperDashboard />
    </Protected>
  ),
});

export const devTicketsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dev/my-tickets',
  component: () => (
    <Protected allowedRoles={['DEVELOPER']}>
      <div>My Tickets - Coming Soon</div>
    </Protected>
  ),
});

export const devCommentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dev/comments',
  component: () => (
    <Protected allowedRoles={['DEVELOPER']}>
      <CommentsPage />
    </Protected>
  ),
});

export const devSlaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dev/sla',
  component: () => (
    <Protected allowedRoles={['DEVELOPER']}>
      <div>SLA Dashboard - Coming Soon</div>
    </Protected>
  ),
});

// Tenant Admin routes
export const tenantDashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/tenant/dashboard',
  component: () => (
    <Protected allowedRoles={['TENANT_ADMIN']}>
      <TenantDashboard />
    </Protected>
  ),
});

// Shared routes
export const helpCenterRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/help-center',
  component: () => (
    <Protected>
      <HelpCenter />
    </Protected>
  ),
});

export const faqsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/faqs',
  component: () => (
    <Protected>
      <HelpCenter />
    </Protected>
  ),
});

export const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <Protected>
      <div>Profile Settings - Coming Soon</div>
    </Protected>
  ),
});

export const chatbotRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/chatbot',
  component: () => (
    <Protected>
      <div>AI Chatbot - Coming Soon</div>
    </Protected>
  ),
});

// Legacy routes (backward compatibility)
export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => {
    const { user } = useAuth();
    
    if (!user) {
      window.location.href = '/login';
      return null;
    }
    
    // Redirect to role-specific dashboard
    switch (user.role) {
      case 'ADMIN':
        window.location.href = '/admin/dashboard';
        break;
      case 'TENANT_ADMIN':
        window.location.href = '/tenant/dashboard';
        break;
      case 'DEVELOPER':
        window.location.href = '/dev/dashboard';
        break;
      case 'USER':
        window.location.href = '/user/dashboard';
        break;
      default:
        window.location.href = '/user/dashboard';
    }
    return null;
  },
});

export const ticketsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: () => {
    const { user } = useAuth();
    
    if (!user) {
      window.location.href = '/login';
      return null;
    }
    
    // Redirect to role-specific tickets
    switch (user.role) {
      case 'ADMIN':
        window.location.href = '/admin/tickets';
        break;
      case 'USER':
        window.location.href = '/user/tickets';
        break;
      case 'DEVELOPER':
        window.location.href = '/dev/my-tickets';
        break;
      default:
        window.location.href = '/user/tickets';
    }
    return null;
  },
});

export const usersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => {
    const { user } = useAuth();
    
    if (user?.role === 'ADMIN') {
      window.location.href = '/admin/users';
      return null;
    }
    
    return <NotFound />;
  },
});

export const menuRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: () => (
    <Protected>
      <Menu />
    </Protected>
  ),
});

// 404 route
export const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  resetPasswordRoute,
  // Admin routes
  adminDashboardRoute,
  adminUsersRoute,
  adminTicketsRoute,
  adminSettingsRoute,
  adminApprovalsRoute,
  adminAnalyticsRoute,
  adminRolesRoute,
  adminAssignRoute,
  adminFaqsRoute,
  adminEmailTemplatesRoute,
  adminProductsRoute,
  adminApiLogsRoute,
  adminAuditLogsRoute,
  adminExportRoute,
  // adminMenuRoute, // <-- Removed duplicate
  // User routes
  userDashboardRoute,
  userTicketsRoute,
  userRaiseTicketRoute,
  // Developer routes
  devDashboardRoute,
  devTicketsRoute,
  devCommentsRoute,
  devSlaRoute,
  // Tenant routes
  tenantDashboardRoute,
  // Shared routes
  helpCenterRoute,
  faqsRoute,
  profileRoute,
  chatbotRoute,
  // Legacy routes
  dashboardRoute,
  ticketsRoute,
  usersRoute,
  menuRoute,
  // 404
  notFoundRoute,
]);
