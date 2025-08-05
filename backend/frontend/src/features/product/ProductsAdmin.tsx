import { useProducts, useCreateProduct, useDeleteProduct } from '../../hooks/ProductQueries';
import { useState } from 'react';

export default function ProductsAdmin() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [newProduct, setNewProduct] = useState({ name: '' });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <form onSubmit={e => { e.preventDefault(); createProduct.mutate(newProduct); }} className="mb-4">
        <input className="border p-2 mr-2" value={newProduct.name} onChange={e => setNewProduct({ name: e.target.value })} placeholder="Product name" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {products?.content?.map((product: any) => (
            <li key={product.id} className="flex items-center justify-between border-b py-2">
              <span>{product.name}</span>
              <button className="text-red-500" onClick={() => deleteProduct.mutate(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
