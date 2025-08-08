// src/components/iconMap.ts
// Central icon map for menu items
import { Menu, LayoutDashboard, Ticket, User } from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  menu: Menu,
  dashboard: LayoutDashboard,
  ticket: Ticket,
  user: User,
};
