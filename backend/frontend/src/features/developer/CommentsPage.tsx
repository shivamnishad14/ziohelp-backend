import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  Search,
  Filter,
  Plus
} from 'lucide-react';

export default function CommentsPage() {
  const comments = [
    {
      id: 1,
      ticketId: '#1234',
      ticketTitle: 'Fix login authentication bug',
      author: 'John Smith',
      content: 'I\'ve identified the issue. It\'s related to session timeout handling. Working on a fix now.',
      timestamp: '2025-08-02 14:30',
      type: 'update',
    },
    {
      id: 2,
      ticketId: '#1235',
      ticketTitle: 'Implement user role permissions',
      author: 'Sarah Wilson',
      content: 'Need clarification on the admin role permissions. Should admins have access to all tenant data?',
      timestamp: '2025-08-02 12:15',
      type: 'question',
    },
    {
      id: 3,
      ticketId: '#1236',
      ticketTitle: 'Database optimization',
      author: 'Mike Johnson',
      content: 'Performance testing completed. Query execution time improved by 40%.',
      timestamp: '2025-08-02 10:45',
      type: 'completed',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'update':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'question':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comments & Updates</h1>
          <p className="text-muted-foreground">
            Track all comments and updates on your assigned tickets
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Comment
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium">{comment.author}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.timestamp}
                    </p>
                  </div>
                </div>
                <Badge className={getTypeColor(comment.type)}>
                  {comment.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{comment.ticketId}</Badge>
                  <span className="text-muted-foreground">{comment.ticketTitle}</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Comments
        </Button>
      </div>
    </div>
  );
}
