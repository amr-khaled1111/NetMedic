import type { Incident } from '../types'

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'High CPU Usage on DB-Server-01',
    description:
      'Database server CPU utilization has sustained above 85% for the past 20 minutes. This is impacting query response times across all connected applications.',
    severity: 'high',
    affectedDevice: 'DB-Server-01',
    detectionTime: '2024-03-15T09:50:00Z',
    status: 'investigating',
    notes: [
      {
        id: 'note-001',
        author: 'Admin User',
        timestamp: '2024-03-15T10:00:00Z',
        content: 'Investigating root cause. Checking running queries and processes.',
      },
    ],
  },
  {
    id: 'INC-2024-002',
    title: 'PC-Floor1-02 Offline',
    description:
      'Workstation PC-Floor1-02 at Floor 1 Office B has been unreachable since 08:30. ICMP pings are timing out.',
    severity: 'low',
    affectedDevice: 'PC-Floor1-02',
    detectionTime: '2024-03-15T08:30:00Z',
    status: 'new',
    notes: [],
  },
  {
    id: 'INC-2024-003',
    title: 'Dist-Switch-02 Latency Spike',
    description:
      'Distribution Switch 02 is showing latency values of 12ms, which is 6x the normal baseline of 2ms. Possible interface error or congestion on upstream link.',
    severity: 'medium',
    affectedDevice: 'Dist-Switch-02',
    affectedLink: 'link-003',
    detectionTime: '2024-03-15T10:38:00Z',
    status: 'diagnosed',
    notes: [
      {
        id: 'note-002',
        author: 'Admin User',
        timestamp: '2024-03-15T10:40:00Z',
        content: 'AI Diagnosis points to CRC errors on GE0/0/2. Monitoring closely.',
      },
    ],
  },
  {
    id: 'INC-2024-004',
    title: 'Primary WAN Link Degradation',
    description:
      'Primary WAN link between Core-Router-01 and ISP-Gateway is showing 8.4% packet loss and 142ms latency. Normal values are <0.5% and <10ms respectively.',
    severity: 'critical',
    affectedDevice: 'Core-Router-01',
    affectedLink: 'link-001',
    detectionTime: '2024-03-15T10:45:00Z',
    status: 'new',
    notes: [],
  },
  {
    id: 'INC-2024-005',
    title: 'VLAN-20 Packet Loss Anomaly',
    description:
      'VLAN-20 (Distribution) is experiencing intermittent packet loss averaging 0.8%, with peaks reaching 2.1%. Affecting 2 distribution switches.',
    severity: 'medium',
    affectedDevice: 'Dist-Switch-01',
    detectionTime: '2024-03-15T07:15:00Z',
    status: 'resolved',
    resolvedTime: '2024-03-15T09:30:00Z',
    notes: [
      {
        id: 'note-003',
        author: 'Admin User',
        timestamp: '2024-03-15T08:00:00Z',
        content: 'Traced to a misconfigured QoS policy. Applied fix via recovery action.',
      },
    ],
  },
  {
    id: 'INC-2024-006',
    title: 'AP-Floor2-01 Client Overload',
    description:
      'Wireless access point on Floor 2 has 31 connected clients, exceeding the recommended maximum of 25. Performance degradation reported by users.',
    severity: 'low',
    affectedDevice: 'AP-Floor2-01',
    detectionTime: '2024-03-14T14:00:00Z',
    status: 'resolved',
    resolvedTime: '2024-03-14T16:00:00Z',
    notes: [],
  },
]

export const getDemoIncident = (): Incident => ({
  id: 'INC-2024-DEMO',
  title: 'Primary Network Link Degradation – Demo Scenario',
  description:
    'Primary network path experiencing significant degradation. Latency increased to 142ms (baseline: 4ms). Packet loss at 8.4% (baseline: <0.5%). Throughput reduced by 63%.',
  severity: 'critical',
  affectedDevice: 'Core-Router-01',
  affectedLink: 'link-001',
  detectionTime: new Date().toISOString(),
  status: 'new',
  notes: [],
})
