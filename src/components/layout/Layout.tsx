/**
 * Main layout component wrapping header, sidebar, and content
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common';
import { useUiStore } from '../../stores';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main
        className={`
          pt-16 transition-all duration-300
          ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
        `}
      >
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};