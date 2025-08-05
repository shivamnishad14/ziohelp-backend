import React from 'react';
import { 
  Users, 
  Settings, 
  Home, 
  Ticket, 
  Menu, 
  Shield, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Plus,
  Search,
  Mail,
  Package,
  Database,
  Eye,
  Upload,
  MessageSquare,
  Clock,
  User,
  UserPlus,
  Activity,
  type LucideIcon
} from 'lucide-react';

// Icon mapping for menu items
const iconMap: Record<string, LucideIcon> = {
  // Dashboard icons
  dashboard: Home,
  home: Home,
  
  // User management
  users: Users,
  user: User,
  person: User,
  'user-plus': UserPlus,
  
  // Tickets
  ticket: Ticket,
  tickets: Ticket,
  
  // Menu/Navigation
  menu: Menu,
  
  // Settings
  settings: Settings,
  
  // Security/Roles
  shield: Shield,
  roles: Shield,
  
  // Help/Support
  help: HelpCircle,
  'help-circle': HelpCircle,
  
  // Analytics/Reports
  analytics: BarChart3,
  'bar-chart': BarChart3,
  
  // Actions
  add: Plus,
  plus: Plus,
  search: Search,
  
  // Communication
  mail: Mail,
  email: Mail,
  message: MessageSquare,
  comments: MessageSquare,
  
  // Products/Packages
  package: Package,
  products: Package,
  
  // Data/Logs
  database: Database,
  logs: Database,
  
  // Misc
  eye: Eye,
  upload: Upload,
  clock: Clock,
  activity: Activity,
  
  // Documents
  file: FileText,
  document: FileText,
  faqs: FileText,
};

interface MenuIconProps {
  name?: string;
  className?: string;
  size?: number;
}

export function MenuIcon({ name, className = "h-4 w-4", size }: MenuIconProps) {
  if (!name) {
    return <Menu className={className} size={size} />;
  }
  
  const IconComponent = iconMap[name.toLowerCase()] || Menu;
  return <IconComponent className={className} size={size} />;
}

// Export the icon map for use in dropdowns/selects
export const availableIcons = Object.keys(iconMap).sort();

export default MenuIcon;
