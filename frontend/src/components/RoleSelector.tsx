import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { roleAPI } from '@/services/api';
import { Role } from '@/types';
import { toast } from 'sonner';

interface RoleSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function RoleSelector({
  value,
  onValueChange,
  label = 'Role',
  placeholder = 'Select a role',
  disabled = false,
  required = false,
  className = '',
}: RoleSelectorProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleAPI.getAllList();
      setRoles(response.data || []);
    } catch (error: any) {
      toast.error('Failed to load roles: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="role-select" className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? 'Loading roles...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.name}>
              {role.name} ({role.userCount} users)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 