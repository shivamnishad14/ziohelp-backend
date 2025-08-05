import { useAuth } from '../auth/AuthProvider';
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { MultiSelect } from "./multi-select";
import { MenuIcon, availableIcons } from "./menu-icon";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2, Trash2, Edit, UserCheck, Plus, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';


import {
  useUserMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useUpdateMenuRoles,
  useAvailableRoles,
  type MenuItem
} from '../../hooks/useMenuItems';

const ImprovedMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  

  // Use admin menu for admin, else user menu
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Static menu for admin
  const staticAdminMenu: MenuItem[] = [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'dashboard',
      isActive: true,
      sortOrder: 1,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'Admin dashboard',
      category: 'ADMIN',
    },
    {
      id: 2,
      name: 'Users',
      icon: 'users',
      isActive: true,
      sortOrder: 2,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'User management',
      category: 'ADMIN',
    },
    {
      id: 3,
      name: 'Settings',
      icon: 'settings',
      isActive: true,
      sortOrder: 3,
      parentId: null,
      children: [],
      roles: ['ADMIN'],
      description: 'System settings',
      category: 'ADMIN',
    },
  ];

  const {
    data: userMenuItems,
    isLoading: userLoading,
    error: userError
  } = useUserMenuItems();

  const {
    data: availableRoles = [],
    isLoading: rolesLoading
  } = useAvailableRoles();

  const menuItems = isAdmin ? staticAdminMenu : userMenuItems;
  const isLoading = userLoading;
  const error = userError;

  // State for dialogs and bulk operations
  const [openDialog, setOpenDialog] = useState<null | 'add' | 'edit' | 'roles'>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formState, setFormState] = useState<Partial<MenuItem>>({});
  const [roleInput, setRoleInput] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Mutations (use new granular hooks)
  const createMenuMutation = useCreateMenuItem(() => isAdmin && refetchAdminMenu());
  const updateMenuMutation = useUpdateMenuItem(() => isAdmin && refetchAdminMenu());
  const deleteMenuMutation = useDeleteMenuItem(() => isAdmin && refetchAdminMenu());
  const updateRolesMutation = useUpdateMenuRoles(() => isAdmin && refetchAdminMenu());
  // For bulk delete, fallback to old mutation if needed
  // (Assume deleteMenuItemsMutation is still from useMenuMutations if needed)

  // (deleteMenuItemsMutation for bulk delete is not yet implemented in granular hooks)

  // Build menu tree (moved to backend, but keeping for compatibility)
  const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<number, MenuItem>();
    const rootItems: MenuItem[] = [];
    
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });
    
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
    setFormState(parent ? { 
      parentId: parent.id, 
      isActive: true, 
      sortOrder: 0,
      icon: 'menu' 
    } : { 
      isActive: true, 
      sortOrder: 0,
      icon: 'menu'
    });
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
    if (window.confirm(`Delete menu item "${item.name}"? This action cannot be undone.`)) {
      deleteMenuMutation.mutate(item.id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`Delete ${selectedItems.length} selected menu items? This action cannot be undone.`)) {
      // Bulk delete not implemented, fallback to deleting one by one
      selectedItems.forEach(id => deleteMenuMutation.mutate(id));
      setSelectedItems([]);
      setBulkMode(false);
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Render menu item row with improvements
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = depth * 24 + 8;
    const isActive = item.isActive === null || item.isActive === undefined ? true : item.isActive;
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <div key={item.id} className="mb-2">
        <div
          className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100' 
              : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          style={{ paddingLeft }}
        >
          {/* Bulk selection checkbox */}
          {bulkMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleItemSelection(item.id)}
              className="mr-3"
            />
          )}
          
          {/* Icon with proper component */}
          <div className="mr-3 p-1 rounded bg-white shadow-sm">
            <MenuIcon name={item.icon} className="h-4 w-4" />
          </div>
          
          {/* Menu item details */}
          <div
            className="flex-1 cursor-pointer"
            onClick={e => {
              if ((e.target as HTMLElement).tagName === 'BUTTON') return;
              if ((e.target as HTMLElement).tagName === 'INPUT') return;
              if (item.path) navigate({ to: item.path });
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.name}</span>
              {!isActive && <EyeOff className="h-4 w-4 text-gray-400" />}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {item.path} {item.description && `• ${item.description}`}
            </div>
          </div>
          
          {/* Roles badges */}
          <div className="flex flex-wrap gap-1 mr-3">
            {item.roles?.map(role => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
          
          {/* Action buttons */}
          {isAdmin && !bulkMode && (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleOpenAdd(item)}
                title="Add child menu"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleOpenEdit(item)}
                title="Edit menu"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleOpenRoles(item)}
                title="Manage roles"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700" 
                onClick={() => handleDelete(item)}
                title="Delete menu"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Children */}
        {hasChildren && (
          <div className="ml-4 mt-2">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Enhanced dialog forms
  const renderDialog = () => {
    if (!openDialog) return null;
    const isEdit = openDialog === 'edit';
    const isAdd = openDialog === 'add';
    const isRoles = openDialog === 'roles';
    
    return (
      <Dialog open onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isAdd && <><Plus className="h-5 w-5" />Add Menu Item</>}
              {isEdit && <><Edit className="h-5 w-5" />Edit Menu Item</>}
              {isRoles && <><UserCheck className="h-5 w-5" />Assign Roles</>}
            </DialogTitle>
            <DialogDescription>
              {isAdd && 'Create a new menu item with proper configuration.'}
              {isEdit && 'Update the selected menu item details.'}
              {isRoles && 'Select which roles can view this menu item.'}
            </DialogDescription>
          </DialogHeader>
          
          {isRoles ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Assigned Roles</label>
                {rolesLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading roles...
                  </div>
                ) : (
                  <MultiSelect
                    options={availableRoles}
                    selected={roleInput}
                    onChange={setRoleInput}
                    placeholder="Select roles..."
                  />
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (selectedItem) {
                      updateRolesMutation.mutate({ id: selectedItem.id, roles: roleInput });
                      setOpenDialog(null);
                    }
                  }}
                  disabled={updateRolesMutation.isPending}
                >
                  {updateRolesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Roles
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (isAdd) {
                  createMenuMutation.mutate(formState);
                } else if (isEdit && selectedItem) {
                  updateMenuMutation.mutate({ id: selectedItem.id, ...formState });
                }
                setOpenDialog(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-2 font-medium">Menu Name *</label>
                <Input
                  value={formState.name || ''}
                  onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., User Management"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Path *</label>
                <Input
                  value={formState.path || ''}
                  onChange={e => setFormState(f => ({ ...f, path: e.target.value }))}
                  placeholder="e.g., /admin/users"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Icon</label>
                  <Select
                    value={formState.icon || 'menu'}
                    onValueChange={v => setFormState(f => ({ ...f, icon: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map(icon => (
                        <SelectItem key={icon} value={icon} className="flex items-center gap-2">
                          <MenuIcon name={icon} className="h-4 w-4" />
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Sort Order</label>
                  <Input
                    type="number"
                    value={formState.sortOrder ?? 0}
                    onChange={e => setFormState(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <Input
                  value={formState.description || ''}
                  onChange={e => setFormState(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this menu item"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Category</label>
                  <Input
                    value={formState.category || ''}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    placeholder="e.g., ADMIN, USER"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Status</label>
                  <Select
                    value={formState.isActive === false ? 'false' : 'true'}
                    onValueChange={v => setFormState(f => ({ ...f, isActive: v === 'true' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createMenuMutation.isPending || updateMenuMutation.isPending}
                >
                  {(createMenuMutation.isPending || updateMenuMutation.isPending) && 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  }
                  {isAdd ? 'Create Menu' : 'Update Menu'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Error loading menu items. Please try again.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const menuTree = menuItems ? buildMenuTree(menuItems) : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MenuIcon name="menu" className="h-8 w-8" />
            Menu Management
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Manage all menu items and their roles' : 'View available menu items'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            {bulkMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkMode(false);
                    setSelectedItems([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={selectedItems.length === 0 || deleteMenuMutation.isPending}
                >
                  {deleteMenuMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Selected ({selectedItems.length})
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setBulkMode(true)}
                  disabled={menuTree.length === 0}
                >
                  Bulk Actions
                </Button>
                <Button onClick={() => handleOpenAdd()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Root Menu
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {menuTree.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-6">
            <MenuIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Menu Items Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No menu items are configured yet. {isAdmin ? 'Create your first menu item to get started.' : 'Please contact your administrator.'}
          </p>
          {isAdmin && (
            <Button onClick={() => handleOpenAdd()}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Menu Item
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu Structure</h2>
              <div className="text-sm text-gray-500">
                Total: {menuItems?.length || 0} items
              </div>
            </div>
          </div>
          <div className="p-6 space-y-2">
            {menuTree.map(item => renderMenuItem(item))}
          </div>
        </div>
      )}

      {/* Dialog */}
      {renderDialog()}
    </div>
  );
};

export default ImprovedMenu;
