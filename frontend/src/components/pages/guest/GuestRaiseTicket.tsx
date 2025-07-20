import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

const GuestRaiseTicket: React.FC = () => {
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [ticketToken, setTicketToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setTicketToken('');
    try {
      const response = await fetch('/api/tickets/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        setTicketToken(result.data?.guestToken || '');
        setForm({ guestName: '', guestEmail: '', subject: '', description: '', priority: 'MEDIUM', category: 'GENERAL' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit ticket');
      }
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Raise a Support Ticket (Guest)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="guestName" value={form.guestName} onChange={handleChange} placeholder="Your Name" required />
              <Input name="guestEmail" type="email" value={form.guestEmail} onChange={handleChange} placeholder="Your Email" required />
              <Input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your issue..." required />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded px-2 py-1">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-2 py-1">
                    <option value="GENERAL">General</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BILLING">Billing</option>
                    <option value="FEATURE_REQUEST">Feature Request</option>
                    <option value="BUG_REPORT">Bug Report</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
              {success && ticketToken && (
                <div className="mt-4 text-green-700 text-sm">
                  Ticket submitted! Your tracking token: <code className="bg-gray-100 px-2 py-1 rounded">{ticketToken}</code>
                </div>
              )}
              {error && (
                <div className="mt-4 text-red-600 text-sm">{error}</div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestRaiseTicket; 