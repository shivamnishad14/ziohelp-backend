import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, FileText, HelpCircle, Send, CheckCircle, Eye } from 'lucide-react';
import FAQArticleDetail from '../../components/FAQArticleDetail';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketForm {
  title: string;
  description: string;
  category: string;
  priority: string;
  contactEmail: string;
  contactName: string;
}

const HelpCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId') || '1'; // Default to product 1 if not specified
  
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState<TicketForm>({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    contactEmail: '',
    contactName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState<'faq' | 'article'>('faq');
  const [guestToken, setGuestToken] = useState<string>('');

  const categories = ['all', 'General', 'Technical', 'Billing', 'Account', 'Product'];

  useEffect(() => {
    fetchFAQs();
    fetchArticles();
  }, [productId]);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/faqs/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/knowledge-base/articles/list?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/tickets/public-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: ticketForm.contactName,
          email: ticketForm.contactEmail,
          subject: ticketForm.title,
          description: ticketForm.description,
          priority: ticketForm.priority.toUpperCase(),
          category: ticketForm.category.toUpperCase(),
          productId: parseInt(productId)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGuestToken(result.data.guestToken);
        setSubmitted(true);
        setTicketForm({
          title: '',
          description: '',
          category: 'General',
          priority: 'Medium',
          contactEmail: '',
          contactName: ''
        });
        setShowTicketForm(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to submit ticket:', errorData.message);
        alert('Failed to submit ticket: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleItemClick = (item: any, type: 'faq' | 'article') => {
    setSelectedItem(item);
    setDetailType(type);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions or submit a new ticket
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs and articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Submit Ticket Button */}
            <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="mb-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Submit New Ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name *
                      </label>
                      <Input
                        required
                        value={ticketForm.contactName}
                        onChange={(e) => setTicketForm({...ticketForm, contactName: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={ticketForm.contactEmail}
                        onChange={(e) => setTicketForm({...ticketForm, contactEmail: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Title *
                    </label>
                    <Input
                      required
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="General">General</option>
                        <option value="Technical">Technical</option>
                        <option value="Billing">Billing</option>
                        <option value="Account">Account</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <Textarea
                      required
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Please provide detailed information about your issue..."
                      rows={5}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTicketForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitted && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Ticket Submitted Successfully!
                </h3>
                <p className="text-green-700 mb-3">
                  Your ticket has been submitted successfully! We'll notify you at {ticketForm.contactEmail} when it's resolved.
                </p>
                <div className="bg-white p-4 rounded border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Your Ticket Token:</strong> (Use this to track your ticket status)
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">
                      {guestToken}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(guestToken);
                        alert('Token copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can use this token to check your ticket status at any time.
                  </p>
                  <div className="mt-3">
                    <Link
                      to={`/guest-ticket-status?token=${guestToken}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Track your ticket status
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <HelpCircle className="mr-2 h-6 w-6 text-blue-600" />
            Frequently Asked Questions
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No FAQs found matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {faq.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleItemClick(faq, 'faq')}
                        className="ml-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-2">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Base Articles Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="mr-2 h-6 w-6 text-blue-600" />
            Knowledge Base Articles
          </h2>
          
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No articles found matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span className="text-sm text-gray-500">by {article.author}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleItemClick(article, 'article')}
                        className="ml-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <div className="text-sm text-gray-500">
                      Updated: {new Date(article.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <FAQArticleDetail
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        type={detailType}
        data={selectedItem}
      />
    </div>
  );
};

export default HelpCenter; 