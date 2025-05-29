
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Ships', href: '/ships', icon: '🚢' },
    { name: 'Jobs', href: '/jobs', icon: '🔧' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Ship Maintenance</h1>
        <p className="text-sm text-gray-600">Dashboard</p>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
