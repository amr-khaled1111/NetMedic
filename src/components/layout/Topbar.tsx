import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, User, ChevronDown, LogOut, Settings, FlaskConical } from 'lucide-react'
import { cn } from '../../utils/cn'
import { StatusDot } from '../ui/StatusDot'
import { useDemo } from '../../context/DemoContext'

const pageTitles: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/monitoring': 'Network Monitoring',
  '/topology':   'Network Topology',
  '/projects':   'Packet Tracer Projects',
  '/diagnosis':  'AI Diagnosis Center',
  '/recovery':   'Recovery Center',
  '/reports':    'Reports',
  '/incidents':  'Alerts & Incidents',
  '/settings':   'Settings',
}

interface TopbarProps {
  onLogout: () => void
}

export function Topbar({ onLogout }: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { metrics, demoState } = useDemo()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const title = pageTitles[location.pathname] ?? 'NetMedic'
  const networkHealthy = metrics.healthScore >= 80
  const networkStatus = demoState.networkDegraded ? 'degraded' : 'up'

  const notifications = [
    { id: 1, msg: 'DB-Server-01 CPU above 85%', time: '10m ago', type: 'warning' },
    { id: 2, msg: 'PC-Floor1-02 offline', time: '2h ago', type: 'error' },
    { id: 3, msg: 'Weekly report generated', time: '3h ago', type: 'info' },
  ]

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shadow-sm flex-shrink-0 z-20">
      {/* Left: Page title */}
      <h1 className="text-base font-semibold text-brand-dark">{title}</h1>

      {/* Right: Status + actions */}
      <div className="flex items-center gap-3">
        {/* Demo mode pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
          <FlaskConical className="w-3 h-3 text-yellow-600" />
          <span className="text-xs font-semibold text-yellow-700">Demo Mode</span>
        </div>

        {/* Network status */}
        <div className={cn(
          'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium',
          networkHealthy
            ? 'bg-teal-50 border-teal-200 text-teal-700'
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        )}>
          <StatusDot status={networkStatus} size="sm" pulse={!networkHealthy} />
          <span>
            {demoState.networkDegraded ? 'Degraded' : 'Network Healthy'}
          </span>
          <span className="font-bold">{metrics.healthScore}%</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
            className="relative p-2 rounded-lg text-gray-500 hover:text-brand-blue hover:bg-blue-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {metrics.activeAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700">Notifications</p>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-gray-800">{n.msg}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-700">Admin</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Admin User</p>
                <p className="text-[10px] text-gray-500">admin@netmedic.demo</p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
