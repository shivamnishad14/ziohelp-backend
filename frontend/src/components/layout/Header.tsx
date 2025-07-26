import React, { useState } from 'react';
import { Menu, Bell, Search, LogOut, User, ChevronDown, HelpCircle, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { authAPI } from '@/services/API';
import { useNavigate, Link } from '@tanstack/react-router';
import { useNotification } from '../../context/notification-context';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  
  // Get current user from localStorage instead of API call
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };
  
  const currentUser = getCurrentUser();
  const userRole = localStorage.getItem('userRole');

  // Theme switcher logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search and Help Center */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Help Center Link */}
        <Link
          to="/help-center"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help Center</span>
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setIsDark(d => !d)}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen(o => !o)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-background rounded-md shadow-lg py-2 z-50 border border-border">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="font-semibold">Notifications</span>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false); }}>Mark all as read</button>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <div key={notif.id || notif.createdAt} className={`px-4 py-2 border-b border-border cursor-pointer hover:bg-muted ${!notif.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => { if (notif.id) markAsRead(notif.id); setNotifOpen(false); if (notif.url) window.location.href = notif.url; }}
                  >
                    <div className="font-medium text-sm">{notif.title}</div>
                    <div className="text-xs text-gray-600">{notif.body}</div>
                    <div className="text-xs text-gray-400 mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50 border border-border">
              <div className="px-4 py-2 text-sm text-foreground border-b border-border">
                <p className="font-medium">{currentUser?.name || 'User'}</p>
                <p className="text-gray-500">{userRole || 'USER'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 