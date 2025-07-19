import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import Register from './components/pages/Register';
import Unauthorized from './components/pages/Unauthorized';
import HelpCenter from './components/pages/HelpCenter';
import Landing from './components/pages/Landing';
import TicketDashboard from './components/pages/TicketDashboard';
import MyTickets from './components/pages/MyTickets';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminFAQKB from './components/pages/AdminFAQKB';
import Dashboard from './components/pages/Dashboard';
import FAQManagement from './components/pages/FAQManagement';
import FileManagement from './components/pages/FileManagement';
import KnowledgeBase from './components/pages/KnowledgeBase';
import ProductManagement from './components/pages/ProductManagement';
import TicketManagement from './components/pages/TicketManagement';
import UserManagement from './components/pages/UserManagement';
import RoleManagement from './components/pages/RoleManagement';
import Profile from './components/pages/Profile';
import GuestTicketStatus from './components/pages/GuestTicketStatus';

export function HelpdeskRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/guest-ticket-status" element={<GuestTicketStatus />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<ProtectedRoute roles={['admin', 'product_admin', 'SUPER_ADMIN', 'super_admin']}><Layout><Outlet /></Layout></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="faq-kb" element={<FAQManagement />} />
        <Route path="files" element={<FileManagement />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
      </Route>
      <Route path="/tickets" element={<ProtectedRoute roles={['admin', 'product_admin', 'agent']}><Layout><Outlet /></Layout></ProtectedRoute>}>
        <Route path="dashboard" element={<TicketDashboard />} />
        <Route path="my-tickets" element={<MyTickets />} />
      </Route>
      <Route path="/super-admin" element={<ProtectedRoute roles={['SUPER_ADMIN', 'super_admin']}><Layout><SuperAdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin-faq-kb" element={
        <ProtectedRoute roles={['admin', 'product_admin', 'SUPER_ADMIN', 'super_admin']}>
          <Layout>
            <FAQManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return <div className="text-center mt-16 text-2xl text-gray-500">404 - Page Not Found</div>;
} 