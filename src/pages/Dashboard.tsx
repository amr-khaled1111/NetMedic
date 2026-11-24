import React from 'react'
import {
  Activity, Server, AlertTriangle, Wifi, Clock, TrendingDown,
  Gauge, Zap, CheckCircle, XCircle, AlertCircle, Info,
  RefreshCw, Play, RotateCcw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useDemo } from '../context/DemoContext'
import { mockIncidents } from '../data/mockIncidents'
import {
  latencyTimeSeries, packetLossTimeSeries,
  bandwidthDualSeries, deviceStatusBreakdown, recentActivities
} from '../data/mockMetrics'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StatusDot } from '../components/ui/StatusDot'
import { getSeverityColor, getStatusColor, statusLabel, formatDateTime } from '../utils/format'

const CHART_COLORS = { primary: '#013462', teal: '#009999', light: '#4FC3F7', yellow: '#FBC02D' }

export function Dashboard() {
  const navigate = useNavigate()
  const { metrics, demoState, demoIncident, simulateNetworkIssue, resetDemo } = useDemo()

  const allIncidents = [
    ...(demoIncident ? [demoIncident] : []),
    ...mockIncidents,
  ].slice(0, 5)

  const activityIcons = {
    success: <CheckCircle className="w-3.5 h-3.5 text-teal-500" />,
    warning: <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />,
    error:   <XCircle className="w-3.5 h-3.5 text-red-500" />,
    info:    <Info className="w-3.5 h-3.5 text-blue-500" />,
  }

  const healthColor =
    metrics.healthScore >= 90 ? 'text-teal-600' :
    metrics.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="space-y-5">
      {/* Demo control bar */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-white font-semibold text-sm">Interactive Demo Mode</p>
          <p className="text-white/70 text-xs">
            Step {
              demoState.step === 'idle' ? '0/5 — Ready' :
              demoState.step === 'issue_simulated' ? '1/5 — Network issue simulated' :
              demoState.step === 'diagnosing' ? '2/5 — Diagnosing…' :
              demoState.step === 'diagnosed' ? '3/5 — Diagnosis complete' :
              demoState.step === 'recovering' ? '4/5 — Recovery in progress' :
              demoState.step === 'recovered' ? '5/5 — Recovery verified ✓' :
              'Report generated ✓'
            }
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {demoState.step === 'idle' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={simulateNetworkIssue}
            >
              Simulate Network Issue
            </Button>
          )}
          {demoState.step !== 'idle' && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 text-white hover:bg-white/20"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={resetDemo}
            >
              Reset Demo
            </Button>
          )}
          {demoState.step === 'issue_simulated' && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-brand-yellow text-brand-dark hover:opacity-90"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => navigate('/diagnosis')}
            >
              Run AI Diagnosis →
            </Button>
          )}
          {(demoState.step === 'diagnosed' || demoState.step === 'recovered') && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={() => navigate('/recovery')}
            >
              Go to Recovery →
            </Button>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Health Score"
          value={metrics.healthScore}
          unit="/100"
          icon={<Activity className="w-4 h-4" />}
          colorClass={healthColor}
          bgClass={metrics.healthScore >= 90 ? 'bg-teal-50' : metrics.healthScore >= 70 ? 'bg-yellow-50' : 'bg-red-50'}
          trend={demoState.networkDegraded ? 'down' : 'up'}
          trendValue={demoState.networkDegraded ? '−33 pts' : 'Nominal'}
          trendGood={!demoState.networkDegraded}
        />
        <StatCard
          title="Active Devices"
          value={metrics.activeDevices}
          unit={`/ ${metrics.totalDevices}`}
          icon={<Server className="w-4 h-4" />}
          colorClass="text-brand-blue"
          bgClass="bg-blue-50"
        />
        <StatCard
          title="Active Alerts"
          value={metrics.activeAlerts}
          icon={<AlertTriangle className="w-4 h-4" />}
          colorClass={metrics.activeAlerts > 3 ? 'text-red-600' : 'text-yellow-600'}
          bgClass={metrics.activeAlerts > 3 ? 'bg-red-50' : 'bg-yellow-50'}
          trend={demoState.networkDegraded ? 'up' : 'neutral'}
          trendValue={demoState.networkDegraded ? '+4 new' : 'Stable'}
          trendGood={false}
        />
        <StatCard
          title="Avg Latency"
          value={metrics.avgLatency}
          unit="ms"
          icon={<Clock className="w-4 h-4" />}
          colorClass={metrics.avgLatency > 20 ? 'text-red-600' : 'text-teal-600'}
          bgClass={metrics.avgLatency > 20 ? 'bg-red-50' : 'bg-teal-50'}
          trend={demoState.networkDegraded ? 'up' : 'down'}
          trendValue={demoState.networkDegraded ? '+138ms' : 'Normal'}
          trendGood={!demoState.networkDegraded}
        />
        <StatCard
          title="Packet Loss"
          value={metrics.packetLoss}
          unit="%"
          icon={<TrendingDown className="w-4 h-4" />}
          colorClass={metrics.packetLoss > 1 ? 'text-red-600' : 'text-teal-600'}
          bgClass={metrics.packetLoss > 1 ? 'bg-red-50' : 'bg-teal-50'}
        />
        <StatCard
          title="Throughput"
          value={metrics.throughput}
          unit="Mbps"
          icon={<Gauge className="w-4 h-4" />}
          colorClass="text-brand-blue"
          bgClass="bg-blue-50"
          trend={demoState.networkDegraded ? 'down' : 'up'}
          trendValue={demoState.networkDegraded ? '−63%' : 'Normal'}
          trendGood={!demoState.networkDegraded}
        />
        <StatCard
          title="Devices w/ Issues"
          value={metrics.devicesWithIssues}
          icon={<AlertCircle className="w-4 h-4" />}
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
        />
        <StatCard
          title="Network"
          value={demoState.networkDegraded ? 'Degraded' : 'Healthy'}
          icon={<Wifi className="w-4 h-4" />}
          colorClass={demoState.networkDegraded ? 'text-red-600' : 'text-teal-600'}
          bgClass={demoState.networkDegraded ? 'bg-red-50' : 'bg-teal-50'}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latency Trend (24h)</CardTitle>
            <span className="text-xs text-gray-400">ms</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={latencyTimeSeries}>
                <defs>
                  <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="value" stroke={CHART_COLORS.teal} fill="url(#latGrad)" strokeWidth={2} dot={false} name="Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bandwidth Utilization (24h)</CardTitle>
            <span className="text-xs text-gray-400">Mbps</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={bandwidthDualSeries}>
                <defs>
                  <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.light} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.light} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="inbound" stroke={CHART_COLORS.primary} fill="url(#inGrad)" strokeWidth={2} dot={false} name="Inbound" />
                <Area type="monotone" dataKey="outbound" stroke={CHART_COLORS.light} fill="url(#outGrad)" strokeWidth={2} dot={false} name="Outbound" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 + lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Packet loss chart */}
        <Card>
          <CardHeader>
            <CardTitle>Packet Loss (24h)</CardTitle>
            <span className="text-xs text-gray-400">%</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={packetLossTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={7} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={25} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke={CHART_COLORS.yellow} strokeWidth={2} dot={false} name="Packet Loss (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device status */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={deviceStatusBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                    {deviceStatusBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {deviceStatusBreakdown.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto scrollbar-thin">
              {recentActivities.map(a => (
                <div key={a.id} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0">
                    {activityIcons[a.type as keyof typeof activityIcons]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 leading-tight">{a.message}</p>
                    <p className="text-[10px] text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <a href="/incidents" className="text-xs text-brand-teal hover:underline font-medium">
            View all →
          </a>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['ID', 'Title', 'Severity', 'Device', 'Detected', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 pb-2 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allIncidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4 text-xs font-mono text-gray-500">{inc.id}</td>
                    <td className="py-2.5 pr-4 text-xs font-medium text-brand-dark max-w-[200px] truncate">{inc.title}</td>
                    <td className="py-2.5 pr-4">
                      <Badge className={getSeverityColor(inc.severity)}>
                        {inc.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">{inc.affectedDevice}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(inc.detectionTime)}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={inc.status} size="sm" />
                        <span className="text-xs text-gray-600">{statusLabel(inc.status)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
