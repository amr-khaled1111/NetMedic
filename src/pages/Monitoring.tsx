import React, { useState, useMemo } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, Eye, Server, Link2, Layers } from 'lucide-react'
import { mockDevices, mockLinks, mockVLANs } from '../data/mockDevices'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StatusDot } from '../components/ui/StatusDot'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import { getStatusColor, getSeverityColor, formatDateTime } from '../utils/format'
import type { Device } from '../types'

type Tab = 'devices' | 'links' | 'vlans'
type SortKey = keyof Device
type SortDir = 'asc' | 'desc'

export function Monitoring() {
  const [tab, setTab] = useState<Tab>('devices')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    return mockDevices
      .filter(d => {
        const q = search.toLowerCase()
        return (
          d.name.toLowerCase().includes(q) ||
          d.ipAddress.includes(q) ||
          d.type.toLowerCase().includes(q)
        )
      })
      .filter(d => statusFilter === 'all' || d.status === statusFilter)
      .filter(d => typeFilter === 'all' || d.type === typeFilter)
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        if (typeof av === 'number' && typeof bv === 'number')
          return sortDir === 'asc' ? av - bv : bv - av
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av))
      })
  }, [search, statusFilter, typeFilter, sortKey, sortDir])

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />

  const tabs = [
    { id: 'devices' as Tab, label: 'Devices', icon: Server, count: mockDevices.length },
    { id: 'links'   as Tab, label: 'Links',   icon: Link2,  count: mockLinks.length },
    { id: 'vlans'   as Tab, label: 'VLANs',   icon: Layers, count: mockVLANs.length },
  ]

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === id ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Devices tab */}
      {tab === 'devices' && (
        <Card>
          <CardHeader>
            <CardTitle>Device Monitoring</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search devices…"
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30 w-44"
                />
              </div>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              >
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
                <option value="offline">Offline</option>
              </select>
              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              >
                <option value="all">All Types</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="server">Server</option>
                <option value="pc">PC</option>
                <option value="firewall">Firewall</option>
                <option value="ap">Access Point</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      { key: 'name',        label: 'Device Name' },
                      { key: 'type',        label: 'Type' },
                      { key: 'ipAddress',   label: 'IP Address' },
                      { key: 'vlan',        label: 'VLAN' },
                      { key: 'status',      label: 'Status' },
                      { key: 'cpuUsage',    label: 'CPU' },
                      { key: 'memoryUsage', label: 'Memory' },
                      { key: 'latency',     label: 'Latency' },
                      { key: 'lastSeen',    label: 'Last Seen' },
                      { key: null,          label: '' },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        onClick={() => key && handleSort(key as SortKey)}
                        className={`text-left text-xs font-medium text-gray-500 pb-2 pr-4 whitespace-nowrap ${key ? 'cursor-pointer hover:text-brand-blue' : ''}`}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {key && <SortIcon k={key as SortKey} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 text-xs font-semibold text-brand-dark">{d.name}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600 capitalize">{d.type}</td>
                      <td className="py-2.5 pr-4 text-xs font-mono text-gray-600">{d.ipAddress}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{d.vlan}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={d.status} size="sm" />
                          <span className={`text-xs capitalize ${d.status === 'online' ? 'text-teal-700' : d.status === 'warning' ? 'text-yellow-700' : d.status === 'offline' ? 'text-gray-500' : 'text-red-600'}`}>
                            {d.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 w-28">
                        <div className="flex items-center gap-1.5">
                          <ProgressBar value={d.cpuUsage} size="sm" className="w-14" />
                          <span className="text-xs text-gray-600">{d.cpuUsage}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 w-28">
                        <div className="flex items-center gap-1.5">
                          <ProgressBar value={d.memoryUsage} size="sm" className="w-14" />
                          <span className="text-xs text-gray-600">{d.memoryUsage}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{d.latency ? `${d.latency} ms` : '—'}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(d.lastSeen)}</td>
                      <td className="py-2.5">
                        <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setSelectedDevice(d)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="py-10 text-center text-sm text-gray-400">No devices match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links tab */}
      {tab === 'links' && (
        <Card>
          <CardHeader><CardTitle>Link Monitoring</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Source', 'Destination', 'Interface', 'Status', 'Bandwidth', 'Utilization', 'Pkt Loss', 'Latency', 'Type'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 pb-2 pr-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockLinks.map(link => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="py-2.5 pr-4 text-xs font-medium text-brand-dark">{link.source}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-700">{link.destination}</td>
                      <td className="py-2.5 pr-4 text-xs font-mono text-gray-500">{link.interface}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={link.status} size="sm" />
                          <span className="text-xs capitalize">{link.status}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{link.bandwidth}</td>
                      <td className="py-2.5 pr-4 w-28">
                        <div className="flex items-center gap-1.5">
                          <ProgressBar value={link.utilization} size="sm" className="w-14" />
                          <span className="text-xs">{link.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{link.packetLoss}%</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{link.latency} ms</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={link.isPrimary ? 'text-brand-blue bg-blue-50 border-blue-200' : 'text-gray-500 bg-gray-50 border-gray-200'}>
                          {link.isPrimary ? 'Primary' : 'Backup'}
                        </Badge>
                        {link.isActive && <Badge className="ml-1 text-teal-700 bg-teal-50 border-teal-200">Active</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VLANs tab */}
      {tab === 'vlans' && (
        <Card>
          <CardHeader><CardTitle>VLAN Monitoring</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['VLAN ID', 'Name', 'Subnet', 'Devices', 'Avg Latency', 'Packet Loss', 'Health Score'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 pb-2 pr-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockVLANs.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="py-2.5 pr-4 text-xs font-mono font-semibold text-brand-blue">{v.vlanId}</td>
                      <td className="py-2.5 pr-4 text-xs font-medium text-brand-dark">{v.name}</td>
                      <td className="py-2.5 pr-4 text-xs font-mono text-gray-500">{v.subnet}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{v.connectedDevices}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{v.avgLatency} ms</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-600">{v.packetLoss}%</td>
                      <td className="py-2.5 pr-4 w-36">
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={v.healthScore}
                            size="sm"
                            className="w-20"
                            barClassName={v.healthScore >= 90 ? 'bg-brand-teal' : v.healthScore >= 70 ? 'bg-yellow-400' : 'bg-red-500'}
                          />
                          <span className="text-xs font-semibold text-gray-700">{v.healthScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device detail modal */}
      <Modal
        open={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        title={selectedDevice?.name ?? ''}
        size="md"
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedDevice.status)}`}>
                {selectedDevice.status.toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 capitalize">{selectedDevice.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['IP Address', selectedDevice.ipAddress],
                ['VLAN', selectedDevice.vlan],
                ['Model', selectedDevice.model],
                ['Location', selectedDevice.location],
                ['Uptime', selectedDevice.uptime],
                ['Last Seen', formatDateTime(selectedDevice.lastSeen)],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{val}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">CPU Usage</p>
                <ProgressBar value={selectedDevice.cpuUsage} showLabel />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Memory Usage</p>
                <ProgressBar value={selectedDevice.memoryUsage} showLabel />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
