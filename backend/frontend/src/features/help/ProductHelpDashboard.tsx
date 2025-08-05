import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { 
  Building, 
  Globe, 
  Calendar, 
  Eye, 
  MessageSquare,
  Book,
  HelpCircle,
  ArrowRight,
  Users,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Product, ProductStats, KnowledgeBaseArticle } from '../../services/productHelpApi';

interface ProductHelpDashboardProps {
  product: Product;
  stats: ProductStats;
  recentArticles: KnowledgeBaseArticle[];
  onViewAllFaqs: () => void;
  onViewAllArticles: () => void;
  onViewAllTickets: () => void;
}

export default function ProductHelpDashboard({ 
  product, 
  stats, 
  recentArticles,
  onViewAllFaqs,
  onViewAllArticles,
  onViewAllTickets
}: ProductHelpDashboardProps) {
  
  return (
    <div className="space-y-6">
      {/* Product Header */}
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
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">{product.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {product.domain}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Version {product.version}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.faqCount}</p>
                <p className="text-xs text-muted-foreground">Total FAQs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.articleCount}</p>
                <p className="text-xs text-muted-foreground">Knowledge Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.ticketCount}</p>
                <p className="text-xs text-muted-foreground">Support Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your help content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onViewAllFaqs}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Manage FAQs
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onViewAllArticles}
            >
              <Book className="h-4 w-4 mr-2" />
              Manage Articles
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onViewAllTickets}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Tickets
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>

            <Separator />

            <Button className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              View Public Help Center
            </Button>
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Latest knowledge base articles</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onViewAllArticles}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50">
                  <Book className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{article.title}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.viewCount}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentArticles.length === 0 && (
                <div className="text-center py-6">
                  <Book className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No articles yet</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Create your first article
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Categories</CardTitle>
          <CardDescription>
            Help content organized by categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-sm">
                {category}
              </Badge>
            ))}
            {stats.categories.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No categories defined yet. Categories will appear here as you add content.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Content Performance
            </CardTitle>
            <CardDescription>
              How your help content is performing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Most Viewed Articles</span>
                <Button variant="link" size="sm">View Analytics</Button>
              </div>
              
              <div className="space-y-2">
                {recentArticles
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .slice(0, 3)
                  .map((article) => (
                    <div key={article.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{article.title}</span>
                      <span className="text-muted-foreground">{article.viewCount} views</span>
                    </div>
                  ))}
                
                {recentArticles.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Analytics will appear here once you have content
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Support Activity
            </CardTitle>
            <CardDescription>
              Recent support activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-xs text-muted-foreground">Resolved Today</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-muted-foreground">Pending Tickets</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={onViewAllTickets}>
                  View All Tickets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
