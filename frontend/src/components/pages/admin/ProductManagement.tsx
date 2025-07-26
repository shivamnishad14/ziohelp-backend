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
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useListProducts, 
  useGetProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useUpdateProductStatus,
  useSearchProducts
} from '@/hooks/api/useProducts';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFormData {
  name: string;
  description: string;
  version: string;
  status: string;
  category: string;
  isActive: boolean;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'default';
    case 'INACTIVE': return 'secondary';
    case 'MAINTENANCE': return 'destructive';
    case 'DEPRECATED': return 'outline';
    default: return 'outline';
  }
};

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Queries
  const { data: products, isLoading } = useListProducts({
    page: currentPage,
    size: pageSize
  });

  const { data: searchResults } = useSearchProducts({
    query: searchQuery,
    page: currentPage,
    size: pageSize
  });

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStatus = useUpdateProductStatus();

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    version: '1.0.0',
    status: 'ACTIVE',
    category: 'GENERAL',
    isActive: true
  });

  // Handlers
  const handleCreateProduct = async () => {
    try {
      await createProduct.mutateAsync(formData);
      toast("Product created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        version: '1.0.0',
        status: 'ACTIVE',
        category: 'GENERAL',
        isActive: true
      });
    } catch (error) {
      toast("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    try {
      await updateProduct.mutateAsync({
        productId: selectedProduct.id,
        product: formData
      });
      toast("Product updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Failed to update product");
    }
  };

  const handleUpdateStatus = async (productId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({
        productId,
        status
      });
      toast("Product status updated successfully");
    } catch (error) {
      toast("Failed to update product status");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast("Product deleted successfully");
    } catch (error) {
      toast("Failed to delete product");
    }
  };

  const displayProducts = searchQuery || statusFilter ? searchResults : products;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage system products and configurations
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Product
        </Button>
      </div>

      <Separator />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="DEPRECATED">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
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
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active Products</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Products</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ProductsTable 
            products={displayProducts}
            isLoading={isLoading}
            onView={(product) => {
              setSelectedProduct(product);
              setIsViewDialogOpen(true);
            }}
            onEdit={(product) => {
              setSelectedProduct(product);
              setFormData({
                name: product.name,
                description: product.description,
                version: product.version,
                status: product.status,
                category: product.category,
                isActive: product.isActive
              });
              setIsEditDialogOpen(true);
            }}
            onStatus={handleUpdateStatus}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <ProductsTable 
            products={displayProducts?.content?.filter((p: any) => p.status === 'ACTIVE')}
            isLoading={false}
            onView={() => {}}
            onEdit={() => {}}
            onStatus={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <ProductsTable 
            products={displayProducts?.content?.filter((p: any) => p.status === 'INACTIVE')}
            isLoading={false}
            onView={() => {}}
            onEdit={() => {}}
            onStatus={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <ProductsTable 
            products={displayProducts?.content?.filter((p: any) => p.status === 'MAINTENANCE')}
            isLoading={false}
            onView={() => {}}
            onEdit={() => {}}
            onStatus={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <ProductsCardView 
            products={displayProducts}
            onView={(product) => {
              setSelectedProduct(product);
              setIsViewDialogOpen(true);
            }}
            onEdit={(product) => {
              setSelectedProduct(product);
              setFormData({
                name: product.name,
                description: product.description,
                version: product.version,
                status: product.status,
                category: product.category,
                isActive: product.isActive
              });
              setIsEditDialogOpen(true);
            }}
            onStatus={handleUpdateStatus}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {displayProducts && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: displayProducts.totalPages }, (_, i) => (
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
                onClick={() => setCurrentPage(Math.min(displayProducts.totalPages - 1, currentPage + 1))}
                className={currentPage === displayProducts.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to the system.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            formData={formData}
            setFormData={setFormData}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct} disabled={createProduct.isPending}>
              {createProduct.isPending ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            formData={formData}
            setFormData={setFormData}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} disabled={updateProduct.isPending}>
              {updateProduct.isPending ? 'Updating...' : 'Update Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Product ID: #{selectedProduct?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(selectedProduct?.status)}>
                {selectedProduct?.status}
              </Badge>
              <Badge variant="outline">{selectedProduct?.category}</Badge>
              <Badge variant="outline">v{selectedProduct?.version}</Badge>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{selectedProduct?.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={selectedProduct?.isActive} disabled />
              <Label>Active</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Form Component
const ProductForm: React.FC<{
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
}> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
        />
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description..."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Version</Label>
          <Input
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            placeholder="1.0.0"
          />
        </div>
        
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              <SelectItem value="DEPRECATED">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="SOFTWARE">Software</SelectItem>
            <SelectItem value="HARDWARE">Hardware</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="API">API</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Active</Label>
      </div>
    </div>
  );
};

// Products Table Component
const ProductsTable: React.FC<{
  products?: any;
  isLoading: boolean;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onStatus: (productId: number, status: string) => void;
  onDelete: (productId: number) => void;
}> = ({ products, isLoading, onView, onEdit, onStatus, onDelete }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-32" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          {products?.totalElements || products?.length || 0} products found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.content?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>v{product.version}</TableCell>
                <TableCell>
                  <Switch checked={product.isActive} disabled />
                </TableCell>
                <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onView(product)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                      Edit
                    </Button>
                    <Select value={product.status} onValueChange={(value) => onStatus(product.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="DEPRECATED">Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
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
                            This action cannot be undone. This will permanently delete the product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

// Products Card View Component
const ProductsCardView: React.FC<{
  products?: any;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onStatus: (productId: number, status: string) => void;
  onDelete: (productId: number) => void;
}> = ({ products, onView, onEdit, onStatus, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.content?.map((product: any) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant={getStatusBadgeVariant(product.status)}>
                {product.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version:</span>
                <span>v{product.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active:</span>
                <Switch checked={product.isActive} disabled />
              </div>
              <Separator />
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onView(product)}>
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
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
                        This action cannot be undone. This will permanently delete the product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(product.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductManagement; 