import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  PackageSearch, 
  TrendingUp,
  Shield,
  Warehouse,
  MessageSquare,
  Navigation,
  Settings,
  RefreshCw,
  Dna
} from 'lucide-react'
import { useNavigationLoading } from './NavigationLoadingContext'
import { useAuth } from '../auth/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pendingPath, startNavigation } = useNavigationLoading()
  const { user, logout } = useAuth()

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/sla-guardian', icon: Shield, label: 'SLA Guardian AI' },
    { to: '/shipments', icon: PackageSearch, label: 'Shipments' },
    { to: '/warehouse', icon: Warehouse, label: 'Warehouse Intelligence' },
    { to: '/communication', icon: MessageSquare, label: 'Communication Center' },
    { to: '/tracking', icon: Navigation, label: 'Tracking Center' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/delay-dna', icon: Dna, label: 'Delay DNA' },
    { to: '/loss-engine', icon: TrendingUp, label: 'Loss Engine' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  const initials = String(user?.name || 'Admin')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="w-full md:w-72 h-auto md:h-screen fixed bottom-0 md:bottom-auto md:top-0 left-0 bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col z-50 shadow-2xl shadow-slate-200/50">
      <div className="hidden md:flex h-20 items-center gap-3 px-6 border-b border-slate-100 bg-white">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-blue-950 tracking-tight leading-tight font-display">
            DelayShield <span className="text-blue-600">AI</span>
          </span>
          <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Supply Chain Intelligence</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-row md:flex-col justify-around md:justify-start px-2 py-2 md:px-4 md:py-6 space-x-1 md:space-x-0 md:space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => {
              if (location.pathname !== link.to) {
                startNavigation(link.to)
              }
            }}
            className={({ isActive }) => `
              flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl font-medium transition-all duration-200
              ${isActive
                ? 'bg-blue-50 text-blue-700 md:border-l-4 md:border-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
            `}
          >
            {pendingPath === link.to ? (
              <RefreshCw className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
            ) : (
              <link.icon className="w-5 h-5 md:w-5 md:h-5" />
            )}
            <span className="text-[10px] md:text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'Operations Manager'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-100"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
