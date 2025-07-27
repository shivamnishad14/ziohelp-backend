import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { RoleExtended, RoleFormData, Permission, MenuItem } from '@/types/rbac';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Menu, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name is too long'),
  description: z.string().optional(),
  isActive: z.boolean(),
  permissionIds: z.array(z.number()),
  menuPermissions: z.array(z.object({
    menuItemId: z.number(),
    canView: z.boolean(),
    canEdit: z.boolean(),
    canDelete: z.boolean(),
  })),
});

interface RoleFormProps {
  role?: RoleExtended;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [menuPermissions, setMenuPermissions] = useState<Map<number, { canView: boolean; canEdit: boolean; canDelete: boolean }>>(new Map());
  const { toast } = useToast();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive ?? true,
      permissionIds: role?.permissions?.map(p => p.id) || [],
      menuPermissions: role?.menuPermissions?.map(mp => ({
        menuItemId: mp.menuItem.id,
        canView: mp.canView,
        canEdit: mp.canEdit,
        canDelete: mp.canDelete,
      })) || [],
    },
  });

  // Fetch permissions
  const { data: permissionsData } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => rbacService.getPermissions({ size: 1000 }),
  });

  // Fetch menu items
  const { data: menuItemsData } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => rbacService.getMenuItems({ size: 1000, isActive: true }),
  });

  // Group permissions by resource
  const permissionsByResource = React.useMemo(() => {
    if (!permissionsData?.content) return {};
    return permissionsData.content.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [permissionsData]);

  // Group menu items by category
  const menuItemsByCategory = React.useMemo(() => {
    if (!menuItemsData?.content) return {};
    return menuItemsData.content.reduce((acc, menuItem) => {
      const category = menuItem.category || 'GENERAL';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(menuItem);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menuItemsData]);

  useEffect(() => {
    if (role) {
      // Initialize selected permissions
      const permIds = new Set(role.permissions?.map(p => p.id) || []);
      setSelectedPermissions(permIds);

      // Initialize menu permissions
      const menuPerms = new Map();
      role.menuPermissions?.forEach(mp => {
        menuPerms.set(mp.menuItem.id, {
          canView: mp.canView,
          canEdit: mp.canEdit,
          canDelete: mp.canDelete,
        });
      });
      setMenuPermissions(menuPerms);
    }
  }, [role]);

  const createMutation = useMutation({
    mutationFn: rbacService.createRole,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Role created successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create role',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RoleFormData> }) =>
      rbacService.updateRole(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RoleFormData) => {
    const formData = {
      ...data,
      permissionIds: Array.from(selectedPermissions),
      menuPermissions: Array.from(menuPermissions.entries()).map(([menuItemId, perms]) => ({
        menuItemId,
        ...perms,
      })),
    };

    if (role) {
      updateMutation.mutate({ id: role.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePermission = (permissionId: number) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleAllPermissionsForResource = (resource: string) => {
    const resourcePermissions = permissionsByResource[resource] || [];
    const allSelected = resourcePermissions.every(p => selectedPermissions.has(p.id));
    
    const newSelected = new Set(selectedPermissions);
    resourcePermissions.forEach(permission => {
      if (allSelected) {
        newSelected.delete(permission.id);
      } else {
        newSelected.add(permission.id);
      }
    });
    setSelectedPermissions(newSelected);
  };

  const updateMenuPermission = (menuItemId: number, permission: 'canView' | 'canEdit' | 'canDelete', value: boolean) => {
    const current = menuPermissions.get(menuItemId) || { canView: false, canEdit: false, canDelete: false };
    
    // If disabling view, also disable edit and delete
    if (permission === 'canView' && !value) {
      current.canEdit = false;
      current.canDelete = false;
    }
    
    // If enabling edit or delete, also enable view
    if ((permission === 'canEdit' || permission === 'canDelete') && value) {
      current.canView = true;
    }
    
    current[permission] = value;
    
    const newMenuPermissions = new Map(menuPermissions);
    newMenuPermissions.set(menuItemId, current);
    setMenuPermissions(newMenuPermissions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Information
            </CardTitle>
            <CardDescription>
              Basic role details and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter role name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe this role's purpose" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Active roles can be assigned to users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Permissions and Menu Access */}
        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="menus">Menu Access</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assign Permissions</CardTitle>
                <CardDescription>
                  Select the permissions this role should have
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {Object.entries(permissionsByResource).map(([resource, permissions]) => {
                      const allSelected = permissions.every(p => selectedPermissions.has(p.id));
                      const someSelected = permissions.some(p => selectedPermissions.has(p.id));

                      return (
                        <div key={resource} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Badge variant="outline">{resource}</Badge>
                            </h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAllPermissionsForResource(resource)}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={selectedPermissions.has(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {permission.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <Separator />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menus" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Menu Access Control
                </CardTitle>
                <CardDescription>
                  Configure which menus this role can access and what actions they can perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {Object.entries(menuItemsByCategory).map(([category, menuItems]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Badge variant="outline">{category}</Badge>
                        </h4>
                        <div className="space-y-3">
                          {menuItems.map((menuItem) => {
                            const perms = menuPermissions.get(menuItem.id) || { canView: false, canEdit: false, canDelete: false };
                            return (
                              <div key={menuItem.id} className="border rounded p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium">{menuItem.name}</h5>
                                    <p className="text-sm text-muted-foreground">{menuItem.path}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`menu-view-${menuItem.id}`}
                                      checked={perms.canView}
                                      onCheckedChange={(checked) =>
                                        updateMenuPermission(menuItem.id, 'canView', !!checked)
                                      }
                                    />
                                    <label htmlFor={`menu-view-${menuItem.id}`} className="text-sm">
                                      View
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`menu-edit-${menuItem.id}`}
                                      checked={perms.canEdit}
                                      onCheckedChange={(checked) =>
                                        updateMenuPermission(menuItem.id, 'canEdit', !!checked)
                                      }
                                    />
                                    <label htmlFor={`menu-edit-${menuItem.id}`} className="text-sm">
                                      Edit
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`menu-delete-${menuItem.id}`}
                                      checked={perms.canDelete}
                                      onCheckedChange={(checked) =>
                                        updateMenuPermission(menuItem.id, 'canDelete', !!checked)
                                      }
                                    />
                                    <label htmlFor={`menu-delete-${menuItem.id}`} className="text-sm">
                                      Delete
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {role ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
