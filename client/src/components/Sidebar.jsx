import React from 'react';
import { NavLink } from 'react-router-dom';
import { Network, LayoutDashboard, PackageSearch, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/shipments', icon: PackageSearch, label: 'Shipments' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50">
      {/* Brand Header */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
          <Network className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-white tracking-widest uppercase leading-tight">
            Delay<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Shield</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Decision Engine</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300
              ${isActive 
                ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            `}
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile Stub */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-slate-700"></div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin User</p>
            <p className="text-xs text-slate-400">Logistics Corp.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
