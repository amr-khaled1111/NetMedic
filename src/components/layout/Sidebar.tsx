import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import {
  LayoutDashboard,
  Activity,
  Network,
  FolderOpen,
  Brain,
  Wrench,
  FileText,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/dashboard',   label: 'Dashboard',           icon: LayoutDashboard },
  { path: '/monitoring',  label: 'Network Monitoring',  icon: Activity },
  { path: '/topology',    label: 'Network Topology',    icon: Network },
  { path: '/projects',    label: 'Packet Tracer',       icon: FolderOpen },
  { path: '/diagnosis',   label: 'AI Diagnosis',        icon: Brain },
  { path: '/recovery',    label: 'Recovery Center',     icon: Wrench },
  { path: '/reports',     label: 'Reports',             icon: FileText },
  { path: '/incidents',   label: 'Alerts & Incidents',  icon: AlertTriangle },
  { path: '/settings',    label: 'Settings',            icon: Settings },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'relative h-full flex flex-col transition-all duration-300 ease-in-out',
        'bg-brand-blue border-r border-white/10',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-white/10',
        collapsed ? 'justify-center px-2' : ''
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-md bg-white/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-base leading-tight">NetMedic</p>
            <p className="text-white/50 text-[10px]">AI Network Ops</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/')
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                    active
                      ? 'bg-brand-teal text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                    collapsed ? 'justify-center px-2' : ''
                  )}
                >
                  <Icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-lightblue" />
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide">Version</p>
            <p className="text-white text-xs mt-0.5">NetMedic v1.0 Demo</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200',
          'shadow-md flex items-center justify-center text-brand-blue',
          'hover:bg-blue-50 transition-colors z-10'
        )}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>
    </aside>
  )
}
