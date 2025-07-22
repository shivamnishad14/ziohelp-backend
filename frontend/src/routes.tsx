import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import {Login} from './components/pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import Register from './components/pages/Register';
import Unauthorized from './components/pages/Unauthorized';
import HelpCenter from './components/pages/guest/HelpCenter';
import Landing from './components/pages/Landing';
import TicketDashboard from './components/pages/developer/TicketDashboard';
import MyTickets from './components/pages/user/MyTickets';
import MasterAdminDashboard from './components/pages/admin/MasterAdminDashboard';
import AdminDashboardMain from './components/pages/admin/AdminDashboardMain';
import EngineerDashboard from './components/pages/developer/EngineerDashboard';
import TenantDashboard from './components/pages/tenant/TenantDashboard';
import Dashboard from './components/pages/user/Dashboard';
import FAQManagement from './components/pages/admin/FAQManagement';
import FileManagement from './components/pages/admin/FileManagement';
import KnowledgeBase from './components/pages/KnowledgeBase';
import ProductManagement from './components/pages/admin/ProductManagement';
import TicketManagement from './components/pages/admin/TicketManagement';
import UserManagement from './components/pages/admin/UserManagement';
import RoleManagement from './components/pages/admin/RoleManagement';
import Profile from './components/pages/user/Profile';
import GuestTicketStatus from './components/pages/guest/GuestTicketStatus';
import GuestRaiseTicket from './components/pages/guest/GuestRaiseTicket';
import GuestTicketManagement from './components/pages/guest/GuestTicketManagement';
import VerifyEmail from './components/pages/VerifyEmail';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

function AutoRedirect() {
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  if (userRoles.length > 0) {
    window.location.href = getDashboardRoute(userRoles);
    return null;
  }
  window.location.href = '/login';
  return null;
}

export function HelpdeskRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AutoRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/guest-ticket-status" element={<GuestTicketStatus />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* User Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['USER']}>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Master Admin Dashboard */}
      <Route path="/master-admin/dashboard" element={
        <ProtectedRoute roles={['SUPER_ADMIN']}>
          <Layout>
            <MasterAdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Admin Dashboard */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Layout>
            <AdminDashboardMain />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Developer Dashboard */}
      <Route path="/developer/dashboard" element={
        <ProtectedRoute roles={['DEVELOPER']}>
          <Layout>
            <EngineerDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Tenant Admin Dashboard */}
      <Route path="/tenant/dashboard" element={
        <ProtectedRoute roles={['TENANT_ADMIN']}>
          <Layout>
            <TenantDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Admin Management Pages */}
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Layout><Outlet /></Layout></ProtectedRoute>}>
        <Route path="faq-kb" element={<FAQManagement />} />
        <Route path="files" element={<FileManagement />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
      </Route>
      {/* Developer Management Pages */}
      <Route path="/developer" element={<ProtectedRoute roles={['DEVELOPER']}><Layout><Outlet /></Layout></ProtectedRoute>}>
        <Route path="tickets" element={<TicketDashboard />} />
      </Route>
      {/* Tenant Admin Management Pages */}
      <Route path="/tenant" element={<ProtectedRoute roles={['TENANT_ADMIN']}><Layout><Outlet /></Layout></ProtectedRoute>}>
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="faq" element={<FAQManagement />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
      </Route>
      {/* User Tickets */}
      <Route path="/tickets/my-tickets" element={<ProtectedRoute roles={['USER']}><Layout><MyTickets /></Layout></ProtectedRoute>} />
      {/* Profile */}
      <Route path="/profile" element={<ProtectedRoute roles={['USER', 'ADMIN', 'DEVELOPER', 'TENANT_ADMIN']}><Profile /></ProtectedRoute>} />
      {/* Guest routes (public) */}
      <Route path="/guest/raise-ticket" element={<GuestRaiseTicket />} />
      <Route path="/guest/ticket-status" element={<GuestTicketStatus />} />
      <Route path="/faq" element={<FAQManagement />} />
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return <div className="text-center mt-16 text-2xl text-gray-500">404 - Page Not Found</div>;
} 