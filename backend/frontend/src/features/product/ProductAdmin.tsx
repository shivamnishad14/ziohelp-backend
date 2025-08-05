
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../../services/apiService';
import { Button } from '../../components/ui/button';
// TODO: Move Product type to a shared types file if not already
type Product = {
  id: number;
  name: string;
  domain: string;
  version?: string;
  isActive: boolean;
  [key: string]: any;
};


const ProductAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filtering and pagination state
  const [filter, setFilter] = useState({ name: '', status: '', category: '' });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  // Fetch products with TanStack Query (v5 object form)
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filter, page, size],
    queryFn: async () => {
      const params: any = {
        page,
        size,
        name: filter.name || undefined,
        status: filter.status || undefined,
        category: filter.category || undefined,
      };
      const res = await productsAPI.getAll(params);
      const result = res.data;
      if (result && Array.isArray(result.content)) return result;
      if (Array.isArray(result)) return { content: result, totalPages: 1, totalElements: result.length };
      return { content: [], totalPages: 1, totalElements: 0 };
    },
  });
  // Soft delete/restore mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await productsAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotification('Product deleted');
    },
    onError: (err: any) => setNotification(err?.message || 'Delete failed'),
  });

  // Filtering handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(0); // Reset to first page on filter change
  };
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  // Mutations for create/update
  const createMutation = useMutation({
    mutationFn: async (product: Product) => {
      await productsAPI.create(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotification('Product created successfully');
      setModalOpen(false);
    },
    onError: (err: any) => setNotification(err?.message || 'Create failed'),
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: number; product: Product }) => {
      await productsAPI.update(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotification('Product updated successfully');
      setModalOpen(false);
    },
    onError: (err: any) => setNotification(err?.message || 'Update failed'),
  });

  // Modal form state
  const [form, setForm] = useState<Partial<Product>>({});
  const handleOpenCreate = () => {
    setEditProduct(null);
    setForm({});
    setModalOpen(true);
  };
  const handleOpenEdit = (product: Product) => {
    setEditProduct(product);
    setForm(product);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({});
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.domain) {
      setNotification('Name and domain are required');
      return;
    }
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, product: form as Product });
    } else {
      createMutation.mutate(form as Product);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <Button onClick={handleOpenCreate}>Add Product</Button>
        <input
          className="border p-1 rounded"
          name="name"
          placeholder="Filter by name"
          value={filter.name}
          onChange={handleFilterChange}
        />
        <input
          className="border p-1 rounded"
          name="category"
          placeholder="Filter by category"
          value={filter.category}
          onChange={handleFilterChange}
        />
        <select name="status" value={filter.status} onChange={handleFilterChange} className="border p-1 rounded">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select value={size} onChange={handleSizeChange} className="border p-1 rounded">
          {[10, 20, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      {notification && (
        <div className="mb-2 text-green-600 bg-green-50 border border-green-200 rounded p-2">{notification}</div>
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{(error as any)?.message || 'Failed to load products'}</div>}
      {!isLoading && !error && (
        <>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Domain</th>
                <th className="p-2 border">Version</th>
                <th className="p-2 border">Active</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && Array.isArray(data.content) && data.content.map((product: Product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.domain}</td>
                  <td className="p-2 border">{product.version}</td>
                  <td className="p-2 border">{product.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-2 border flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(product)}>Edit</Button>
                    {product.isActive ? (
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(product.id)}>Delete</Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>Restore</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex gap-2 mt-2 items-center">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => handlePageChange(page - 1)}>Prev</Button>
            <span>Page {page + 1} of {data && 'totalPages' in data ? data.totalPages : 1}</span>
            <Button size="sm" variant="outline" disabled={page + 1 >= ((data && 'totalPages' in data ? data.totalPages : 1))} onClick={() => handlePageChange(page + 1)}>Next</Button>
            <span>Total: {data && 'totalElements' in data ? data.totalElements : 0}</span>
          </div>
        </>
      )}

      {/* Modal for create/edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleCloseModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                className="border p-2 rounded"
                name="name"
                placeholder="Name"
                value={form.name || ''}
                onChange={handleFormChange}
                required
              />
              <input
                className="border p-2 rounded"
                name="domain"
                placeholder="Domain"
                value={form.domain || ''}
                onChange={handleFormChange}
                required
              />
              <input
                className="border p-2 rounded"
                name="version"
                placeholder="Version"
                value={form.version || ''}
                onChange={handleFormChange}
              />
              <Button type="submit" className="mt-2" disabled={createMutation.isPending || updateMutation.isPending}>
                {editProduct ? 'Update' : 'Create'}
              </Button>
            </form>
            {(createMutation.isPending || updateMutation.isPending) && <div className="mt-2">Saving...</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
