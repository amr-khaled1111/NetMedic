import React, { useState } from 'react'
import {
  Settings as SettingsIcon, User, Bell, Activity, Brain,
  Wrench, Palette, Save, RefreshCw, ChevronRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { cn } from '../utils/cn'

type Section =
  | 'general' | 'monitoring' | 'alerts' | 'ai' | 'recovery' | 'profile' | 'theme'

const SECTIONS: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general',    label: 'General Settings',       icon: SettingsIcon },
  { id: 'monitoring', label: 'Monitoring Preferences', icon: Activity },
  { id: 'alerts',     label: 'Alert Thresholds',       icon: Bell },
  { id: 'ai',         label: 'AI Configuration',       icon: Brain },
  { id: 'recovery',   label: 'Recovery Preferences',   icon: Wrench },
  { id: 'profile',    label: 'User Profile',           icon: User },
  { id: 'theme',      label: 'Theme Preferences',      icon: Palette },
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors',
        value ? 'bg-brand-teal' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
        value ? 'translate-x-5' : 'translate-x-1'
      )} />
    </button>
  )
}

function RangeInput({ value, min, max, unit, onChange }: {
  value: number; min: number; max: number; unit: string; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-brand-teal"
      />
      <span className="text-sm font-semibold text-brand-dark w-16 text-right">{value} {unit}</span>
    </div>
  )
}

export function Settings() {
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<Section>('general')
  const [saved, setSaved] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // General
    orgName: 'NetMedic Demo Corp',
    timezone: 'UTC+3',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    // Monitoring
    pollInterval: 30,
    retentionDays: 90,
    autoRefresh: true,
    showOfflineDevices: true,
    // Alert thresholds
    latencyThreshold: 50,
    packetLossThreshold: 2,
    cpuThreshold: 85,
    memoryThreshold: 90,
    bandwidthThreshold: 90,
    emailAlerts: true,
    criticalAlerts: true,
    // AI
    aiEnabled: true,
    autoRunDiagnosis: false,
    confidenceThreshold: 80,
    anomalyModel: 'isolation-forest',
    // Recovery
    autoApprove: false,
    autoApproveRisk: 'low',
    recoveryTimeout: 300,
    backupBeforeRecover: true,
    // Profile
    name: 'Admin User',
    email: 'admin@netmedic.demo',
    role: 'Network Administrator',
    // Theme
    accentColor: '#009999',
    sidebarStyle: 'dark',
    compactMode: false,
    animationsEnabled: true,
  })

  const set = (k: keyof typeof settings) => (v: unknown) =>
    setSettings(s => ({ ...s, [k]: v }))

  const handleSave = async () => {
    setSaved(true)
    await new Promise(r => setTimeout(r, 600))
    toast('Settings saved successfully.', 'success')
    setSaved(false)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-dark">General Settings</h3>
            {[
              { label: 'Organization Name', key: 'orgName' as const, type: 'text' },
              { label: 'Language', key: 'language' as const, type: 'text' },
              { label: 'Date Format', key: 'dateFormat' as const, type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={String(settings[key])}
                  onChange={e => set(key)(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Timezone</label>
              <select value={settings.timezone} onChange={e => set('timezone')(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
                {['UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+5:30', 'UTC-5', 'UTC-8'].map(tz => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 'monitoring':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-brand-dark">Monitoring Preferences</h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Poll Interval</label>
              <RangeInput value={settings.pollInterval} min={10} max={300} unit="sec" onChange={set('pollInterval')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Data Retention</label>
              <RangeInput value={settings.retentionDays} min={7} max={365} unit="days" onChange={set('retentionDays')} />
            </div>
            {[
              { label: 'Auto-refresh Dashboard', key: 'autoRefresh' as const },
              { label: 'Show Offline Devices', key: 'showOfflineDevices' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle value={Boolean(settings[key])} onChange={set(key)} />
              </div>
            ))}
          </div>
        )

      case 'alerts':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-brand-dark">Alert Thresholds</h3>
            {[
              { label: 'Latency Threshold', key: 'latencyThreshold' as const, min: 5, max: 500, unit: 'ms' },
              { label: 'Packet Loss Threshold', key: 'packetLossThreshold' as const, min: 0, max: 20, unit: '%' },
              { label: 'CPU Usage Threshold', key: 'cpuThreshold' as const, min: 50, max: 100, unit: '%' },
              { label: 'Memory Usage Threshold', key: 'memoryThreshold' as const, min: 50, max: 100, unit: '%' },
              { label: 'Bandwidth Utilization Threshold', key: 'bandwidthThreshold' as const, min: 50, max: 100, unit: '%' },
            ].map(({ label, key, min, max, unit }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
                <RangeInput value={Number(settings[key])} min={min} max={max} unit={unit} onChange={set(key)} />
              </div>
            ))}
            {[
              { label: 'Email Alert Notifications', key: 'emailAlerts' as const },
              { label: 'Critical Incident Alerts', key: 'criticalAlerts' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle value={Boolean(settings[key])} onChange={set(key)} />
              </div>
            ))}
          </div>
        )

      case 'ai':
        return (
          <div className="space-y-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700 font-medium">Demo Configuration Only</p>
              <p className="text-xs text-yellow-600 mt-0.5">These settings are for demo purposes. No real AI model is connected.</p>
            </div>
            <h3 className="text-sm font-semibold text-brand-dark">AI Configuration</h3>
            {[
              { label: 'Enable AI Diagnosis Engine', key: 'aiEnabled' as const },
              { label: 'Auto-run Diagnosis on New Incident', key: 'autoRunDiagnosis' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle value={Boolean(settings[key])} onChange={set(key)} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Minimum Confidence Threshold</label>
              <RangeInput value={settings.confidenceThreshold} min={50} max={99} unit="%" onChange={set('confidenceThreshold')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Anomaly Detection Model</label>
              <select value={settings.anomalyModel} onChange={e => set('anomalyModel')(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
                <option value="isolation-forest">Isolation Forest (Demo)</option>
                <option value="autoencoder">Autoencoder (Demo)</option>
                <option value="lstm">LSTM Sequence Model (Demo)</option>
              </select>
            </div>
          </div>
        )

      case 'recovery':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-brand-dark">Recovery Preferences</h3>
            {[
              { label: 'Auto-approve Low-Risk Actions', key: 'autoApprove' as const },
              { label: 'Create Config Backup Before Recovery', key: 'backupBeforeRecover' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle value={Boolean(settings[key])} onChange={set(key)} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Recovery Timeout</label>
              <RangeInput value={settings.recoveryTimeout} min={60} max={1800} unit="sec" onChange={set('recoveryTimeout')} />
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-dark">User Profile</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-semibold text-brand-dark">{settings.name}</p>
                <p className="text-xs text-gray-500">{settings.email}</p>
                <p className="text-xs text-teal-600 font-medium mt-0.5">{settings.role}</p>
              </div>
            </div>
            {[
              { label: 'Full Name', key: 'name' as const },
              { label: 'Email', key: 'email' as const },
              { label: 'Role', key: 'role' as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input
                  value={String(settings[key])}
                  onChange={e => set(key)(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">Password changes are not available in demo mode.</p>
            </div>
          </div>
        )

      case 'theme':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-brand-dark">Theme Preferences</h3>
            {[
              { label: 'Compact Mode', key: 'compactMode' as const },
              { label: 'Enable Animations', key: 'animationsEnabled' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle value={Boolean(settings[key])} onChange={set(key)} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Sidebar Style</label>
              <div className="flex gap-3">
                {['dark', 'light'].map(style => (
                  <button key={style}
                    onClick={() => set('sidebarStyle')(style)}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all',
                      settings.sidebarStyle === style
                        ? 'border-brand-teal bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    )}>
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Accent Color</label>
              <div className="flex gap-3">
                {['#009999', '#013462', '#4FC3F7', '#FBC02D'].map(color => (
                  <button key={color}
                    onClick={() => set('accentColor')(color)}
                    className={cn('w-8 h-8 rounded-full border-2 transition-all', settings.accentColor === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105')}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      {/* Sidebar */}
      <Card className="lg:col-span-1 p-2">
        <nav className="space-y-0.5">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                activeSection === id
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </nav>
      </Card>

      {/* Content */}
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardContent>{renderSection()}</CardContent>
        </Card>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => toast('Settings reset to defaults.', 'info')}>
            Reset
          </Button>
          <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />}
            loading={saved} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
