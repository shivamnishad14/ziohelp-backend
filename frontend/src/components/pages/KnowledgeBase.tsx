import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useListArticles, 
  useCreateArticle, 
  useUpdateArticle, 
  useDeleteArticle,
  usePublishArticle,
  useSearchArticles,
  useArticleCategories
} from '@/hooks/api/useKnowledgeBase';
import { useListProducts } from '@/hooks/api/useProducts';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  productId: number;
  isPublished: boolean;
  file?: File | null;
}

const KnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  // Role helpers
  const isAdmin = user?.roles?.includes('ADMIN');
  const isTenantAdmin = user?.roles?.includes('TENANT_ADMIN');
  const isDeveloper = user?.roles?.includes('DEVELOPER');
  const canEdit = isAdmin || isTenantAdmin || isDeveloper;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Queries
  const { data: articles, isLoading, isError: isArticlesError, error: articlesError } = useListArticles({
    productId: selectedProduct,
    page: currentPage,
    size: pageSize
  });

  const { data: searchResults, isLoading: isSearchLoading, isError: isSearchError, error: searchError } = useSearchArticles({
    productId: selectedProduct,
    query: searchQuery,
    category: categoryFilter,
    page: currentPage,
    size: pageSize
  });

  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useArticleCategories(selectedProduct);
  const { data: products, isLoading: isProductsLoading, isError: isProductsError, error: productsError } = useListProducts();

  // Mutations
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();

  // Form state
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    category: '',
    tags: [],
    productId: selectedProduct,
    isPublished: false,
    file: null
  });

  const [tagInput, setTagInput] = useState('');

  // Handlers
  const handleCreateArticle = async () => {
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('productId', String(formData.productId));
      data.append('isPublished', String(formData.isPublished));
      formData.tags.forEach((tag, i) => data.append(`tags[${i}]`, tag));
      if (formData.file) {
        data.append('file', formData.file);
      }
      await createArticle.mutateAsync(data);
      toast("Article created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: [],
        productId: selectedProduct,
        isPublished: false,
        file: null
      });
    } catch (error) {
      toast("Failed to create article");
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('productId', String(formData.productId));
      data.append('isPublished', String(formData.isPublished));
      formData.tags.forEach((tag, i) => data.append(`tags[${i}]`, tag));
      if (formData.file) {
        data.append('file', formData.file);
      }
      await updateArticle.mutateAsync({
        articleId: selectedArticle.id,
        article: data
      });
      toast("Article updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Failed to update article");
    }
  };

  const handlePublishArticle = async (articleId: number) => {
    try {
      await publishArticle.mutateAsync({ articleId, published: true });
      toast("Article published successfully");
    } catch (error) {
      toast("Failed to publish article");
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    try {
      await deleteArticle.mutateAsync(articleId);
      toast("Article deleted successfully");
    } catch (error) {
      toast("Failed to delete article");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

const getStatusBadgeVariant = (isPublished: boolean) => {
  return isPublished ? 'default' : 'secondary';
};

const displayArticles = searchQuery || categoryFilter ? searchResults : articles;

return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage help articles and documentation
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Article
        </Button>
      </div>

      <Separator />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Product</Label>
              <Select value={selectedProduct.toString()} onValueChange={(value) => setSelectedProduct(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products?.content?.map((product: any) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {Array.isArray(categories) && categories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isArticlesError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load articles: {articlesError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}
          <ArticlesTable 
            articles={displayArticles}
            isLoading={isLoading}
            getStatusBadgeVariant={getStatusBadgeVariant}
            onView={(article) => {
              setSelectedArticle(article);
              setIsViewDialogOpen(true);
            }}
            onEdit={canEdit ? (article) => {
              setSelectedArticle(article);
              setFormData({
                title: article.title,
                content: article.content,
                category: article.category,
                tags: article.tags || [],
                productId: article.productId,
                isPublished: article.isPublished
              });
              setIsEditDialogOpen(true);
            } : undefined}
            onPublish={canEdit ? handlePublishArticle : undefined}
            onDelete={canEdit ? handleDeleteArticle : undefined}
            canEdit={canEdit}
          />
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {isArticlesError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load articles: {articlesError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}
          <ArticlesTable 
            articles={displayArticles?.content?.filter((a: any) => a.isPublished)}
            isLoading={isLoading}
            getStatusBadgeVariant={getStatusBadgeVariant}
            onView={() => {}}
            onEdit={() => {}}
            onPublish={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {isArticlesError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load articles: {articlesError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}
          <ArticlesTable 
            articles={displayArticles?.content?.filter((a: any) => !a.isPublished)}
            isLoading={isLoading}
            getStatusBadgeVariant={getStatusBadgeVariant}
            onView={() => {}}
            onEdit={() => {}}
            onPublish={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {isCategoriesError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load categories: {categoriesError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}
          {isCategoriesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading categories...</div>
          ) : (
            <CategoriesView categories={categories} />
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {displayArticles && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: displayArticles.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(displayArticles.totalPages - 1, currentPage + 1))}
                className={currentPage === displayArticles.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Article Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogDescription>
              Create a new knowledge base article.
            </DialogDescription>
          </DialogHeader>
          {isCategoriesLoading || isProductsLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading form data...</div>
          ) : isCategoriesError || isProductsError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load form data: {categoriesError?.message || productsError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <ArticleForm 
                formData={formData}
                setFormData={setFormData}
                tagInput={tagInput}
                setTagInput={setTagInput}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                categories={categories}
                products={products?.content}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateArticle} disabled={createArticle.isPending}>
                  {createArticle.isPending ? 'Creating...' : 'Create Article'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Update the article content and metadata.
            </DialogDescription>
          </DialogHeader>
          {isCategoriesLoading || isProductsLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading form data...</div>
          ) : isCategoriesError || isProductsError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load form data: {categoriesError?.message || productsError?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <ArticleForm 
                formData={formData}
                setFormData={setFormData}
                tagInput={tagInput}
                setTagInput={setTagInput}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                categories={categories}
                products={products?.content}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateArticle} disabled={updateArticle.isPending}>
                  {updateArticle.isPending ? 'Updating...' : 'Update Article'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Article Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              Article ID: #{selectedArticle?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(selectedArticle?.isPublished)}>
                {selectedArticle?.isPublished ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">{selectedArticle?.category}</Badge>
            </div>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle?.content }} />
            </div>
            {selectedArticle?.tags && selectedArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            {/* Attachments */}
            {selectedArticle?.attachments && selectedArticle.attachments.length > 0 && (
              <div className="space-y-2">
                <div className="font-semibold">Attachments:</div>
                <ul className="list-disc list-inside">
                  {selectedArticle.attachments.map((file: any) => (
                    <li key={file.id || file.name}>
                      <a
                        href={file.url || file.downloadUrl || file.path || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.name || file.filename || 'Download'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Article Form Component
const ArticleForm: React.FC<{
  formData: ArticleFormData;
  setFormData: (data: ArticleFormData) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  categories?: string[];
  products?: any[];
}> = ({ formData, setFormData, tagInput, setTagInput, onAddTag, onRemoveTag, categories, products }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter article title"
        />
      </div>

      <div>
        <Label>Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your article content..."
          className="min-h-[300px]"
        />
      </div>

      {/* File Attachment */}
      <div>
        <Label>Attachment</Label>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={e => {
            const file = e.target.files?.[0] || null;
            setFormData({ ...formData, file });
          }}
        />
        {formData.file && (
          <div className="mt-2 text-sm text-muted-foreground">
            Selected: {formData.file.name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) && categories.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Product</Label>
          <Select value={formData.productId.toString()} onValueChange={(value) => setFormData({ ...formData, productId: Number(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product: any) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex space-x-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
          />
          <Button type="button" onClick={onAddTag}>
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => onRemoveTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
        />
        <Label htmlFor="isPublished">Publish immediately</Label>
      </div>
    </div>
  );
};

// Articles Table Component
const ArticlesTable: React.FC<{
  articles?: any;
  isLoading: boolean;
  getStatusBadgeVariant: (isPublished: boolean) => string;
  onView: (article: any) => void;
  onEdit?: (article: any) => void;
  onPublish?: (articleId: number) => void;
  onDelete?: (articleId: number) => void;
  canEdit?: boolean;
}> = ({ articles, isLoading, getStatusBadgeVariant, onView, onEdit, onPublish, onDelete, canEdit }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!articles || !articles.content || articles.content.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <div>No articles found.</div>
        </CardContent>
      </Card>
    );
  }

  // TODO: Add error state if needed (e.g., pass error prop)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
        <CardDescription>
          {articles?.totalElements || articles?.length || 0} articles found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles?.content?.map((article: any) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{article.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(article.isPublished)}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {article.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onView(article)}>
                      View
                    </Button>
                    {canEdit && onEdit && (
                      <Button size="sm" variant="outline" onClick={() => onEdit(article)}>
                        Edit
                      </Button>
                    )}
                    {canEdit && onPublish && !article.isPublished && (
                      <Button size="sm" variant="default" onClick={() => onPublish(article.id)}>
                        Publish
                      </Button>
                    )}
                    {canEdit && onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the article.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(article.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Categories View Component
const CategoriesView: React.FC<{ categories?: string[] }> = ({ categories }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          {Array.isArray(categories) ? categories.length : 0} categories available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.isArray(categories) && categories.map((category: string) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Articles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBase; 