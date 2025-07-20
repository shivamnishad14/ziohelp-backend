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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useListFAQs, 
  useCreateFAQ, 
  useSearchFAQs,
  useFAQsByProduct,
  useFAQsByCategory,
  useFAQCategories
} from '@/hooks/api/useFAQ';
import { useListProducts } from '@/hooks/api/useProducts';
import { useAuth } from '@/hooks/api/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  productId: number;
  isActive: boolean;
}

const FAQManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  type UserRole = 'ADMIN' | 'TENANT_ADMIN' | 'DEVELOPER' | 'USER' | 'GUEST' | '';
  const userRole: UserRole = (user?.role as UserRole) || '';

  // Queries
  const { data: faqs, isLoading } = useListFAQs();

  const { data: searchResults } = useSearchFAQs(searchQuery);

  const { data: productFAQs } = useFAQsByProduct(selectedProduct);
  const { data: categoryFAQs } = useFAQsByCategory(categoryFilter);
  const { data: categories } = useFAQCategories();
  const { data: products } = useListProducts();

  // Mutations
  const createFAQ = useCreateFAQ();
  const updateFAQ = useMutation({
    mutationFn: async ({ faqId, faq }: { faqId: number; faq: Partial<any> }) => {
      const { data } = await axios.put(`/api/v1/faqs/${faqId}`, faq);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const deleteFAQ = useMutation({
    mutationFn: async (faqId: number) => {
      const { data } = await axios.delete(`/api/v1/faqs/${faqId}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  // Form state
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: '',
    productId: selectedProduct,
    isActive: true
  });

  // Handlers
  const handleCreateFAQ = async () => {
    try {
      await createFAQ.mutateAsync(formData);
      toast("FAQ created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        question: '',
        answer: '',
        category: '',
        productId: selectedProduct,
        isActive: true
      });
    } catch (error) {
      toast("Failed to create FAQ");
    }
  };

  const handleUpdateFAQ = async () => {
    if (!selectedFAQ) return;
    try {
      await updateFAQ.mutateAsync({
        faqId: selectedFAQ.id,
        faq: formData
      });
      toast("FAQ updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Failed to update FAQ");
    }
  };

  const handleDeleteFAQ = async (faqId: number) => {
    try {
      await deleteFAQ.mutateAsync(faqId);
      toast("FAQ deleted successfully");
    } catch (error) {
      toast("Failed to delete FAQ");
    }
  };

  function getStatusBadgeVariant(isActive: boolean) {
    return isActive ? 'default' : 'secondary';
  }

  const displayFAQs = searchQuery ? searchResults : 
                     categoryFilter ? categoryFAQs :
                     activeTab === 'product' ? productFAQs : faqs;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions and answers
          </p>
        </div>
        {(userRole === 'ADMIN' || userRole === 'TENANT_ADMIN') && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create New FAQ
          </Button>
        )}
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
                placeholder="Search FAQs..."
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
          <TabsTrigger value="all">All FAQs</TabsTrigger>
          <TabsTrigger value="product">Product FAQs</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="active">Active FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <FAQsTable 
            faqs={displayFAQs}
            isLoading={isLoading}
            userRole={userRole}
            onView={(faq) => {
              setSelectedFAQ(faq);
              setIsViewDialogOpen(true);
            }}
            onEdit={(faq) => {
              setSelectedFAQ(faq);
              setFormData({
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                productId: faq.productId,
                isActive: faq.isActive
              });
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteFAQ}
          />
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <FAQsTable 
            faqs={productFAQs}
            isLoading={false}
            userRole={userRole}
            onView={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoriesView categories={categories} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <FAQsTable 
            faqs={(displayFAQs?.content ?? displayFAQs ?? []).filter((f: any) => f.isActive)}
            isLoading={false}
            userRole={userRole}
            onView={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* FAQ Accordion View */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Accordion View</CardTitle>
          <CardDescription>
            Interactive FAQ display for users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQAccordion faqs={(displayFAQs?.content ?? displayFAQs ?? []).slice(0, 10)} />
        </CardContent>
      </Card>

      {/* Pagination */}
      {displayFAQs && displayFAQs.totalPages && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: displayFAQs.totalPages }, (_, i) => (
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
                onClick={() => setCurrentPage(Math.min(displayFAQs.totalPages - 1, currentPage + 1))}
                className={currentPage === displayFAQs.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create FAQ Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New FAQ</DialogTitle>
            <DialogDescription>
              Add a new frequently asked question and answer.
            </DialogDescription>
          </DialogHeader>
          <FAQForm 
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFAQ} disabled={createFAQ.isPending}>
              {createFAQ.isPending ? 'Creating...' : 'Create FAQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the FAQ question and answer.
            </DialogDescription>
          </DialogHeader>
          <FAQForm 
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFAQ} disabled={updateFAQ.isPending}>
              {updateFAQ.isPending ? 'Updating...' : 'Update FAQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View FAQ Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFAQ?.question}</DialogTitle>
            <DialogDescription>
              FAQ ID: #{selectedFAQ?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(selectedFAQ?.isActive)}>
                {selectedFAQ?.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">{selectedFAQ?.category}</Badge>
            </div>
            <div className="prose max-w-none">
              <p className="text-sm text-muted-foreground">Answer:</p>
              <p>{selectedFAQ?.answer}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// FAQ Form Component
const FAQForm: React.FC<{
  formData: FAQFormData;
  setFormData: (data: FAQFormData) => void;
  categories?: string[];
  products?: any[];
}> = ({ formData, setFormData, categories, products }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter the question"
        />
      </div>
      
      <div>
        <Label>Answer</Label>
        <Textarea
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          placeholder="Enter the answer..."
          className="min-h-[200px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category: string) => (
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
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
    </div>
  );
};

// FAQs Table Component
const FAQsTable: React.FC<{
  faqs?: any;
  isLoading: boolean;
  userRole: UserRole;
  onView: (faq: any) => void;
  onEdit: (faq: any) => void;
  onDelete: (faqId: number) => void;
}> = ({ faqs, isLoading, userRole, onView, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-64" />
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

  function getStatusBadgeVariant(isActive: any): "default" | "secondary" | "destructive" | "outline" | null | undefined {
    throw new Error('Function not implemented.');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQs</CardTitle>
        <CardDescription>
          {faqs?.totalElements || faqs?.length || 0} FAQs found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs?.content?.map((faq: any) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {faq.question}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{faq.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(faq.isActive)}>
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{faq.product?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(faq.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onView(faq)}>
                      View
                    </Button>
                    {(userRole === 'ADMIN' || userRole === 'TENANT_ADMIN') && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => onEdit(faq)}>
                          Edit
                        </Button>
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
                                This action cannot be undone. This will permanently delete the FAQ.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(faq.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
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

// FAQ Accordion Component
const FAQAccordion: React.FC<{ faqs?: any[] }> = ({ faqs }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No FAQs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq: any) => (
        <Collapsible key={faq.id} open={openItems.has(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="text-left font-medium">{faq.question}</span>
              <Badge variant="outline" className="ml-2">
                {faq.category}
              </Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="prose max-w-none">
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

// Categories View Component
const CategoriesView: React.FC<{ categories?: string[] }> = ({ categories }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Categories</CardTitle>
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
                  View FAQs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQManagement; 