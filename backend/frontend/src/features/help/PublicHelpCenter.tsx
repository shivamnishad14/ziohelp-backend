import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
  Star,
  ThumbsUp,
  ChevronRight,
  FileText,
  Globe,
  Building,
  Eye,
  Calendar,
  Filter,
  MoreVertical
} from 'lucide-react';
import { productsAPI } from '../../services/apiService';
// import { ProductHelpData } from '../../services/productHelpApi';

interface PublicHelpCenterProps {
  domain: string; // e.g., "inventory.acme.com"
}

export default function PublicHelpCenter({ domain }: PublicHelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch product help data for the domain
  const { data: helpData, isLoading, error } = useQuery({
    queryKey: ['public-help', domain],
    queryFn: () => productsAPI.getById(domain), // Replace with correct API if needed
  });

  // Search functionality
  // Update search logic as needed to use productsAPI or another API
  const { data: searchResults, refetch: performSearch } = useQuery({
    queryKey: ['help-search', domain, searchQuery],
    queryFn: () => searchQuery ? productsAPI.getById(domain) : null, // Replace with correct API if needed
    enabled: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading help center...</p>
        </div>
      </div>
    );
  }

  if (error || !helpData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Help Center Not Found</h1>
            <p className="text-muted-foreground">
              The help center for {domain} could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { product, faqs, articles, faqCategories, articleCategories } = helpData;

  // Filter content based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory && faq.isPublished;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory && article.isPublished;
  });

  const allCategories = [...new Set([...faqCategories, ...articleCategories])];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {product.domain}
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Search</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{faqs.filter(f => f.isPublished).length}</p>
                  <p className="text-sm text-gray-600">FAQs Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{articles.filter(a => a.isPublished).length}</p>
                  <p className="text-sm text-gray-600">Knowledge Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allCategories.length}</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="faqs">FAQs ({filteredFaqs.length})</TabsTrigger>
            <TabsTrigger value="articles">Knowledge Base ({filteredArticles.length})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Popular Articles */}
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="h-5 w-5 mr-2" />
                    Popular Articles
                  </CardTitle>
                  <CardDescription>Most viewed and helpful articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {articles
                      .filter(article => article.isPublished)
                      .sort((a, b) => b.viewCount - a.viewCount)
                      .slice(0, 5)
                      .map((article) => (
                        <div key={article.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{article.title}</h4>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {article.viewCount} views
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Browse by Category</CardTitle>
                  <CardDescription>Find help content organized by topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {allCategories.map((category) => {
                      const faqCount = faqs.filter(f => f.category === category && f.isPublished).length;
                      const articleCount = articles.filter(a => a.category === category && a.isPublished).length;
                      const totalCount = faqCount + articleCount;
                      
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setActiveTab('faqs');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-gray-50 border"
                        >
                          <span className="font-medium">{category}</span>
                          <Badge variant="secondary">{totalCount} items</Badge>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Support Ticket</h3>
                      <p className="text-sm text-gray-600">Get personalized help from our team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Book className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Documentation</h3>
                      <p className="text-sm text-gray-600">Comprehensive guides and tutorials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Contact Support</h3>
                      <p className="text-sm text-gray-600">Reach out to our support team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                  {selectedCategory !== 'all' && (
                    <span> in the "{selectedCategory}" category</span>
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
                          <Badge variant="secondary" className="ml-2">{faq.category}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-sm text-gray-500">
                              Was this helpful?
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Yes
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
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or browse a different category.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{article.title}</h3>
                          <Badge variant="secondary">{article.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{article.summary}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.viewCount} views
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </span>
                          <span>By {article.authorName}</span>
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredArticles.length === 0 && (
                <Card>
                  <CardContent className="pt-12 pb-12">
                    <div className="text-center">
                      <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria or browse a different category.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Support Contact */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Support Ticket
              </Button>
              {product.contactEmail && (
                <Button variant="outline" className="flex-1">
                  Contact Support: {product.contactEmail}
                </Button>
              )}
              {product.documentationUrl && (
                <Button variant="outline" className="flex-1">
                  <Book className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
