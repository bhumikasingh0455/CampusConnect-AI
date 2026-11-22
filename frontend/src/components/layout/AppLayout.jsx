import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DemoBanner from './DemoBanner';
import AiCampusAssistant from '../ai/AiCampusAssistant';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Global Interactive Live Demo Switcher Banner */}
      <DemoBanner />

      <div className="flex-1 flex min-w-0">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Top Navigation */}
          <Topbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Global Floating AI Campus Assistant */}
          <AiCampusAssistant />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
