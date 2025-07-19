import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, User, FileText, HelpCircle } from 'lucide-react';

interface FAQArticleDetailProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'faq' | 'article';
  data: any;
}

const FAQArticleDetail: React.FC<FAQArticleDetailProps> = ({
  isOpen,
  onClose,
  type,
  data
}) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {type === 'faq' ? (
              <HelpCircle className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-green-600" />
            )}
            <Badge variant="secondary" className="capitalize">
              {type === 'faq' ? 'FAQ' : 'Article'}
            </Badge>
            <Badge variant="outline">
              {data.category}
            </Badge>
          </div>
          <DialogTitle className="text-xl">
            {type === 'faq' ? data.question : data.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {type === 'article' && (
            <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>By {data.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {new Date(data.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
          
          <div className="prose max-w-none">
            {type === 'faq' ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Answer:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{data.answer}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{data.content}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t">
            <Calendar className="h-4 w-4" />
            <span>Created: {new Date(data.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQArticleDetail; 