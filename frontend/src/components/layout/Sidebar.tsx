import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { 
  LogOut,
  UserCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '@/context/auth-context';
import { DynamicMenu } from '@/components/rbac';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

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
            <h1 className="text-xl font-bold text-foreground">ZioHelp</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {/* Dynamic Menu based on user permissions */}
            <DynamicMenu 
              orientation="vertical"
              showIcons={true}
              onMenuClick={handleMenuClick}
            />
            
            {/* Profile link for authenticated users */}
            {user && (
              <Link
                to="/profile"
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mt-4",
                  location.pathname === '/profile'
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleMenuClick}
              >
                <UserCheck
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    location.pathname === '/profile' 
                      ? "text-primary" 
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                Profile
              </Link>
            )}
          </nav>
          
          {/* User section */}
          {user && (
            <div className="border-t border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {user.roles && user.roles.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.roles.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="mt-3 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 