import { useState, useEffect } from 'react';
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
  Plus,
  Star,
  ThumbsUp,
  ChevronRight,
  FileText,
  Video,
  Download,
  Building,
  Globe,
  Users,
  BarChart3,
  Layers,
  Settings,
  Eye,
  Calendar
} from 'lucide-react';
import { productsAPI } from '../../services/apiService';
// import { Product, ProductHelpData } from '../../services/productHelpApi';

export default function ProductHelpCenter() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
  });

  // Fetch product help data when a product is selected
  // Update helpData fetching logic as needed to use productsAPI or another API
  const { data: helpData, isLoading: helpLoading, refetch: refetchHelpData } = useQuery({
    queryKey: ['product-help', selectedProduct?.id],
    queryFn: () => selectedProduct ? productsAPI.getById(selectedProduct.id) : null,
    enabled: !!selectedProduct,
  });

  // Set first product as default when products load
  useEffect(() => {
    if (products && products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (productsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Product Help Center</h1>
          <p className="text-muted-foreground">
            Manage help content across all your products
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select 
            value={selectedProduct?.id.toString()} 
            onValueChange={(value) => {
              const product = products?.find(p => p.id.toString() === value);
              if (product) setSelectedProduct(product);
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>{product.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProduct && (
        <>
          {/* Product Info Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                    <Badge variant={selectedProduct.isActive ? "default" : "secondary"}>
                      {selectedProduct.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{selectedProduct.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {selectedProduct.domain}
                    </div>
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-1" />
                      Version {selectedProduct.version}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(selectedProduct.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          {helpData && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{helpData.faqs.length}</p>
                      <p className="text-xs text-muted-foreground">FAQs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Book className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{helpData.articles.length}</p>
                      <p className="text-xs text-muted-foreground">Articles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{helpData.tickets.length}</p>
                      <p className="text-xs text-muted-foreground">Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{helpData.ticketStats.open}</p>
                      <p className="text-xs text-muted-foreground">Open Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="faqs">FAQs ({helpData?.faqs.length || 0})</TabsTrigger>
              <TabsTrigger value="articles">Articles ({helpData?.articles.length || 0})</TabsTrigger>
              <TabsTrigger value="tickets">Tickets ({helpData?.tickets.length || 0})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="h-5 w-5 mr-2" />
                      Recent Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {helpData?.popularArticles.slice(0, 5).map((article) => (
                        <div key={article.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{article.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {article.viewCount}
                              </span>
                              <span>{article.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tickets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Recent Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {helpData?.recentTickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{ticket.title}</p>
                            <div className="flex items-center space-x-2 text-xs">
                              <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Categories Overview */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {helpData?.faqCategories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Article Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {helpData?.articleCategories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {helpData?.faqCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="space-y-2">
                    {helpData?.faqs
                      .filter(faq => {
                        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((faq) => (
                        <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span className="text-left font-medium">{faq.question}</span>
                              <Badge variant="secondary">{faq.category}</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="space-y-4">
                              <p className="text-muted-foreground">{faq.answer}</p>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center space-x-2">
                                  <Badge variant={faq.isPublished ? "default" : "secondary"}>
                                    {faq.isPublished ? "Published" : "Draft"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Updated {new Date(faq.updatedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                  <Button variant="ghost" size="sm">Delete</Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {helpData?.articleCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </div>

              <div className="grid gap-4">
                {helpData?.articles
                  .filter(article => {
                    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        article.content.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{article.title}</h3>
                              <Badge variant="secondary">{article.category}</Badge>
                              <Badge variant={article.isPublished ? "default" : "secondary"}>
                                {article.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{article.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {article.viewCount} views
                              </span>
                              <span>By {article.authorName}</span>
                              <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Delete</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              <div className="grid gap-4">
                {helpData?.tickets
                  .filter(ticket => {
                    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesSearch;
                  })
                  .map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{ticket.title}</h3>
                              <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              {ticket.description.substring(0, 150)}...
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Created by {ticket.createdBy}</span>
                              <span>Category: {ticket.category}</span>
                              <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Product Settings
                  </CardTitle>
                  <CardDescription>
                    Configure help center settings for this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Domain</label>
                      <Input value={selectedProduct.domain} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Version</label>
                      <Input value={selectedProduct.version} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email</label>
                      <Input value={selectedProduct.contactEmail || ''} placeholder="support@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Documentation URL</label>
                      <Input value={selectedProduct.documentationUrl || ''} placeholder="https://docs.example.com" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
