// import React, { useEffect, useState } from 'react';
// import { 
//   Package, 
//   Ticket, 
//   Users, 
//   TrendingUp, 
//   AlertCircle, 
//   Clock,
//   BarChart3
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

// const stats = [
//   {
//     title: 'Total Products',
//     value: '12',
//     change: '+2',
//     changeType: 'positive' as const,
//     icon: Package,
//   },
//   {
//     title: 'Active Tickets',
//     value: '156',
//     change: '+12',
//     changeType: 'negative' as const,
//     icon: Ticket,
//   },
//   {
//     title: 'Total Users',
//     value: '2,847',
//     change: '+89',
//     changeType: 'positive' as const,
//     icon: Users,
//   },
//   {
//     title: 'Avg Response Time',
//     value: '2.4h',
//     change: '-0.3h',
//     changeType: 'positive' as const,
//     icon: Clock,
//   },
// ];

// const recentTickets = [
//   {
//     id: 'T-001',
//     title: 'Login issue with mobile app',
//     product: 'Mobile App',
//     priority: 'high' as const,
//     status: 'open' as const,
//     createdAt: '2 hours ago',
//   },
//   {
//     id: 'T-002',
//     title: 'Payment gateway not working',
//     product: 'E-commerce Platform',
//     priority: 'urgent' as const,
//     status: 'in_progress' as const,
//     createdAt: '4 hours ago',
//   },
//   {
//     id: 'T-003',
//     title: 'Dashboard loading slowly',
//     product: 'Analytics Dashboard',
//     priority: 'medium' as const,
//     status: 'resolved' as const,
//     createdAt: '1 day ago',
//   },
// ];

// const getPriorityColor = (priority: string) => {
//   switch (priority) {
//     case 'urgent':
//       return 'text-red-600 bg-red-100';
//     case 'high':
//       return 'text-orange-600 bg-orange-100';
//     case 'medium':
//       return 'text-yellow-600 bg-yellow-100';
//     case 'low':
//       return 'text-green-600 bg-green-100';
//     default:
//       return 'text-gray-600 bg-gray-100';
//   }
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'open':
//       return 'text-blue-600 bg-blue-100';
//     case 'in_progress':
//       return 'text-yellow-600 bg-yellow-100';
//     case 'resolved':
//       return 'text-green-600 bg-green-100';
//     case 'closed':
//       return 'text-gray-600 bg-gray-100';
//     default:
//       return 'text-gray-600 bg-gray-100';
//   }
// };

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Simulate loading
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
//   if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

//   return (
//     <div className="space-y-6">
//       {/* Page header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="mt-2 text-gray-600">
//           Overview of your helpdesk system and recent activity
//         </p>
//       </div>

//       {/* Stats cards */}
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">
//                 {stat.title}
//               </CardTitle>
//               <stat.icon className="h-4 w-4 text-gray-400" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//               <p className={`text-xs ${
//                 stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {stat.change} from last month
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent activity */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Recent tickets */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Ticket className="h-5 w-5" />
//               Recent Tickets
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentTickets.map((ticket) => (
//                 <div key={ticket.id} className="flex items-center justify-between">
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {ticket.title}
//                     </p>
//                     <p className="text-xs text-gray-500">{ticket.product}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
//                       {ticket.priority}
//                     </span>
//                     <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
//                       {ticket.status.replace('_', ' ')}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <button className="text-sm text-blue-600 hover:text-blue-800">
//                 View all tickets →
//               </button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart3 className="h-5 w-5" />
//               Quick Actions
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <button className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-gray-50">
//                 <div className="flex items-center gap-3">
//                   <Package className="h-5 w-5 text-blue-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Add New Product</p>
//                     <p className="text-xs text-gray-500">Create a new product in the system</p>
//                   </div>
//                 </div>
//                 <TrendingUp className="h-4 w-4 text-gray-400" />
//               </button>

//               <button className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-gray-50">
//                 <div className="flex items-center gap-3">
//                   <Users className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Manage Users</p>
//                     <p className="text-xs text-gray-500">Add or modify user permissions</p>
//                   </div>
//                 </div>
//                 <TrendingUp className="h-4 w-4 text-gray-400" />
//               </button>

//               <button className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-gray-50">
//                 <div className="flex items-center gap-3">
//                   <AlertCircle className="h-5 w-5 text-orange-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">View Alerts</p>
//                     <p className="text-xs text-gray-500">Check system alerts and notifications</p>
//                   </div>
//                 </div>
//                 <TrendingUp className="h-4 w-4 text-gray-400" />
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// } 