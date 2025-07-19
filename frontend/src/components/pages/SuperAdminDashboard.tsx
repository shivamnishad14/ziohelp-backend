import React, { useEffect, useState } from 'react';
import { userAPI, ticketAPI } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const SuperAdminDashboard: React.FC = () => {
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);  
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');

  // Analytics placeholders
  const [ticketStats, setTicketStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allTickets, setAllTickets] = useState<any[]>([]);

  const [userSearch, setUserSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  const fetchPendingAdmins = async () => {
    setLoadingAdmins(true);
    setAdminError('');
    try {
      const res = await userAPI.getPendingAdmins();
      setPendingAdmins(res.data.data || []);
    } catch (err) {
      setAdminError('Failed to load pending admins.');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleApprove = async (id: string) => {
    setAdminMessage('');
    setAdminError('');
    try {
      await userAPI.approveAdmin(id);
      setAdminMessage('Admin approved!');
      fetchPendingAdmins();
    } catch (err) {
      setAdminError('Failed to approve admin.');
    }
  };

  const handleReject = async (id: string) => {
    setAdminMessage('');
    setAdminError('');
    try {
      await userAPI.rejectAdmin(id);
      setAdminMessage('Admin rejected.');
      fetchPendingAdmins();
    } catch (err) {
      setAdminError('Failed to reject admin.');
    }
  };

  // Analytics
  const fetchAnalytics = async () => {
    try {
      // Fetch all tickets (could be paginated in real app)
      const ticketsRes = await ticketAPI.getAll('1');
      const tickets = ticketsRes.data.content || [];
      setTicketStats({
        total: tickets.length,
        open: tickets.filter((t: any) => t.status === 'open' || t.status === 'OPEN').length,
        inProgress: tickets.filter((t: any) => t.status === 'in_progress' || t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter((t: any) => t.status === 'resolved' || t.status === 'RESOLVED').length,
        closed: tickets.filter((t: any) => t.status === 'closed' || t.status === 'CLOSED').length,
      });
      setRecentTickets(tickets.slice(0, 5));
      setAllTickets(tickets);
      // Fetch all users
      const usersRes = await userAPI.getAll('1');
      const users = usersRes.data.content || [];
      setUserStats({ total: users.length });
      setAllUsers(users);
    } catch {}
  };

  // Ticket volume over time (by day)
  const ticketVolumeData = (() => {
    if (!allTickets.length) return [];
    const counts: Record<string, number> = {};
    allTickets.forEach(t => {
      const d = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Unknown';
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
  })();
  // User growth over time (by day)
  const userGrowthData = (() => {
    if (!allUsers.length) return [];
    const counts: Record<string, number> = {};
    allUsers.forEach(u => {
      const d = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown';
      counts[d] = (counts[d] || 0) + 1;
    });
    // Cumulative sum
    let total = 0;
    return Object.entries(counts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => {
        total += count;
        return [date, total];
      });
  })();

  // Filtered users and tickets
  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredTickets = allTickets.filter(t =>
    (t.subject || t.title || '').toLowerCase().includes(ticketSearch.toLowerCase()) ||
    (t.user?.email || '').toLowerCase().includes(ticketSearch.toLowerCase())
  );

  useEffect(() => {
    fetchPendingAdmins();
    fetchAnalytics();
  }, []);

  // Export CSV utility
  function exportCSV(data: any[], filename: string) {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(',')].concat(
      data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  // Toggle user active status
  async function handleToggleActive(user: any) {
    try {
      await userAPI.toggleActive(user.id);
      fetchAnalytics();
    } catch {
      alert('Failed to update user status');
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-lg font-semibold">Total Tickets</div>
          <div className="text-2xl font-bold">{ticketStats ? ticketStats.total : '--'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-lg font-semibold">Total Users</div>
          <div className="text-2xl font-bold">{userStats ? userStats.total : '--'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-lg font-semibold">Pending Admins</div>
          <div className="text-2xl font-bold">{pendingAdmins.length}</div>
        </div>
      </div>
      {/* Ticket Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded shadow border text-center">
          <div className="text-sm text-blue-700 font-semibold">Open</div>
          <div className="text-xl font-bold">{ticketStats ? ticketStats.open : '--'}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow border text-center">
          <div className="text-sm text-yellow-700 font-semibold">In Progress</div>
          <div className="text-xl font-bold">{ticketStats ? ticketStats.inProgress : '--'}</div>
        </div>
        <div className="bg-green-50 p-4 rounded shadow border text-center">
          <div className="text-sm text-green-700 font-semibold">Resolved</div>
          <div className="text-xl font-bold">{ticketStats ? ticketStats.resolved : '--'}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow border text-center">
          <div className="text-sm text-gray-700 font-semibold">Closed</div>
          <div className="text-xl font-bold">{ticketStats ? ticketStats.closed : '--'}</div>
        </div>
      </div>
      {/* Ticket Status Bar Chart */}
      {ticketStats && (
        <div className="bg-white p-4 rounded shadow border mb-8">
          <h3 className="font-semibold mb-2">Ticket Status Breakdown (Bar Chart)</h3>
          <svg width="100%" height="60">
            {['open', 'inProgress', 'resolved', 'closed'].map((key, i) => {
              const colors = ['#3b82f6', '#f59e42', '#22c55e', '#6b7280'];
              const value = ticketStats[key] || 0;
              return (
                <rect
                  key={key}
                  x={i * 60 + 10}
                  y={60 - value * 5}
                  width={40}
                  height={value * 5}
                  fill={colors[i]}
                />
              );
            })}
            {/* Labels */}
            {['Open', 'In Progress', 'Resolved', 'Closed'].map((label, i) => (
              <text
                key={label}
                x={i * 60 + 30}
                y={58}
                textAnchor="middle"
                fontSize="12"
                fill="#333"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>
      )}
      {/* Recent Tickets Section */}
      <div className="bg-white p-6 rounded shadow border mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
        {recentTickets.length === 0 ? (
          <div className="text-gray-500">No recent tickets.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Priority</th>
                <th className="border px-2 py-1">Created</th>
                <th className="border px-2 py-1">User Email</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="border px-2 py-1">{ticket.subject || ticket.title}</td>
                  <td className="border px-2 py-1">{ticket.status}</td>
                  <td className="border px-2 py-1">{ticket.priority}</td>
                  <td className="border px-2 py-1">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="border px-2 py-1">{ticket.user?.email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pending Admin Approval Section */}
      <div className="bg-white p-6 rounded shadow border mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Admin Approvals</h2>
        {adminError && <div className="text-red-600 mb-2">{adminError}</div>}
        {adminMessage && <div className="text-green-600 mb-2">{adminMessage}</div>}
        {loadingAdmins ? (
          <div>Loading...</div>
        ) : pendingAdmins.length === 0 ? (
          <div className="text-gray-500">No pending admins.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdmins.map(admin => (
                <tr key={admin.id}>
                  <td className="border px-2 py-1">{admin.name}</td>
                  <td className="border px-2 py-1">{admin.email}</td>
                  <td className="border px-2 py-1">
                    <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={() => handleApprove(admin.id)}>Approve</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject(admin.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Ticket Volume Over Time Chart (Recharts) */}
      {ticketVolumeData.length > 1 && (
        <div className="bg-white p-4 rounded shadow border mb-8">
          <h3 className="font-semibold mb-2">Ticket Volume Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ticketVolumeData.map(([date, count]) => ({ date, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* User Growth Over Time Chart (Recharts) */}
      {userGrowthData.length > 1 && (
        <div className="bg-white p-4 rounded shadow border mb-8">
          <h3 className="font-semibold mb-2">User Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userGrowthData.map(([date, count]) => ({ date, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Ticket Status Breakdown (Bar Chart with Recharts) */}
      {ticketStats && (
        <div className="bg-white p-4 rounded shadow border mb-8">
          <h3 className="font-semibold mb-2">Ticket Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { status: 'Open', value: ticketStats.open },
              { status: 'In Progress', value: ticketStats.inProgress },
              { status: 'Resolved', value: ticketStats.resolved },
              { status: 'Closed', value: ticketStats.closed },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* View All Users Table with Search */}
      <div className="bg-white p-6 rounded shadow border mb-8">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <input
          className="mb-2 border rounded px-2 py-1 w-full"
          placeholder="Search users by name or email..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
        <button className="mb-2 bg-blue-600 text-white px-3 py-1 rounded ml-2" onClick={() => exportCSV(filteredUsers, 'users.csv')}>Export Users CSV</button>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Active</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.role?.name || '-'}</td>
                <td className="border px-2 py-1">{user.status}</td>
                <td className="border px-2 py-1">{user.isActive ? 'Yes' : 'No'}</td>
                <td className="border px-2 py-1">
                  <button
                    className={`px-2 py-1 rounded ${user.isActive ? 'bg-red-600' : 'bg-green-600'} text-white`}
                    onClick={() => handleToggleActive(user)}
                  >
                    {user.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* View All Tickets Table with Search */}
      <div className="bg-white p-6 rounded shadow border mb-8">
        <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
        <input
          className="mb-2 border rounded px-2 py-1 w-full"
          placeholder="Search tickets by subject or user email..."
          value={ticketSearch}
          onChange={e => setTicketSearch(e.target.value)}
        />
        <button className="mb-2 bg-blue-600 text-white px-3 py-1 rounded ml-2" onClick={() => exportCSV(filteredTickets, 'tickets.csv')}>Export Tickets CSV</button>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Subject</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Priority</th>
              <th className="border px-2 py-1">Created</th>
              <th className="border px-2 py-1">User Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="border px-2 py-1">{ticket.subject || ticket.title}</td>
                <td className="border px-2 py-1">{ticket.status}</td>
                <td className="border px-2 py-1">{ticket.priority}</td>
                <td className="border px-2 py-1">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}</td>
                <td className="border px-2 py-1">{ticket.user?.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 