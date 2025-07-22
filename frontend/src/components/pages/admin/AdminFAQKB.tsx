import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  isActive: boolean;
}

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  domain: string;
  logoUrl?: string;
  themeColor?: string;
}

const AdminFAQKB: React.FC = () => {
  const [tab, setTab] = useState<'faqs' | 'articles'>('faqs');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: '',
    orderIndex: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [showDelete, setShowDelete] = useState<FAQ | null>(null);
  const [editForm, setEditForm] = useState(form);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [articleCategories, setArticleCategories] = useState<string[]>([]);
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    category: '',
    published: false,
  });
  const [articleSubmitting, setArticleSubmitting] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [editArticleForm, setEditArticleForm] = useState(articleForm);
  const [editArticleSubmitting, setEditArticleSubmitting] = useState(false);
  const [editArticleError, setEditArticleError] = useState<string | null>(null);
  const [showDeleteArticle, setShowDeleteArticle] = useState<Article | null>(null);
  const [deleteArticleSubmitting, setDeleteArticleSubmitting] = useState(false);
  const [deleteArticleError, setDeleteArticleError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/v1/products/list?page=0&size=50')
      .then(res => res.json())
      .then(data => {
        const list = data.content || data.data?.content || [];
        setProducts(list);
        if (list.length > 0 && selectedProductId === null) {
          setSelectedProductId(list[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    if (tab === 'faqs') {
      setLoadingFaqs(true);
      fetch(`/api/v1/faqs/product/${selectedProductId}`)
        .then(res => res.json())
        .then(data => {
          setFaqs(data.data || []);
          setLoadingFaqs(false);
        });
      fetch(`/api/v1/faqs/product/${selectedProductId}/categories`)
        .then(res => res.json())
        .then(data => setCategories(data.data || []));
    } else if (tab === 'articles') {
      setLoadingArticles(true);
      fetch(`/api/v1/knowledge-base/articles/list?productId=${selectedProductId}&page=0&size=50&sort=createdAt,desc`)
        .then(res => res.json())
        .then(data => {
          setArticles((data.data?.content) || []);
          setLoadingArticles(false);
        });
      fetch(`/api/v1/knowledge-base/articles/categories?productId=${selectedProductId}`)
        .then(res => res.json())
        .then(data => setArticleCategories(data.data || []));
    }
  }, [tab, selectedProductId]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setForm(f => ({
      ...f,
      [name]: newValue,
    }));
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          product: { id: selectedProductId },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create FAQ');
      setShowCreate(false);
      setForm({ question: '', answer: '', category: '', orderIndex: 0, isActive: true });
      // Refresh FAQs
      setLoadingFaqs(true);
      fetch(`/api/v1/faqs/product/${selectedProductId}`)
        .then(res => res.json())
        .then(data => {
          setFaqs(data.data || []);
          setLoadingFaqs(false);
        });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (faq: FAQ) => {
    setEditFaq(faq);
    setEditForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      orderIndex: faq.orderIndex,
      isActive: faq.isActive,
    });
    setEditError(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setEditForm(f => ({
      ...f,
      [name]: newValue,
    }));
  };

  const handleEditFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFaq) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/v1/faqs/${editFaq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          product: { id: selectedProductId },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update FAQ');
      setEditFaq(null);
      // Refresh FAQs
      setLoadingFaqs(true);
      fetch(`/api/v1/faqs/product/${selectedProductId}`)
        .then(res => res.json())
        .then(data => {
          setFaqs(data.data || []);
          setLoadingFaqs(false);
        });
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteFAQ = async () => {
    if (!showDelete) return;
    setDeleteSubmitting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/v1/faqs/${showDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete FAQ');
      setShowDelete(null);
      // Refresh FAQs
      setLoadingFaqs(true);
      fetch(`/api/v1/faqs/product/${selectedProductId}`)
        .then(res => res.json())
        .then(data => {
          setFaqs(data.data || []);
          setLoadingFaqs(false);
        });
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Article form handlers
  const handleArticleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setArticleForm(f => ({
      ...f,
      [name]: newValue,
    }));
  };
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setArticleSubmitting(true);
    setArticleError(null);
    try {
      const res = await fetch('/api/v1/knowledge-base/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...articleForm,
          product: { id: selectedProductId },
        }),
      });
      const data = await res.json();
      if (!data.success && !data.id) throw new Error(data.message || 'Failed to create article');
      setShowCreateArticle(false);
      setArticleForm({ title: '', content: '', category: '', published: false });
      setLoadingArticles(true);
      fetch(`/api/v1/knowledge-base/articles/list?productId=${selectedProductId}&page=0&size=50&sort=createdAt,desc`)
        .then(res => res.json())
        .then(data => {
          setArticles((data.data?.content) || []);
          setLoadingArticles(false);
        });
    } catch (err: any) {
      setArticleError(err.message);
    } finally {
      setArticleSubmitting(false);
    }
  };
  // Edit Article
  const openEditArticle = (article: Article) => {
    setEditArticle(article);
    setEditArticleForm({
      title: article.title,
      content: article.content,
      category: article.category,
      published: article.published,
    });
    setEditArticleError(null);
  };
  const handleEditArticleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setEditArticleForm(f => ({
      ...f,
      [name]: newValue,
    }));
  };
  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArticle) return;
    setEditArticleSubmitting(true);
    setEditArticleError(null);
    try {
      const res = await fetch(`/api/v1/knowledge-base/articles/${editArticle.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editArticleForm,
          product: { id: selectedProductId },
        }),
      });
      const data = await res.json();
      if (!data.success && !data.id) throw new Error(data.message || 'Failed to update article');
      setEditArticle(null);
      setLoadingArticles(true);
      fetch(`/api/v1/knowledge-base/articles/list?productId=${selectedProductId}&page=0&size=50&sort=createdAt,desc`)
        .then(res => res.json())
        .then(data => {
          setArticles((data.data?.content) || []);
          setLoadingArticles(false);
        });
    } catch (err: any) {
      setEditArticleError(err.message);
    } finally {
      setEditArticleSubmitting(false);
    }
  };
  // Delete Article
  const handleDeleteArticle = async () => {
    if (!showDeleteArticle) return;
    setDeleteArticleSubmitting(true);
    setDeleteArticleError(null);
    try {
      const res = await fetch(`/api/v1/knowledge-base/articles/${showDeleteArticle.id}/delete`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete article');
      setShowDeleteArticle(null);
      setLoadingArticles(true);
      fetch(`/api/v1/knowledge-base/articles/list?productId=${selectedProductId}&page=0&size=50&sort=createdAt,desc`)
        .then(res => res.json())
        .then(data => {
          setArticles((data.data?.content) || []);
          setLoadingArticles(false);
        });
    } catch (err: any) {
      setDeleteArticleError(err.message);
    } finally {
      setDeleteArticleSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage FAQs & Knowledge Base</h1>
        <div className="mb-6 flex items-center gap-4">
          <label htmlFor="product-select" className="font-medium">Product:</label>
          <select
            id="product-select"
            value={selectedProductId ?? ''}
            onChange={e => setSelectedProductId(Number(e.target.value))}
            className="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 mb-8">
          <Button variant={tab === 'faqs' ? 'default' : 'secondary'} onClick={() => setTab('faqs')}>FAQs</Button>
          <Button variant={tab === 'articles' ? 'default' : 'secondary'} onClick={() => setTab('articles')}>Knowledge Base Articles</Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{tab === 'faqs' ? 'FAQs' : 'Knowledge Base Articles'}</CardTitle>
            {tab === 'faqs' && (
              <Button onClick={() => setShowCreate(true)}>+ Add FAQ</Button>
            )}
          </CardHeader>
          <CardContent>
            {tab === 'faqs' ? (
              loadingFaqs ? (
                <div className="text-muted-foreground text-center py-12">Loading FAQs...</div>
              ) : faqs.length === 0 ? (
                <div className="text-muted-foreground text-center py-12">No FAQs found for this product.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.map(faq => (
                      <TableRow key={faq.id}>
                        <TableCell>{faq.question}</TableCell>
                        <TableCell>{faq.category}</TableCell>
                        <TableCell>{faq.orderIndex}</TableCell>
                        <TableCell>{faq.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="secondary" className="mr-2" onClick={() => openEdit(faq)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => setShowDelete(faq)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : (
              loadingArticles ? (
                <div className="text-muted-foreground text-center py-12">Loading articles...</div>
              ) : articles.length === 0 ? (
                <div className="text-muted-foreground text-center py-12">No articles found for this product.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map(article => (
                      <TableRow key={article.id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.published ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{article.createdAt ? new Date(article.createdAt).toLocaleString() : '-'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="secondary" className="mr-2" onClick={() => openEditArticle(article)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => setShowDeleteArticle(article)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            )}
          </CardContent>
        </Card>
        {/* Create FAQ Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFAQ} className="space-y-4">
              <Input
                name="question"
                value={form.question}
                onChange={handleFormChange}
                placeholder="Question"
                required
              />
              <Textarea
                name="answer"
                value={form.answer}
                onChange={handleFormChange}
                placeholder="Answer"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Input
                name="orderIndex"
                type="number"
                value={form.orderIndex}
                onChange={handleFormChange}
                placeholder="Order"
                min={0}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                />
                Active
              </label>
              {error && <div className="text-destructive text-sm text-center">{error}</div>}
              <DialogFooter>
                <Button onClick={() => setShowCreate(false)} variant="secondary" type="button">Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Edit FAQ Modal */}
        <Dialog open={!!editFaq} onOpenChange={v => !v && setEditFaq(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit FAQ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditFAQ} className="space-y-4">
              <Input
                name="question"
                value={editForm.question}
                onChange={handleEditFormChange}
                placeholder="Question"
                required
              />
              <Textarea
                name="answer"
                value={editForm.answer}
                onChange={handleEditFormChange}
                placeholder="Answer"
                required
              />
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditFormChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Input
                name="orderIndex"
                type="number"
                value={editForm.orderIndex}
                onChange={handleEditFormChange}
                placeholder="Order"
                min={0}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditFormChange}
                />
                Active
              </label>
              {editError && <div className="text-destructive text-sm text-center">{editError}</div>}
              <DialogFooter>
                <Button onClick={() => setEditFaq(null)} variant="secondary" type="button">Cancel</Button>
                <Button type="submit" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete FAQ Modal */}
        <Dialog open={!!showDelete} onOpenChange={v => !v && setShowDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete FAQ</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center text-muted-foreground">
              Are you sure you want to delete this FAQ?
              <div className="mt-4 font-semibold">{showDelete?.question}</div>
              {deleteError && <div className="text-destructive text-sm text-center mt-2">{deleteError}</div>}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDelete(null)} variant="secondary" type="button">Cancel</Button>
              <Button onClick={handleDeleteFAQ} variant="destructive" disabled={deleteSubmitting}>{deleteSubmitting ? 'Deleting...' : 'Delete'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Create Article Modal */}
        <Dialog open={showCreateArticle} onOpenChange={setShowCreateArticle}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <Input
                name="title"
                value={articleForm.title}
                onChange={handleArticleFormChange}
                placeholder="Title"
                required
              />
              <Textarea
                name="content"
                value={articleForm.content}
                onChange={handleArticleFormChange}
                placeholder="Content"
                required
              />
              <select
                name="category"
                value={articleForm.category}
                onChange={handleArticleFormChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select category</option>
                {articleCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={articleForm.published}
                  onChange={handleArticleFormChange}
                />
                Published
              </label>
              {articleError && <div className="text-destructive text-sm text-center">{articleError}</div>}
              <DialogFooter>
                <Button onClick={() => setShowCreateArticle(false)} variant="secondary" type="button">Cancel</Button>
                <Button type="submit" disabled={articleSubmitting}>{articleSubmitting ? 'Saving...' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Edit Article Modal */}
        <Dialog open={!!editArticle} onOpenChange={v => !v && setEditArticle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditArticle} className="space-y-4">
              <Input
                name="title"
                value={editArticleForm.title}
                onChange={handleEditArticleFormChange}
                placeholder="Title"
                required
              />
              <Textarea
                name="content"
                value={editArticleForm.content}
                onChange={handleEditArticleFormChange}
                placeholder="Content"
                required
              />
              <select
                name="category"
                value={editArticleForm.category}
                onChange={handleEditArticleFormChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select category</option>
                {articleCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={editArticleForm.published}
                  onChange={handleEditArticleFormChange}
                />
                Published
              </label>
              {editArticleError && <div className="text-destructive text-sm text-center">{editArticleError}</div>}
              <DialogFooter>
                <Button onClick={() => setEditArticle(null)} variant="secondary" type="button">Cancel</Button>
                <Button type="submit" disabled={editArticleSubmitting}>{editArticleSubmitting ? 'Saving...' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete Article Modal */}
        <Dialog open={!!showDeleteArticle} onOpenChange={v => !v && setShowDeleteArticle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Article</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center text-muted-foreground">
              Are you sure you want to delete this article?
              <div className="mt-4 font-semibold">{showDeleteArticle?.title}</div>
              {deleteArticleError && <div className="text-destructive text-sm text-center mt-2">{deleteArticleError}</div>}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDeleteArticle(null)} variant="secondary" type="button">Cancel</Button>
              <Button onClick={handleDeleteArticle} variant="destructive" disabled={deleteArticleSubmitting}>{deleteArticleSubmitting ? 'Deleting...' : 'Delete'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminFAQKB; 