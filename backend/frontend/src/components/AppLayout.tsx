import { iconMap } from './iconMap';
import { getRoleBadgeVariant } from './getRoleBadgeVariant';
import React from 'react';
import { useMenuItems } from '@/hooks/useMenuItems';
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
// import { Toaster } from './ui/toaster'; // Unused
import type { MenuItem } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications] = React.useState(3); // Example notification count
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { data: menuItems, isLoading: menuIsLoading } = useMenuItems();

  const isAdmin = user?.role === 'ADMIN';

  const adminMenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'LayoutDashboard',
      isActive: true,
      sortOrder: 1,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Overview of system metrics',
      category: 'ADMIN',
    },
    {
      id: 2,
      name: 'User Management',
      path: '/admin/users',
      icon: 'Users',
      isActive: true,
      sortOrder: 2,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage users and roles',
      category: 'ADMIN',
    },
    {
      id: 3,
      name: 'System Settings',
      path: '/admin/settings',
      icon: 'Settings',
      isActive: true,
      sortOrder: 10,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Configure system parameters',
      category: 'ADMIN',
    },
    {
      id: 4,
      name: 'Menu Management',
      path: '/admin/menu',
      icon: 'MenuSquare',
      isActive: true,
      sortOrder: 11,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage navigation menus',
      category: 'ADMIN',
    },
    {
      id: 5,
      name: 'Reports',
      path: '/admin/reports',
      icon: 'LineChart',
      isActive: true,
      sortOrder: 20,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'View system reports',
      category: 'ADMIN',
    },
    {
      id: 6,
      name: 'Audit Logs',
      path: '/admin/audit-logs',
      icon: 'History',
      isActive: true,
      sortOrder: 21,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'View audit logs',
      category: 'ADMIN',
    },
    {
      id: 7,
      name: 'Products',
      path: '/admin/products',
      icon: 'Box',
      isActive: true,
      sortOrder: 30,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage products',
      category: 'ADMIN',
    },
    {
      id: 8,
      name: 'FAQ Management',
      path: '/admin/faq',
      icon: 'HelpCircle',
      isActive: true,
      sortOrder: 31,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage FAQs',
      category: 'ADMIN',
    },
    {
      id: 9,
      name: 'Article Management',
      path: '/admin/articles',
      icon: 'FileText',
      isActive: true,
      sortOrder: 32,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Manage knowledge base articles',
      category: 'ADMIN',
    },
  ];

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

  const displayedMenuItems = (isAdmin ? adminMenuItems : menuItems) || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar
          className={`sticky top-0 h-screen border-r bg-white shadow-sm flex flex-col justify-between transition-all duration-200 z-30 ${isCollapsed ? 'w-16 min-w-16' : 'w-64 min-w-64'}`}
        >
          <div>
            <SidebarHeader className="border-b p-4 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">ZioHelp</span>
                    <span className="text-xs text-muted-foreground">Support System</span>
                  </div>
                )}
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <SidebarMenu>
                {menuIsLoading ? (
                  <div className="text-xs text-muted-foreground px-2 py-1">Loading menu...</div>
                ) : (
                  <>
                    {/* Admin menu items are now included in staticAdminMenu */}
                    {displayedMenuItems.map((item) => {
                      const safeItem = { ...item, children: item.children ?? [] } as MenuItem;
                      const Icon = iconMap[safeItem.icon] || MenuIcon;
                      const menuUrl = safeItem.path;
                      const isActive = router.state.location.pathname === menuUrl;
                      return (
                        <SidebarMenuItem key={safeItem.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              console.log('Menu click:', safeItem);
                              if (menuUrl) handleNavigation(menuUrl);
                              else console.warn('No url/path for menu item', safeItem);
                            }}
                            className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-muted'
                            } ${isCollapsed ? 'justify-center px-2' : ''}`}
                            title={isCollapsed ? safeItem.name : undefined}
                          >
                            <Icon className="w-4 h-4" />
                            {!isCollapsed && <span>{safeItem.name}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </>
                )}
              </SidebarMenu>
            </SidebarContent>
          </div>
          <SidebarFooter className={`border-t p-4 bg-gray-50 flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full justify-between h-auto p-2 ${isCollapsed ? 'flex-col items-center gap-1' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {user?.fullName ? getUserInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium truncate max-w-[120px]">
                          {user?.fullName || 'User'}
                        </span>
                        <Badge 
                          variant={getRoleBadgeVariant(user?.role || 'USER') as 'default' | 'destructive' | 'outline' | 'secondary'}
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
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
