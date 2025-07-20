import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import AIChatbot from '../AIChatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-background overflow-y-auto">
          {children}
        </main>
        <AIChatbot />
      </div>
    </div>
  );
};

export { Layout }; 