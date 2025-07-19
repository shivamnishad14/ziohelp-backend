import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Product } from '../../types';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi';

// Form state interface
interface ProductFormData {
  name: string;
  description: string;
  supportEmail: string;
  responseTime: number;
  resolutionTime: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'inactive':
      return 'text-gray-600 bg-gray-100';
    case 'maintenance':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    supportEmail: '',
    responseTime: 4,
    resolutionTime: 24,
  });

  // React Query hooks
  const { data: productsData, isLoading, error } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = productsData?.data?.content || [];
  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      domain: formData.name.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: '',
      themeColor: '#3B82F6',
    };

    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, product: productData });
    } else {
      createProductMutation.mutate(productData as any);
    }
    
    setIsDialogOpen(false);
    setFormData({ name: '', description: '', supportEmail: '', responseTime: 4, resolutionTime: 24 });
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      supportEmail: product.supportEmail,
      responseTime: product.sla?.responseTime ?? 4,
      resolutionTime: product.sla?.resolutionTime ?? 24,
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading products: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Manage your products and their support settings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedProduct(null);
              setFormData({ name: '', description: '', supportEmail: '', responseTime: 4, resolutionTime: 24 });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <Input 
                  placeholder="Enter product name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Support Email</label>
                <Input 
                  type="email" 
                  placeholder="support@example.com" 
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Time (hours)</label>
                  <Input 
                    type="number" 
                    placeholder="4" 
                    value={formData.responseTime}
                    onChange={(e) => setFormData({ ...formData, responseTime: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resolution Time (hours)</label>
                  <Input 
                    type="number" 
                    placeholder="24" 
                    value={formData.resolutionTime}
                    onChange={(e) => setFormData({ ...formData, resolutionTime: parseInt(e.target.value) })}
                    required
                  />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                  {createProductMutation.isPending || updateProductMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {selectedProduct ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Products ({filteredProducts.length})
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Support Email</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProducts.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {product.supportEmail}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      <div>Response: {product.sla?.responseTime ?? '-'}h</div>
                      <div>Resolution: {product.sla?.resolutionTime ?? '-'}h</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Product details dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Support Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.supportEmail}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SLA Settings</label>
                <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Response Time:</span>
                    <span className="ml-2 font-medium">{selectedProduct.sla?.responseTime ?? '-'} hours</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Resolution Time:</span>
                    <span className="ml-2 font-medium">{selectedProduct.sla?.resolutionTime ?? '-'} hours</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 