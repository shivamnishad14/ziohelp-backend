import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageSquare, 
  Mail,
  Phone,
  Clock,
  Star,
  ThumbsUp,
  ChevronRight,
  FileText,
  Video,
  Download
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'account', name: 'Account & Billing', count: 6 },
    { id: 'tickets', name: 'Tickets & Support', count: 5 },
    { id: 'technical', name: 'Technical Issues', count: 3 },
    { id: 'integrations', name: 'Integrations', count: 2 },
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to create your first support ticket',
      category: 'getting-started',
      views: 1234,
      rating: 4.8,
      type: 'article',
    },
    {
      id: 2,
      title: 'Understanding user roles and permissions',
      category: 'account',
      views: 987,
      rating: 4.6,
      type: 'video',
    },
    {
      id: 3,
      title: 'Troubleshooting login issues',
      category: 'technical',
      views: 756,
      rating: 4.9,
      type: 'article',
    },
    {
      id: 4,
      title: 'Setting up email notifications',
      category: 'account',
      views: 543,
      rating: 4.5,
      type: 'guide',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email.',
      category: 'account',
      helpful: 156,
    },
    {
      id: 2,
      question: 'How long does it take to get a response to my ticket?',
      answer: 'Our average response time is 2-4 hours during business hours (9 AM - 6 PM, Monday-Friday). For urgent issues, we aim to respond within 1 hour.',
      category: 'tickets',
      helpful: 89,
    },
    {
      id: 3,
      question: 'Can I change my subscription plan?',
      answer: 'Yes, you can upgrade or downgrade your subscription plan at any time from your account settings. Changes will be reflected in your next billing cycle.',
      category: 'account',
      helpful: 67,
    },
    {
      id: 4,
      question: 'How do I delete my account?',
      answer: 'To delete your account, please contact our support team. Account deletion is permanent and cannot be undone. All your data will be removed from our systems.',
      category: 'account',
      helpful: 34,
    },
    {
      id: 5,
      question: 'Why can\'t I see all features in my dashboard?',
      answer: 'Feature availability depends on your user role and subscription plan. Contact your administrator or upgrade your plan to access more features.',
      category: 'technical',
      helpful: 45,
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'guide':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to your questions and get the help you need
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Create Ticket</h3>
                <p className="text-sm text-muted-foreground">Get personalized help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@ziohelp.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Popular Articles */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Articles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>
              Most viewed and helpful articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularArticles.map((article) => (
                <div key={article.id} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <div className="p-2 bg-muted rounded">
                    {getTypeIcon(article.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{article.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {article.rating}
                      </span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
            {selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="text-left font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Was this helpful?
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Yes ({faq.helpful})
                        </Button>
                        <Button variant="ghost" size="sm">
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No FAQs found matching your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>
            Our support team is here to help you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Support Hours</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Monday - Friday: 9:00 AM - 6:00 PM
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Saturday: 10:00 AM - 4:00 PM
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Sunday: Closed
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@ziohelp.com
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live chat available 24/7
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
