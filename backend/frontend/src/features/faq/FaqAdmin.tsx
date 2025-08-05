
import { useFaqs, useCreateFaq, useDeleteFaq } from '../../hooks/FaqQueries';
import { useState } from 'react';

export default function FaqAdmin() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('question');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<any>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: '', isPublished: true });
  const [notification, setNotification] = useState<string | null>(null);

  const { data, isLoading } = useFaqs({ search, page, size, sortBy, sortDir });
  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();

  const handleOpenCreate = () => {
    setEditFaq(null);
    setForm({ question: '', answer: '', category: '', isPublished: true });
    setModalOpen(true);
  };
  const handleOpenEdit = (faq: any) => {
    setEditFaq(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      isPublished: faq.isPublished,
    });
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditFaq(null);
    setForm({ question: '', answer: '', category: '', isPublished: true });
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      setNotification('Question and answer are required');
      return;
    }
    if (editFaq) {
      // TODO: implement updateFaq mutation
      setNotification('Edit not implemented');
    } else {
      createFaq.mutate(form, {
        onSuccess: () => {
          setNotification('FAQ created');
          handleCloseModal();
        },
        onError: (err: any) => setNotification(err?.message || 'Create failed'),
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FAQs</h1>
      <div className="flex gap-2 mb-4 items-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleOpenCreate}>Add FAQ</button>
        <input className="border p-2" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }} className="border p-2">
          {[10, 20, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2">
          <option value="question">Question</option>
          <option value="createdAt">Created</option>
        </select>
        <select value={sortDir} onChange={e => setSortDir(e.target.value)} className="border p-2">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      {notification && <div className="mb-2 text-green-600 bg-green-50 border border-green-200 rounded p-2">{notification}</div>}
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Question</th>
              <th className="p-2 border">Answer</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Published</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((faq: any) => (
              <tr key={faq.id} className="border-b">
                <td className="p-2 border">{faq.question}</td>
                <td className="p-2 border">{faq.answer}</td>
                <td className="p-2 border">{faq.category}</td>
                <td className="p-2 border">{faq.isPublished ? 'Yes' : 'No'}</td>
                <td className="p-2 border flex gap-2">
                  <button className="text-blue-600" onClick={() => handleOpenEdit(faq)}>Edit</button>
                  <button className="text-red-500" onClick={() => deleteFaq.mutate(faq.id, { onSuccess: () => setNotification('FAQ deleted') })}>Delete</button>
                  {/* TODO: Add publish/unpublish button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Pagination controls */}
      <div className="flex gap-2 mt-2 items-center">
        <button className="border px-2 py-1" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page + 1} of {data?.totalPages || 1}</span>
        <button className="border px-2 py-1" disabled={page + 1 >= (data?.totalPages || 1)} onClick={() => setPage(page + 1)}>Next</button>
        <span>Total: {data?.totalElements || 0}</span>
      </div>

      {/* Modal for create/edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleCloseModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{editFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                className="border p-2 rounded"
                name="question"
                placeholder="Question"
                value={form.question}
                onChange={handleFormChange}
                required
              />
              <input
                className="border p-2 rounded"
                name="answer"
                placeholder="Answer"
                value={form.answer}
                onChange={handleFormChange}
                required
              />
              <input
                className="border p-2 rounded"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleFormChange}
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleFormChange} /> Published
              </label>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                {editFaq ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
