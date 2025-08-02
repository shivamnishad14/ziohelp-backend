import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useMenuItems, useMenuMutations, useAdminMenuItems } from '../../hooks/useMenuItems';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  category?: string;
  parentId: number | null;
  children?: MenuItem[];
  roles?: string[];
}
const Menu = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  // Use admin menu for admin, else user menu
  const isAdmin = user?.roles?.includes('admin');
  const {
    data: adminMenuItems,
    isLoading: adminLoading,
    error: adminError,
    refetch: refetchAdminMenu
  } = useAdminMenuItems();
  const {
    data: userMenuItems,
    isLoading: userLoading,
    error: userError,
    invalidateMenu
  } = useMenuItems();
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const isLoading = isAdmin ? adminLoading : userLoading;
  const error = isAdmin ? adminError : userError;

  // State for dialogs
  const [openDialog, setOpenDialog] = useState<null | 'add' | 'edit' | 'roles'>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formState, setFormState] = useState<Partial<MenuItem>>({});
  const [roleInput, setRoleInput] = useState<string[]>([]);

  // Mutations
  const {
    createMenu,
    updateMenu,
    deleteMenu,
    updateMenuRoles,
    createLoading,
    updateLoading,
    deleteLoading,
    updateRolesLoading
  } = useMenuMutations({ onSuccess: isAdmin ? refetchAdminMenu : invalidateMenu });

  // Build menu tree
  const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<number, MenuItem>();
    const rootItems: MenuItem[] = [];
    // First pass: create all items in the map with empty children
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });
    // Second pass: build the tree
    items.forEach(item => {
      const mappedItem = itemMap.get(item.id)!;
      if (item.parentId === null) {
        rootItems.push(mappedItem);
      } else {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(mappedItem);
        }
      }
    });
    const sortByOrder = (items: MenuItem[]) => {
      items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      items.forEach(item => {
        if (item.children && item.children.length > 0) sortByOrder(item.children);
      });
    };
    sortByOrder(rootItems);
    return rootItems;
  };

  // Handlers
  const handleOpenAdd = (parent?: MenuItem) => {
    setFormState(parent ? { parentId: parent.id, isActive: true, sortOrder: 0 } : { isActive: true, sortOrder: 0 });
    setSelectedItem(parent || null);
    setOpenDialog('add');
  };
  const handleOpenEdit = (item: MenuItem) => {
    setFormState(item);
    setSelectedItem(item);
    setOpenDialog('edit');
  };
  const handleOpenRoles = (item: MenuItem) => {
    setRoleInput(item.roles || []);
    setSelectedItem(item);
    setOpenDialog('roles');
  };
  const handleDelete = (item: MenuItem) => {
    if (window.confirm('Delete this menu item?')) {
      deleteMenu(item.id);
    }
  };

  // Render menu item row
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = depth * 24 + 8;
    // Treat null isActive as true (active)
    const isActive = item.isActive === null || item.isActive === undefined ? true : item.isActive;
    return (
      <div key={item.id} className="mb-2">
        <div
          className={`flex items-center p-2 rounded transition-colors ${isActive ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-white border border-gray-200 text-gray-700'}`}
          style={{ paddingLeft }}
        >
          <span className="font-semibold mr-2">{item.icon}</span>
          <span
            className="flex-1 cursor-pointer hover:underline"
            onClick={e => {
              // Prevent navigation if clicking on a button
              if ((e.target as HTMLElement).tagName === 'BUTTON') return;
              if (item.path) navigate({ to: item.path });
            }}
          >
            {item.name} <span className="ml-2 text-xs text-gray-400">({item.path})</span>
          </span>
          <span className="text-xs text-gray-500 mr-2">{item.roles?.join(', ')}</span>
          <Button size="sm" variant="outline" className="mr-1" onClick={() => handleOpenAdd(item)}>Add</Button>
          <Button size="sm" variant="outline" className="mr-1" onClick={() => handleOpenEdit(item)}>Edit</Button>
          <Button size="sm" variant="outline" className="mr-1" onClick={() => handleOpenRoles(item)}>Roles</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>Delete</Button>
        </div>
        {hasChildren && (
          <div className="ml-4 mt-1">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Dialog forms
  const renderDialog = () => {
    if (!openDialog) return null;
    const isEdit = openDialog === 'edit';
    const isAdd = openDialog === 'add';
    const isRoles = openDialog === 'roles';
    return (
      <Dialog open onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAdd ? 'Add Menu Item' : isEdit ? 'Edit Menu Item' : 'Assign Roles'}</DialogTitle>
            <DialogDescription>
              {isAdd && 'Create a new menu item.'}
              {isEdit && 'Edit the selected menu item.'}
              {isRoles && 'Assign roles that can view this menu item.'}
            </DialogDescription>
          </DialogHeader>
          {isRoles ? (
            <div>
              <label className="block mb-2 font-medium">Roles (comma separated)</label>
              <Input
                value={roleInput.join(',')}
                onChange={e => setRoleInput(e.target.value.split(',').map(r => r.trim()).filter(Boolean))}
                placeholder="admin,user,manager"
              />
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (isAdd) createMenuMutation.mutate(formState);
                if (isEdit && selectedItem) updateMenuMutation.mutate({ id: selectedItem.id, ...formState });
              }}
              className="space-y-3"
            >
              <Input
                className="w-full"
                value={formState.name || ''}
                onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                placeholder="Menu Name"
                required
              />
              <Input
                className="w-full"
                value={formState.path || ''}
                onChange={e => setFormState(f => ({ ...f, path: e.target.value }))}
                placeholder="/path"
                required
              />
              <Input
                className="w-full"
                value={formState.icon || ''}
                onChange={e => setFormState(f => ({ ...f, icon: e.target.value }))}
                placeholder="Icon name"
              />
              <Input
                className="w-full"
                value={formState.description || ''}
                onChange={e => setFormState(f => ({ ...f, description: e.target.value }))}
                placeholder="Description"
              />
              <Input
                className="w-full"
                type="number"
                value={formState.sortOrder ?? 0}
                onChange={e => setFormState(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                placeholder="Sort Order"
              />
              <Select
                value={formState.isActive ? 'true' : 'false'}
                onValueChange={v => setFormState(f => ({ ...f, isActive: v === 'true' }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Active?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit" loading={createMenuMutation.isLoading || updateMenuMutation.isLoading}>
                  {isAdd ? 'Create' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          )}
          {isRoles && (
            <DialogFooter>
              <Button
                onClick={() => {
                  if (selectedItem) updateRolesMutation.mutate({ id: selectedItem.id, roles: roleInput });
                }}
                loading={updateRolesMutation.isLoading}
              >
                Save Roles
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-8 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="animate-pulse h-6 w-1/3 bg-gray-100 rounded" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading menu items. Please try again.
        </div>
      </div>
    );
  }
  const menuTree = menuItems ? buildMenuTree(menuItems) : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-2">
            Admin: manage all menu items and their roles.
          </p>
        </div>
        <Button onClick={() => handleOpenAdd()} variant="default">Add Root Menu</Button>
      </div>
      {menuTree.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items Available</h3>
          <p className="text-gray-600">
            No menu items are available. Add a new menu item to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">All Menu Items</h2>
              <div className="text-sm text-gray-500">
                Total: {menuItems?.length || 0} items
              </div>
            </div>
            <div className="space-y-2">
              {menuTree.map(item => renderMenuItem(item))}
            </div>
          </div>
        </div>
      )}
      {renderDialog()}
    </div>
  );
}
export default Menu;
