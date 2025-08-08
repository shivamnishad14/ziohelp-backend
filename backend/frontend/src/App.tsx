import {
  RouterProvider,
  createRouter,
  RootRoute,
  Route,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthProvider';
// import Dashboard from './features/dashboard/Dashboard';
import Tickets from './features/tickets/Tickets';
import Users from './features/users/Users';
import Menu from './features/menu/ImprovedMenu';
import Login from './features/auth/Login';
import { AppLayout } from './components/AppLayout';
import TailwindTest from './components/TailwindTest';
import ProductHelpCenter from './features/help/ProductHelpCenter';
import PublicHelpCenter from './features/help/PublicHelpCenter';
import Dashboard from './features/dashboard/Dashboard';
import { useAuth } from './features/auth/AuthProvider';
import { useRouter } from '@tanstack/react-router';

const queryClient = new QueryClient();

const rootRoute = new RootRoute({
  component: () => {
    const router = useRouter();
    const isLogin = router.state.location.pathname === '/login';
    const isTest = router.state.location.pathname === '/test';
    return (
      <div className="min-h-screen">
        {isLogin || isTest ? <Outlet /> : <AppLayout><Outlet /></AppLayout>}
      </div>
    );
  },
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const testRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: TailwindTest,
});

function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  
  return <>{children}</>;
}

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Protected>
      <Dashboard />
    </Protected>
  ),
});

const dashboardExplicitRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <Protected>
      <Dashboard />
    </Protected>
  ),
});

const ticketsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: () => (
    <Protected>
      <Tickets />
    </Protected>
  ),
});

const usersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => (
    <Protected>
      <Users />
    </Protected>
  ),
});

const menuRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: () => (
    <Protected>
      <Menu />
    </Protected>
  ),
});

const helpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: () => (
    <Protected>
      <ProductHelpCenter />
    </Protected>
  ),
});

const publicHelpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/public-help/$domain',
  component: () => {
    const { domain } = publicHelpRoute.useParams();
    return <PublicHelpCenter domain={domain} />;
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  testRoute,
  dashboardRoute,
  dashboardExplicitRoute,
  ticketsRoute,
  usersRoute,
  menuRoute,
  helpRoute,
  publicHelpRoute,
]);

const router = createRouter({ routeTree });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
