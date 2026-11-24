import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DemoProvider } from './context/DemoContext'
import { ToastProvider } from './components/ui/Toast'
import { AppLayout } from './components/layout/AppLayout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { Monitoring } from './pages/Monitoring'
import { Topology } from './pages/Topology'
import { Projects } from './pages/Projects'
import { Diagnosis } from './pages/Diagnosis'
import { Recovery } from './pages/Recovery'
import { Reports } from './pages/Reports'
import { Incidents } from './pages/Incidents'
import { Settings } from './pages/Settings'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <ToastProvider>
        <BrowserRouter basename="/NetMedic">
          <Routes>
            <Route path="/login"           element={<Login onLogin={() => setLoggedIn(true)} />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*"                element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <DemoProvider>
        <BrowserRouter basename="/NetMedic">
          <Routes>
            <Route element={<AppLayout onLogout={() => setLoggedIn(false)} />}>
              <Route path="/"            element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"   element={<Dashboard />} />
              <Route path="/monitoring"  element={<Monitoring />} />
              <Route path="/topology"    element={<Topology />} />
              <Route path="/projects"    element={<Projects />} />
              <Route path="/diagnosis"   element={<Diagnosis />} />
              <Route path="/recovery"    element={<Recovery />} />
              <Route path="/reports"     element={<Reports />} />
              <Route path="/incidents"   element={<Incidents />} />
              <Route path="/settings"    element={<Settings />} />
              <Route path="*"            element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </ToastProvider>
  )
}
