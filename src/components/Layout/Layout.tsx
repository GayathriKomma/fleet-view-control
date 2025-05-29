
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>© 2024 ENTNT Marine Solutions</span>
              <span className="text-gray-400">|</span>
              <span>Ship Maintenance Management v2.1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Maritime Operations Center</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600">System Online</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
