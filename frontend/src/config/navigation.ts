import { MenuItem } from '@/types/rbac';

// Static navigation configuration for development/fallback
export const staticNavigation: Record<string, MenuItem[]> = {
  ADMIN: [
    {
      id: 1,
      name: 'Dashboard',
      path: '/admin',
      icon: '📊',
      description: 'Admin overview',
      sortOrder: 1,
      isActive: true,
      category: 'ADMIN',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 2,
      name: 'User Management',
      path: '/admin/users',
      icon: '👥',
      description: 'Manage users',
      sortOrder: 2,
      isActive: true,
      category: 'ADMIN',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 3,
      name: 'Role Management',
      path: '/admin/roles',
      icon: '🛡️',
      description: 'Manage roles',
      sortOrder: 3,
      isActive: true,
      category: 'ADMIN',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 4,
      name: 'Organizations',
      path: '/admin/organizations',
      icon: '🏢',
      description: 'Manage organizations',
      sortOrder: 4,
      isActive: true,
      category: 'ADMIN',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 5,
      name: 'System Settings',
      path: '/admin/settings',
      icon: '⚙️',
      description: 'System configuration',
      sortOrder: 5,
      isActive: true,
      category: 'ADMIN',
      createdAt: '',
      updatedAt: ''
    }
  ],
  TENANT_ADMIN: [
    {
      id: 10,
      name: 'Dashboard',
      path: '/tenant',
      icon: '📊',
      description: 'Tenant overview',
      sortOrder: 1,
      isActive: true,
      category: 'TENANT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 11,
      name: 'User Management',
      path: '/tenant/users',
      icon: '👥',
      description: 'Manage tenant users',
      sortOrder: 2,
      isActive: true,
      category: 'TENANT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 12,
      name: 'Tickets',
      path: '/tenant/tickets',
      icon: '🎫',
      description: 'View tickets',
      sortOrder: 3,
      isActive: true,
      category: 'TENANT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 13,
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: '📚',
      description: 'Knowledge base',
      sortOrder: 4,
      isActive: true,
      category: 'TENANT',
      createdAt: '',
      updatedAt: ''
    }
  ],
  AGENT: [
    {
      id: 20,
      name: 'Dashboard',
      path: '/agent',
      icon: '📊',
      description: 'Agent overview',
      sortOrder: 1,
      isActive: true,
      category: 'AGENT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 21,
      name: 'My Tickets',
      path: '/agent/tickets',
      icon: '🎫',
      description: 'Assigned tickets',
      sortOrder: 2,
      isActive: true,
      category: 'AGENT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 22,
      name: 'Ticket Queue',
      path: '/agent/queue',
      icon: '📋',
      description: 'Ticket queue',
      sortOrder: 3,
      isActive: true,
      category: 'AGENT',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 23,
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: '📚',
      description: 'Knowledge base',
      sortOrder: 4,
      isActive: true,
      category: 'AGENT',
      createdAt: '',
      updatedAt: ''
    }
  ],
  DEVELOPER: [
    {
      id: 30,
      name: 'Dashboard',
      path: '/developer',
      icon: '📊',
      description: 'Developer overview',
      sortOrder: 1,
      isActive: true,
      category: 'DEVELOPER',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 31,
      name: 'Tickets',
      path: '/developer/tickets',
      icon: '🎫',
      description: 'Development tickets',
      sortOrder: 2,
      isActive: true,
      category: 'DEVELOPER',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 32,
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: '📚',
      description: 'Knowledge base management',
      sortOrder: 3,
      isActive: true,
      category: 'DEVELOPER',
      createdAt: '',
      updatedAt: ''
    }
  ],
  USER: [
    {
      id: 40,
      name: 'Dashboard',
      path: '/user',
      icon: '📊',
      description: 'User overview',
      sortOrder: 1,
      isActive: true,
      category: 'USER',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 41,
      name: 'My Tickets',
      path: '/user/tickets',
      icon: '🎫',
      description: 'My tickets',
      sortOrder: 2,
      isActive: true,
      category: 'USER',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 42,
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: '📚',
      description: 'Help articles',
      sortOrder: 3,
      isActive: true,
      category: 'USER',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 43,
      name: 'Profile',
      path: '/user/profile',
      icon: '👤',
      description: 'My profile',
      sortOrder: 4,
      isActive: true,
      category: 'USER',
      createdAt: '',
      updatedAt: ''
    }
  ]
};

export const getNavigationForRoles = (roles: string[]): MenuItem[] => {
  const allMenus: MenuItem[] = [];
  
  roles.forEach(role => {
    if (staticNavigation[role]) {
      allMenus.push(...staticNavigation[role]);
    }
  });

  // Remove duplicates by path
  const uniqueMenus = allMenus.reduce((acc, menu) => {
    if (!acc.some(existing => existing.path === menu.path)) {
      acc.push(menu);
    }
    return acc;
  }, [] as MenuItem[]);

  return uniqueMenus.sort((a, b) => a.sortOrder - b.sortOrder);
};
