import React from 'react';
import { useRBAC } from '@/context/rbac-context';
import { MenuItem } from '@/types/rbac';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface DynamicMenuProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  onMenuClick?: (menuItem: MenuItem) => void;
}

/**
 * Dynamically renders menu items based on user permissions
 */
export const DynamicMenu: React.FC<DynamicMenuProps> = ({
  className,
  orientation = 'vertical',
  showIcons = true,
  onMenuClick,
}) => {
  const { userMenus, canAccessMenu } = useRBAC();

  // Filter menus by permission and sort by sortOrder
  const accessibleMenus = userMenus
    .filter(menu => canAccessMenu(menu.path))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Group menus by category
  const menusByCategory = accessibleMenus.reduce((acc, menu) => {
    const category = menu.category || 'GENERAL';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(menu);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleMenuClick = (menuItem: MenuItem) => {
    if (onMenuClick) {
      onMenuClick(menuItem);
    }
  };

  const renderIcon = (iconName: string) => {
    // You can replace this with your preferred icon system
    const iconMap: Record<string, string> = {
      dashboard: '📊',
      users: '👥',
      roles: '🛡️',
      organizations: '🏢',
      tickets: '🎫',
      'knowledge-base': '📚',
      reports: '📈',
      settings: '⚙️',
      'audit-logs': '📋',
      book: '📖',
      'chart-bar': '📊',
      'file-text': '📄',
      shield: '🛡️',
      building: '🏢',
      ticket: '🎫',
    };
    return iconMap[iconName] || '📄';
  };

  const MenuLink: React.FC<{ menu: MenuItem }> = ({ menu }) => (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        'justify-start',
        orientation === 'horizontal' ? 'inline-flex' : 'w-full'
      )}
      onClick={() => handleMenuClick(menu)}
    >
      <Link to={menu.path} className="flex items-center gap-2">
        {showIcons && <span>{renderIcon(menu.icon)}</span>}
        <span>{menu.name}</span>
      </Link>
    </Button>
  );

  return (
    <nav
      className={cn(
        'space-y-2',
        orientation === 'horizontal' && 'flex space-y-0 space-x-2',
        className
      )}
    >
      {Object.entries(menusByCategory).map(([category, menus]) => (
        <div key={category} className="space-y-1">
          {Object.keys(menusByCategory).length > 1 && (
            <h3 className="text-sm font-medium text-muted-foreground px-2 py-1">
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </h3>
          )}
          <div
            className={cn(
              'space-y-1',
              orientation === 'horizontal' && 'flex space-y-0 space-x-1'
            )}
          >
            {menus.map((menu) => (
              <MenuLink key={menu.id} menu={menu} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

interface BreadcrumbProps {
  currentPath: string;
  className?: string;
}

/**
 * Dynamic breadcrumb based on current menu path
 */
export const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  className,
}) => {
  const { userMenus } = useRBAC();

  const currentMenu = userMenus.find(menu => menu.path === currentPath);
  const breadcrumbItems: MenuItem[] = [];

  if (currentMenu) {
    breadcrumbItems.push(currentMenu);
    
    // Build breadcrumb trail for nested menus
    let parentMenu = currentMenu.parentId 
      ? userMenus.find(menu => menu.id === currentMenu.parentId)
      : null;
    
    while (parentMenu) {
      breadcrumbItems.unshift(parentMenu);
      parentMenu = parentMenu.parentId 
        ? userMenus.find(menu => menu.id === parentMenu!.parentId)
        : null;
    }
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="text-muted-foreground">/</span>
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium">{item.name}</span>
          ) : (
            <Link
              to={item.path}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
