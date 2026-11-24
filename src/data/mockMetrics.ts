import type { TimeSeriesPoint, DashboardMetrics } from '../types'

function generateTimeSeries(
  baseValue: number,
  variance: number,
  points = 24,
  startHoursAgo = 23
): TimeSeriesPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const hoursAgo = startHoursAgo - i
    const d = new Date()
    d.setHours(d.getHours() - hoursAgo)
    const label = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    return {
      time: label,
      value: Math.max(0, Math.round((baseValue + (Math.random() - 0.5) * variance * 2) * 10) / 10),
    }
  })
}

export const latencyTimeSeries: TimeSeriesPoint[] = generateTimeSeries(8, 4)
export const packetLossTimeSeries: TimeSeriesPoint[] = generateTimeSeries(0.3, 0.3)
export const bandwidthTimeSeries: TimeSeriesPoint[] = generateTimeSeries(65, 20)
export const throughputTimeSeries: TimeSeriesPoint[] = generateTimeSeries(820, 180)
export const availabilityTimeSeries: TimeSeriesPoint[] = generateTimeSeries(99.4, 0.6)

export const bandwidthDualSeries = Array.from({ length: 24 }, (_, i) => {
  const d = new Date()
  d.setHours(d.getHours() - (23 - i))
  return {
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    inbound: Math.round((300 + Math.random() * 200) * 10) / 10,
    outbound: Math.round((200 + Math.random() * 150) * 10) / 10,
  }
})

export const normalMetrics: DashboardMetrics = {
  healthScore: 94,
  totalDevices: 12,
  activeDevices: 10,
  devicesWithIssues: 2,
  activeAlerts: 3,
  avgLatency: 4,
  packetLoss: 0.2,
  throughput: 847,
}

export const degradedMetrics: DashboardMetrics = {
  healthScore: 61,
  totalDevices: 12,
  activeDevices: 10,
  devicesWithIssues: 4,
  activeAlerts: 7,
  avgLatency: 142,
  packetLoss: 8.4,
  throughput: 312,
}

export const recoveredMetrics: DashboardMetrics = {
  healthScore: 96,
  totalDevices: 12,
  activeDevices: 11,
  devicesWithIssues: 1,
  activeAlerts: 1,
  avgLatency: 3,
  packetLoss: 0.1,
  throughput: 891,
}

export const deviceStatusBreakdown = [
  { name: 'Online', value: 10, color: '#009999' },
  { name: 'Warning', value: 2, color: '#FBC02D' },
  { name: 'Critical', value: 0, color: '#ef4444' },
  { name: 'Offline', value: 1, color: '#94a3b8' },
]

export const recentActivities = [
  { id: 'act-001', time: '10:45', message: 'Core-Router-01 health check passed', type: 'success' },
  { id: 'act-002', time: '10:42', message: 'DB-Server-01 CPU usage exceeded 85% threshold', type: 'warning' },
  { id: 'act-003', time: '10:38', message: 'Dist-Switch-02 latency spike detected: 12ms', type: 'warning' },
  { id: 'act-004', time: '10:30', message: 'PC-Floor1-02 went offline', type: 'error' },
  { id: 'act-005', time: '10:15', message: 'Scheduled backup completed on Web-Server-01', type: 'info' },
  { id: 'act-006', time: '09:55', message: 'VLAN-20 packet loss threshold alert cleared', type: 'success' },
  { id: 'act-007', time: '09:40', message: 'Firewall-01 firmware update applied', type: 'info' },
  { id: 'act-008', time: '09:20', message: 'AP-Floor2-01 connected clients: 14', type: 'info' },
]
