// import { useQuery } from '@tanstack/react-query';
// import api from '../../services/api';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
// import { Badge } from '../../components/ui/badge';
// import { Skeleton } from '../../components/ui/skeleton';
// import { Alert, AlertDescription } from '../../components/ui/alert';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
// import { Button } from '../../components/ui/button';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   Users, 
//   Clock, 
//   Ticket, 
//   CheckCircle, 
//   AlertTriangle, 
//   Activity,
//   ArrowUpRight,
//   ArrowDownRight,
//   Eye,
//   Plus
// } from 'lucide-react';

// interface DashboardStats {
//   totalTickets: number;
//   openTickets: number;
//   closedTickets: number;
//   resolvedTickets: number;
//   totalUsers: number;
//   activeUsers: number;
//   resolutionRate: number;
//   averageResolutionTime: number;
//   priorityDistribution: {
//     HIGH: number;
//     MEDIUM: number;
//     CRITICAL: number;
//     LOW?: number;
//   };
//   dateRange: {
//     startDate: string;
//     endDate: string;
//   };
//   recentTickets?: Array<{
//     id: number;
//     title: string;
//     status: string;
//     priority: string;
//     createdDate: string;
//   }>;
// }

// const Dashboard = () => {
//   const { data: stats, isLoading, error } = useQuery({
//     queryKey: ['dashboard-stats'],
//     queryFn: async () => {
//       const response = await api.get('/v1/dashboard/stats');
//       return response.data as DashboardStats;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <Skeleton className="h-8 w-[250px]" />
//           <Skeleton className="h-4 w-[400px]" />
//         </div>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i} className="card-hover">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <Skeleton className="h-4 w-[100px]" />
//                 <Skeleton className="h-4 w-4" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-7 w-[60px]" />
//                 <Skeleton className="h-3 w-[120px] mt-2" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//           <Card className="col-span-4 card-hover">
//             <CardHeader>
//               <Skeleton className="h-6 w-[200px]" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-[300px]" />
//             </CardContent>
//           </Card>
//           <Card className="col-span-3 card-hover">
//             <CardHeader>
//               <Skeleton className="h-6 w-[150px]" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-[300px]" />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <Alert variant="destructive">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             Error loading dashboard data. Please try again.
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   const statsCards = [
//     {
//       title: "Total Tickets",
//       value: stats?.totalTickets || 0,
//       description: "All time tickets",
//       icon: Ticket,
//       trend: "+12%",
//       trendDirection: "up",
//       color: "text-blue-600",
//       bgColor: "bg-blue-50 dark:bg-blue-950/50",
//       borderColor: "border-blue-200 dark:border-blue-800"
//     },
//     {
//       title: "Open Tickets",
//       value: stats?.openTickets || 0,
//       description: "Currently open",
//       icon: Clock,
//       trend: "-2%",
//       trendDirection: "down",
//       color: "text-orange-600",
//       bgColor: "bg-orange-50 dark:bg-orange-950/50",
//       borderColor: "border-orange-200 dark:border-orange-800"
//     },
//     {
//       title: "Resolved Tickets",
//       value: stats?.resolvedTickets || 0,
//       description: "Successfully resolved",
//       icon: CheckCircle,
//       trend: "+8%",
//       trendDirection: "up",
//       color: "text-green-600",
//       bgColor: "bg-green-50 dark:bg-green-950/50",
//       borderColor: "border-green-200 dark:border-green-800"
//     },
//     {
//       title: "Active Users",
//       value: stats?.activeUsers || 0,
//       description: "Currently active",
//       icon: Users,
//       trend: "+5%",
//       trendDirection: "up",
//       color: "text-purple-600",
//       bgColor: "bg-purple-50 dark:bg-purple-950/50",
//       borderColor: "border-purple-200 dark:border-purple-800"
//     }
//   ];

//   const getPriorityBadgeVariant = (priority: string) => {
//     switch (priority.toUpperCase()) {
//       case 'CRITICAL':
//         return 'destructive';
//       case 'HIGH':
//         return 'destructive';
//       case 'MEDIUM':
//         return 'default';
//       case 'LOW':
//         return 'secondary';
//       default:
//         return 'outline';
//     }
//   };

//   const getStatusBadgeVariant = (status: string) => {
//     switch (status.toUpperCase()) {
//       case 'OPEN':
//         return 'default';
//       case 'RESOLVED':
//         return 'default';
//       case 'CLOSED':
//         return 'secondary';
//       default:
//         return 'outline';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
//           <p className="text-muted-foreground">
//             Overview of your support system from {stats?.dateRange.startDate} to {stats?.dateRange.endDate}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" size="sm">
//             <Eye className="w-4 h-4 mr-2" />
//             View Reports
//           </Button>
//           <Button size="sm">
//             <Plus className="w-4 h-4 mr-2" />
//             New Ticket
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {statsCards.map((card) => {
//           const Icon = card.icon;
//           return (
//             <Card key={card.title} className={`card-hover border ${card.borderColor}`}>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {card.title}
//                 </CardTitle>
//                 <div className={`p-2 rounded-lg ${card.bgColor}`}>
//                   <Icon className={`h-4 w-4 ${card.color}`} />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
//                 <div className="flex items-center gap-2 mt-2">
//                   {card.trendDirection === "up" ? (
//                     <ArrowUpRight className="h-3 w-3 text-green-600" />
//                   ) : (
//                     <ArrowDownRight className="h-3 w-3 text-red-600" />
//                   )}
//                   <p className="text-xs text-muted-foreground">
//                     {card.trend} from last month
//                   </p>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {card.description}
//                 </p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//         {/* Priority Distribution Chart */}
//         <Card className="col-span-4 card-hover">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart3 className="h-5 w-5 text-blue-600" />
//               Priority Distribution
//             </CardTitle>
//             <CardDescription>
//               Breakdown of tickets by priority level
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {stats?.priorityDistribution && Object.entries(stats.priorityDistribution).map(([priority, count]) => (
//               <div key={priority} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <Badge variant={getPriorityBadgeVariant(priority)}>
//                     {priority}
//                   </Badge>
//                   <span className="text-sm font-medium">{count} tickets</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-24 bg-secondary rounded-full h-2">
//                     <div 
//                       className="bg-primary h-2 rounded-full transition-all duration-300" 
//                       style={{
//                         width: `${((count / (stats?.totalTickets || 1)) * 100)}%`
//                       }}
//                     />
//                   </div>
//                   <span className="text-sm font-medium w-12 text-right">
//                     {((count / (stats?.totalTickets || 1)) * 100).toFixed(1)}%
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Performance Metrics */}
//         <Card className="col-span-3 card-hover">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-green-600" />
//               Performance
//             </CardTitle>
//             <CardDescription>
//               Key performance indicators
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Resolution Rate</span>
//                 <span className="text-sm font-bold text-green-600">
//                   {stats?.resolutionRate?.toFixed(1)}%
//                 </span>
//               </div>
//               <div className="w-full bg-secondary rounded-full h-3">
//                 <div 
//                   className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" 
//                   style={{ width: `${stats?.resolutionRate || 0}%` }}
//                 />
//               </div>
//               <p className="text-xs text-muted-foreground">Target: 95%</p>
//             </div>
            
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Avg. Resolution Time</span>
//                 <span className="text-sm font-bold text-blue-600">
//                   {stats?.averageResolutionTime?.toFixed(1)} hrs
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Activity className="h-4 w-4 text-blue-500" />
//                 <span className="text-xs text-muted-foreground">
//                   Target: &lt; 24 hours
//                 </span>
//               </div>
//             </div>

//             <div className="pt-4 border-t border-border">
//               <div className="grid grid-cols-2 gap-4 text-center">
//                 <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
//                   <div className="text-2xl font-bold text-green-600">
//                     {stats?.resolvedTickets || 0}
//                   </div>
//                   <div className="text-xs text-muted-foreground">Resolved</div>
//                 </div>
//                 <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
//                   <div className="text-2xl font-bold text-blue-600">
//                     {stats?.totalUsers || 0}
//                   </div>
//                   <div className="text-xs text-muted-foreground">Total Users</div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <Card className="card-hover">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Recent Activity</CardTitle>
//               <CardDescription>
//                 Latest tickets and system updates
//               </CardDescription>
//             </div>
//             <Button variant="outline" size="sm">
//               View All
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="tickets" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
//               <TabsTrigger value="activity">System Activity</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="tickets" className="mt-6">
//               {stats?.recentTickets && stats.recentTickets.length > 0 ? (
//                 <div className="rounded-lg border border-border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>ID</TableHead>
//                         <TableHead>Title</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Priority</TableHead>
//                         <TableHead>Created</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {stats.recentTickets.map((ticket) => (
//                         <TableRow key={ticket.id} className="hover:bg-muted/50 transition-colors">
//                           <TableCell className="font-medium">#{ticket.id}</TableCell>
//                           <TableCell className="max-w-[300px] truncate">
//                             {ticket.title}
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant={getStatusBadgeVariant(ticket.status)}>
//                               {ticket.status}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
//                               {ticket.priority}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-muted-foreground">
//                             {new Date(ticket.createdDate).toLocaleDateString()}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-muted-foreground">
//                   <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p>No recent tickets found</p>
//                   <p className="text-sm">Tickets will appear here once created</p>
//                 </div>
//               )}
//             </TabsContent>
            
//             <TabsContent value="activity" className="mt-6">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">System Status: All systems operational</p>
//                     <p className="text-xs text-muted-foreground">2 minutes ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">New user registered</p>
//                     <p className="text-xs text-muted-foreground">1 hour ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
//                   <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Database backup completed</p>
//                     <p className="text-xs text-muted-foreground">3 hours ago</p>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;
