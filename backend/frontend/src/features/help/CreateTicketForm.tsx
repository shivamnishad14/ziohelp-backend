import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  AlertTriangle,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { ticketsAPI } from '../../services/apiService';
// import { Ticket } from '../../services/productHelpApi';
import { toast } from 'sonner';

interface CreateTicketFormProps {
  domain: string;
  onClose?: () => void;
  onSuccess?: (ticket: Ticket) => void;
}

interface TicketForm {
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdBy: string;
}

export default function CreateTicketForm({ domain, onClose, onSuccess }: CreateTicketFormProps) {
  const [formData, setFormData] = useState<TicketForm>({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    createdBy: ''
  });

  const [errors, setErrors] = useState<Partial<TicketForm>>({});
  const queryClient = useQueryClient();

  const createTicketMutation = useMutation({
    mutationFn: (ticket: Partial<any>) => 
      ticketsAPI.create(ticket),
    onSuccess: (newTicket) => {
      toast.success('Support ticket created successfully!');
      queryClient.invalidateQueries({ queryKey: ['public-help', domain] });
      onSuccess?.(newTicket);
      onClose?.();
    },
    onError: (error: any) => {
      toast.error('Failed to create ticket. Please try again.');
      console.error('Create ticket error:', error);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.createdBy)) {
      newErrors.createdBy = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    createTicketMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof TicketForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return { color: 'bg-green-100 text-green-800', icon: Info, description: 'General questions or minor issues' };
      case 'MEDIUM':
        return { color: 'bg-blue-100 text-blue-800', icon: Info, description: 'Standard support requests' };
      case 'HIGH':
        return { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle, description: 'Important issues affecting functionality' };
      case 'URGENT':
        return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, description: 'Critical issues requiring immediate attention' };
      default:
        return { color: 'bg-blue-100 text-blue-800', icon: Info, description: 'Standard support requests' };
    }
  };

  const categories = [
    'Technical Issue',
    'Bug Report',
    'Feature Request',
    'Account & Billing',
    'General Support',
    'Integration Help',
    'Documentation',
    'Other'
  ];

  const priorityInfo = getPriorityInfo(formData.priority);
  const PriorityIcon = priorityInfo.icon;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Submit a support request and get help from our team
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Brief description of your issue"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Your Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={formData.createdBy}
              onChange={(e) => handleInputChange('createdBy', e.target.value)}
              className={errors.createdBy ? 'border-red-500' : ''}
            />
            {errors.createdBy && (
              <p className="text-sm text-red-600">{errors.createdBy}</p>
            )}
            <p className="text-xs text-gray-500">
              We'll use this email to send you updates about your ticket
            </p>
          </div>

          {/* Category and Priority */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={priorityInfo.color}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {formData.priority}
                </Badge>
                <span className="text-xs text-gray-500">{priorityInfo.description}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your issue. Include steps to reproduce the problem, error messages, and any relevant context."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/500 characters - Be as specific as possible
            </p>
          </div>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-2">Tips for better support:</p>
                  <ul className="text-blue-800 space-y-1 text-xs">
                    <li>• Include specific error messages or screenshots if possible</li>
                    <li>• Mention what you were trying to accomplish</li>
                    <li>• Describe what you expected vs. what actually happened</li>
                    <li>• Include browser version and operating system if relevant</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={createTicketMutation.isPending}
              className="min-w-[120px]"
            >
              {createTicketMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {createTicketMutation.isSuccess && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                Ticket created successfully! You'll receive an email confirmation shortly.
              </span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
