import { useArticles, useCreateArticle, useDeleteArticle } from '../../hooks/KnowledgeBase';
import { useProducts } from '../../hooks/ProductQueries';
import { useQuery } from '@tanstack/react-query';
import { articleAPI } from '../../services/apiService';
import { useState } from 'react';

export default function ArticlesAdmin() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newArticle, setNewArticle] = useState({ title: '', content: '', productId: '', category: '' });

  // Fetch categories for selected product
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['article-categories', selectedProduct],
    queryFn: () => selectedProduct ? articleAPI.getProductCategories(selectedProduct).then(res => res.data) : [],
    enabled: !!selectedProduct
  });

  // Fetch articles for selected product and category
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', selectedProduct, selectedCategory],
    queryFn: () => {
      if (!selectedProduct) return { content: [] };
      if (selectedCategory) {
        return articleAPI.getByProductAndCategory(selectedProduct, selectedCategory).then(res => ({ content: res.data }));
      }
      return articleAPI.getByProduct(selectedProduct).then(res => res.data);
    },
    enabled: !!selectedProduct
  });

  const createArticle = useCreateArticle();
  const deleteArticle = useDeleteArticle();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base Articles</h1>
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2"
          value={selectedProduct ?? ''}
          onChange={e => {
            setSelectedProduct(e.target.value ? Number(e.target.value) : null);
            setSelectedCategory('');
          }}
        >
          <option value="">Select Product</option>
          {products?.content?.map((product: any) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <select
          className="border p-2"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          disabled={!selectedProduct || loadingCategories}
        >
          <option value="">All Categories</option>
          {categories?.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!selectedProduct) return;
          createArticle.mutate({ ...newArticle, productId: selectedProduct, category: selectedCategory });
          setNewArticle({ title: '', content: '', productId: '', category: '' });
        }}
        className="mb-4"
      >
        <input className="border p-2 mr-2" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} placeholder="Title" />
        <input className="border p-2 mr-2" value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })} placeholder="Content" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={!selectedProduct}>Add</button>
      </form>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {articles?.content?.map((article: any) => (
            <li key={article.id} className="flex items-center justify-between border-b py-2">
              <span>{article.title}</span>
              <button className="text-red-500" onClick={() => deleteArticle.mutate(article.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
