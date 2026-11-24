import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppLayoutProps {
  onLogout: () => void
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
