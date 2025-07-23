import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Ticket, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3,
  LogOut,
  UserCheck,
  ClipboardList,
  FileText,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { authAPI } from '@/services/API';

type Role = 'ADMIN' | 'DEVELOPER' | 'USER' | 'GUEST' | 'TENANT_ADMIN';
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigationByRole: Record<Role, NavigationItem[]> = {
  ADMIN: [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'FAQ Management', href: '/admin/faq-kb', icon: BookOpen },
    { name: 'File Management', href: '/admin/files', icon: FileText },
    { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: BookOpen },
    { name: 'Product Management', href: '/admin/products', icon: Package },
    { name: 'Ticket Management', href: '/admin/tickets', icon: ClipboardList },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Role Management', href: '/admin/roles', icon: Shield },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  DEVELOPER: [
    { name: 'Developer Dashboard', href: '/developer/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Tickets', href: '/developer/tickets', icon: ClipboardList },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Help Center', href: '/help-center', icon: Ticket },
  ],
  USER: [
    { name: 'User Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tickets', href: '/tickets/my-tickets', icon: ClipboardList },
    { name: 'Help Center', href: '/help-center', icon: Ticket },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  ],
  GUEST: [
    { name: 'Raise Ticket', href: '/guest/raise-ticket', icon: Ticket },
    { name: 'Track Ticket', href: '/guest/ticket-status', icon: ClipboardList },
    { name: 'FAQ', href: '/faq', icon: BookOpen },
  ],
  TENANT_ADMIN: [
    { name: 'Tenant Admin Dashboard', href: '/tenant/dashboard', icon: LayoutDashboard },
    { name: 'Tenant Tickets', href: '/tenant/tickets', icon: ClipboardList },
    { name: 'Tenant Users', href: '/tenant/users', icon: Users },
    { name: 'Tenant FAQ', href: '/tenant/faq', icon: BookOpen },
    { name: 'Knowledge Base', href: '/tenant/knowledge-base', icon: BookOpen },
    { name: 'Settings', href: '/tenant/settings', icon: Settings },
  ],
};

function getNavigation(): NavigationItem[] {
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  let nav: NavigationItem[] = [];
  if (userRoles.length === 0) {
    nav = navigationByRole['USER'];
  } else {
    // Merge and deduplicate menu items for all roles
    const seen = new Set();
    userRoles.forEach((role: Role) => {
      (navigationByRole[role] || []).forEach((item) => {
        const key = item.name + item.href;
        if (!seen.has(key)) {
          nav.push(item);
          seen.add(key);
        }
      });
    });
  }
  // Add Profile link for all roles except GUEST
  if (!userRoles.includes('GUEST')) {
    nav.push({ name: 'Profile', href: '/profile', icon: UserCheck });
  }
  return nav;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  // User section
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : { name: 'User', email: 'user@example.com' };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform bg-background shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-border px-4">
            <h1 className="text-xl font-bold text-foreground">HelpDesk Admin</h1>
          </div>
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {getNavigation().map((item: NavigationItem) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">{(user.name && user.name.charAt(0).toUpperCase()) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button className="mt-3 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 