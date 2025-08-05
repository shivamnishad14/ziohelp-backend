import { useState } from 'react';
import { useMenuItems, useAdminMenuItems } from '@/hooks/useMenuItems';
import type { MenuItem as ApiMenuItem } from '@/hooks/useMenuItems';
import { useAuth } from '@/features/auth/AuthProvider';
import { useRouter } from '@tanstack/react-router';
import { Button } from './ui/button';
// import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from './ui/sidebar';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Menu as MenuIcon, 
  Settings, 
  LogOut, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Shield,
  Bell,
  Search
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications] = useState(3); // Example notification count
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Use admin menu for admin, else user menu

  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  // Static menu for admin
  const staticAdminMenu: ApiMenuItem[] = [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'Dashboard',
      isActive: true,
      sortOrder: 1,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Admin dashboard',
      category: 'ADMIN',
      url: '/admin/dashboard',
    },
    {
      id: 2,
      name: 'Users',
      icon: 'Users',
      isActive: true,
      sortOrder: 2,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'User management',
      category: 'ADMIN',
      url: '/admin/users',
    },
    {
      id: 3,
      name: 'Settings',
      icon: 'Settings',
      isActive: true,
      sortOrder: 3,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'System settings',
      category: 'ADMIN',
      url: '/admin/settings',
    },
    {
      id: 4,
      name: 'Menu Management',
      icon: 'Menu',
      isActive: true,
      sortOrder: 4,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage menu items',
      category: 'ADMIN',
      url: '/admin/menu',
    },
     {
    id: 5,
    name: 'Reports',
    icon: 'Ticket', // Use any icon from iconMap or add new mapping
    isActive: true,
    sortOrder: 5,
    parentId: null,
    children: [],
    roles: ['ADMIN'],
    description: 'View system reports',
    category: 'ADMIN',
    url: '/admin/reports',
  },
   {
    id: 6,
    name: 'Audit Logs',
    icon: 'Settings', // Use any icon from iconMap or add new mapping
    isActive: true,
    sortOrder: 6,
    parentId: null,
    children: [],
    roles: ['ADMIN'],
    description: 'System audit logs',
    category: 'ADMIN',
    url: '/admin/audit-logs',
  },
  {
    id: 7,
    name: 'Product',
    icon: 'Box',
    isActive: true,
    sortOrder: 7,
    parentId: null,
    children: [],
    roles: ['ADMIN'],
    description: 'Manage products',
    category: 'ADMIN',
    url: '/admin/products',
  },
  {
    id: 8,
    name: 'FAQ',
    icon: 'Menu',
    isActive: true,
    sortOrder: 8,
    parentId: null,
    children: [],
    roles: ['ADMIN'],
    description: 'Manage FAQs for products',
    category: 'ADMIN',
    url: '/admin/faq',
  },
  {
    id: 9,
    name: 'Article',
    icon: 'Ticket',
    isActive: true,
    sortOrder: 9,
    parentId: null,
    children: [],
    roles: ['ADMIN'],
    description: 'Manage articles for products',
    category: 'ADMIN',
    url: '/admin/articles',
  },
  ];

  const { data: userMenuItems, isLoading: userMenuLoading } = useMenuItems();
  const menuItems = isAdmin ? staticAdminMenu : userMenuItems;
  const menuLoading = isAdmin ? false : userMenuLoading;

  // Map backend icon string to Lucide icon component
  const iconMap: Record<string, any> = {
    Dashboard: LayoutDashboard,
    Ticket: Ticket,
    Users: Users,
    Menu: MenuIcon,
    Settings: Settings,
    Box: MenuIcon, // You can replace MenuIcon with a custom icon if you import one
    // Add more mappings as needed
  };

  // Filter menu items by user role (if backend provides roles)
  const filteredMenuItems = (menuItems || []).filter(item => {
    if (isAdmin) return true;
    return user?.role && (!item.roles || item.roles.includes(user.role));
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'TENANT_ADMIN':
        return 'default';
      case 'DEVELOPER':
        return 'secondary';
      case 'USER':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleNavigation = (path: string) => {
    router.navigate({ to: path });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar
          className={`sticky top-0 h-screen border-r bg-white shadow-sm flex flex-col justify-between transition-all duration-200 z-30 ${sidebarCollapsed ? 'w-16 min-w-16' : 'w-64 min-w-64'}`}
        >
          <div>
            <SidebarHeader className="border-b p-4 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">ZioHelp</span>
                    <span className="text-xs text-muted-foreground">Support System</span>
                  </div>
                )}
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <SidebarMenu>
                {menuLoading ? (
                  <div className="text-xs text-muted-foreground px-2 py-1">Loading menu...</div>
                ) : (
                  <>
                    {/* Admin menu items are now included in staticAdminMenu */}
                    {filteredMenuItems.map((item: ApiMenuItem) => {
                      const Icon = iconMap[item.icon] || MenuIcon;
                      // Support both 'url' and 'path' property for menu item
                      const menuUrl = item.url || item.path;
                      const isActive = router.state.location.pathname === menuUrl;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              console.log('Menu click:', item);
                              if (menuUrl) handleNavigation(menuUrl);
                              else console.warn('No url/path for menu item', item);
                            }}
                            className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-muted'
                            } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                            title={sidebarCollapsed ? item.name : undefined}
                          >
                            <Icon className="w-4 h-4" />
                            {!sidebarCollapsed && <span>{item.name}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </>
                )}
              </SidebarMenu>
            </SidebarContent>
          </div>
          <SidebarFooter className={`border-t p-4 bg-gray-50 flex flex-col gap-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full justify-between h-auto p-2 ${sidebarCollapsed ? 'flex-col items-center gap-1' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {user?.fullName ? getUserInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {!sidebarCollapsed && (
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium truncate max-w-[120px]">
                          {user?.fullName || 'User'}
                        </span>
                        <Badge 
                          variant={getRoleBadgeVariant(user?.role || 'USER')}
                          className="text-xs h-4"
                        >
                          {user?.role || 'USER'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="top">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Collapse/Expand button at bottom */}
            <button
              type="button"
              className="mt-2 md:inline-flex items-center justify-center w-8 h-8 rounded hover:bg-muted transition"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </SidebarFooter>
        </Sidebar>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="flex h-16 items-center px-8 gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1 flex items-center gap-4">
                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </header>
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
