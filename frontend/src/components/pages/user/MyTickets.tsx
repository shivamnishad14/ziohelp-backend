import React, { useEffect, useState } from 'react';
import { ticketAPI } from '../../../services/api';


const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [updating, setUpdating] = useState(false);

  // TODO: Make productId dynamic instead of hardcoded '1'
  const productId = 1; // should be a number for ticketAPI
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo.id;

  const fetchMyTickets = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all tickets and filter by assignedTo
      const res = await ticketAPI.getTickets({ productId });
      const myTickets = res.data.content?.filter((ticket: any) => 
        ticket.assignedTo?.id === userId
      ) || [];
      setTickets(myTickets);
    } catch (err) {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
    // eslint-disable-next-line
  }, []);

  const handleStatusUpdate = async (ticketId: number, newStatus: string) => {
    setUpdating(true);
    setError('');
    setMessage('');
    try {
      await ticketAPI.updateStatus(ticketId, newStatus);
      setMessage('Ticket status updated successfully!');
      fetchMyTickets();
    } catch (err) {
      setError('Failed to update ticket status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (ticketId: number) => {
    if (!newComment.trim()) return;
    setUpdating(true);
    setError('');
    setMessage('');
    try {
      await ticketAPI.addComment(ticketId, newComment);
      setMessage('Comment added successfully!');
      setNewComment('');
      fetchMyTickets();
    } catch (err) {
      setError('Failed to add comment.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Assigned Tickets</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-600 mb-2">{message}</div>}
      
      {loading ? (
        <div>Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tickets assigned to you yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{ticket.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                    disabled={updating}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    className="text-blue-600 underline text-sm"
                    onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                  >
                    {selectedTicket?.id === ticket.id ? 'Hide Comments' : 'View Comments'}
                  </button>
                </div>
              </div>

              {selectedTicket?.id === ticket.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Comments</h4>
                  {ticket.comments?.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {ticket.comments.map((comment: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <div className="text-sm text-gray-600">
                            {comment.createdBy?.name || 'Unknown'} - {new Date(comment.createdAt).toLocaleString()}
                          </div>
                          <div className="text-sm">{comment.content}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-3">No comments yet.</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(ticket.id)}
                    />
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleAddComment(ticket.id)}
                      disabled={updating || !newComment.trim()}
                    >
                      {updating ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets; 