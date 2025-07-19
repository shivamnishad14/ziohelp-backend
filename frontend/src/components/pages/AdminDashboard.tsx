import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';

const PRODUCT_ID = 1; // TODO: Make this dynamic if needed

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: { name: string } | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: { name: string } | null;
  status: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [totalTickets, setTotalTickets] = useState<number | null>(null);
  const [openTickets, setOpenTickets] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoadingUsers(true);
    fetch(`/api/v1/users/list?productId=${PRODUCT_ID}&size=20&page=0`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.content || []);
        setLoadingUsers(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/v1/tickets/count?productId=${PRODUCT_ID}`)
      .then(res => res.json())
      .then(data => setTotalTickets(data.data));
    fetch(`/api/v1/tickets/count?productId=${PRODUCT_ID}&status=OPEN`)
      .then(res => res.json())
      .then(data => setOpenTickets(data.data));
    fetch(`/api/v1/users/count?productId=${PRODUCT_ID}`)
      .then(res => res.json())
      .then(data => setTotalUsers(data.data));
    fetch(`/api/v1/tickets/list?productId=${PRODUCT_ID}&size=10&page=0`)
      .then(res => res.json())
      .then(data => {
        setTickets(data.content || []);
        setLoadingTickets(false);
      });
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (userId: number) => {
    await fetch(`/api/v1/users/toggle-active/${userId}`, { method: 'POST' });
    fetchUsers();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex justify-end mb-6">
          <Button asChild>
            <a href="/admin-faq-kb">Manage FAQs & Knowledge Base</a>
          </Button>
        </div>
        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets !== null ? totalTickets : '--'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets !== null ? openTickets : '--'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers !== null ? totalUsers : '--'}</div>
            </CardContent>
          </Card>
        </div>
        {/* Ticket Management Table */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Ticket Management</h2>
          <div className="bg-card dark:bg-background rounded shadow p-4 overflow-x-auto">
            {loadingTickets ? (
              <div className="text-gray-500 text-center py-8">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No tickets found for this product.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted dark:bg-muted/50">
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{ticket.subject}</td>
                      <td className="px-4 py-2">{ticket.status}</td>
                      <td className="px-4 py-2">{ticket.priority}</td>
                      <td className="px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">{ticket.assignedTo?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* User Management Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="bg-card dark:bg-background rounded shadow p-4 overflow-x-auto">
            {loadingUsers ? (
              <div className="text-gray-500 text-center py-8">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No users found for this product.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted dark:bg-muted/50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Active</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{user.name || '-'}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role?.name || '-'}</td>
                      <td className="px-4 py-2">{user.status}</td>
                      <td className="px-4 py-2">{user.isActive ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant={user.isActive ? 'secondary' : 'default'} onClick={() => handleToggleActive(user.id)}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 