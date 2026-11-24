import type { Report } from '../types'

export const mockReports: Report[] = [
  {
    id: 'RPT-2024-001',
    title: 'Weekly Network Performance Report',
    type: 'performance',
    createdAt: '2024-03-15T08:00:00Z',
    status: 'final',
    summary: 'Network performance remained stable throughout the week with 99.4% average availability. Two minor incidents were detected and resolved automatically. Average latency improved by 12% compared to last week.',
    sections: [
      { title: 'Executive Summary', content: 'The network operated within acceptable parameters for the reporting period. Overall health score averaged 94/100.' },
      { title: 'Availability', content: 'Network availability: 99.4%. Planned maintenance windows accounted for 0.3% downtime. Unplanned outages: 0.3%.' },
      { title: 'Performance Metrics', content: 'Average latency: 4ms (target: <10ms). Average packet loss: 0.2% (target: <1%). Peak throughput: 1.2 Gbps.' },
      { title: 'Incidents', content: 'Two medium-severity incidents detected. Both resolved within SLA. No critical incidents during this period.' },
      { title: 'Recommendations', content: 'Consider upgrading DB-Server-01 memory to prevent recurrence of high memory usage alerts.' },
    ],
  },
  {
    id: 'RPT-2024-002',
    title: 'Incident Report – INC-2024-005',
    type: 'incident',
    createdAt: '2024-03-15T09:35:00Z',
    relatedIncident: 'INC-2024-005',
    status: 'final',
    summary: 'VLAN-20 packet loss anomaly caused by misconfigured QoS policy. Detected at 07:15, resolved at 09:30. Total duration: 2h 15m.',
    sections: [
      { title: 'Incident Timeline', content: '07:15 – Anomaly detected. 07:20 – Alert generated. 08:00 – Investigation started. 09:00 – Root cause identified. 09:30 – Recovery completed.' },
      { title: 'Root Cause', content: 'A QoS policy misconfiguration on Dist-Switch-01 caused asymmetric traffic prioritization, resulting in intermittent packet drops on VLAN-20.' },
      { title: 'Impact', content: 'Affected 2 distribution switches. Average packet loss reached 0.8% with peaks at 2.1%. No user-facing service disruption reported.' },
      { title: 'Resolution', content: 'QoS policy corrected via NetMedic Recovery Center. Configuration backup created post-resolution.' },
    ],
  },
  {
    id: 'RPT-2024-003',
    title: 'AI Diagnosis Report – INC-2024-003',
    type: 'diagnosis',
    createdAt: '2024-03-15T10:42:00Z',
    relatedIncident: 'INC-2024-003',
    status: 'final',
    summary: 'AI diagnosis identified CRC errors on Dist-Switch-02 GE0/0/2 as the root cause of observed latency spike. Confidence score: 91%.',
    sections: [
      { title: 'Anomaly Detection', content: 'Anomaly Score: 0.87. Detected at 10:38. Affected metrics: latency (12ms vs 2ms baseline), interface error counter increasing.' },
      { title: 'Root Cause Analysis', content: 'Physical layer issue on interface GE0/0/2. CRC error rate: 0.3% of frames. Likely cause: degraded cable or SFP module.' },
      { title: 'Supporting Evidence', content: 'Interface error counters increased 340% in 15 minutes. Latency spike correlates exactly with error rate increase. No upstream congestion detected.' },
      { title: 'Recommended Action', content: 'Replace SFP module on Dist-Switch-02 GE0/0/2. Temporarily reroute traffic through redundant path while maintenance is performed.' },
    ],
  },
  {
    id: 'RPT-2024-004',
    title: 'Recovery Report – VLAN-20 Packet Loss',
    type: 'recovery',
    createdAt: '2024-03-15T09:32:00Z',
    relatedIncident: 'INC-2024-005',
    status: 'final',
    summary: 'Automated recovery action successfully resolved VLAN-20 packet loss. Network metrics restored to baseline within 3 minutes of execution.',
    sections: [
      { title: 'Recovery Action', content: 'QoS policy reconfiguration on Dist-Switch-01. Action executed via NetMedic Recovery Engine. No manual intervention required.' },
      { title: 'Execution Log', content: 'Recovery initiated at 09:27. Configuration backup created. New QoS policy applied. Verification checks passed. Completed at 09:30.' },
      { title: 'Before/After Comparison', content: 'Before: Packet loss 0.8%, Latency 8ms, Health Score 72. After: Packet loss 0.0%, Latency 2ms, Health Score 98.' },
      { title: 'Verification', content: 'Post-recovery monitoring confirmed stable operation for 30 minutes. All metrics within normal thresholds. Incident marked resolved.' },
    ],
  },
]

export const generateDemoReport = (incidentId: string): Report => ({
  id: `RPT-${Date.now()}`,
  title: `Incident Recovery Report – ${incidentId}`,
  type: 'comparison',
  createdAt: new Date().toISOString(),
  relatedIncident: incidentId,
  status: 'final',
  summary:
    'Primary network link degradation detected, diagnosed, and resolved via automated backup path failover. Full service restored in under 5 minutes.',
  sections: [
    {
      title: 'Initial Problem',
      content:
        'Primary WAN link experienced severe degradation: latency 142ms (baseline 4ms), packet loss 8.4% (baseline <0.5%), throughput reduced to 312 Mbps from 847 Mbps.',
    },
    {
      title: 'AI Diagnosis',
      content:
        'NetMedic AI detected anomaly at confidence 94%. Root cause: physical layer degradation on primary link GE0/0/0. Supporting evidence: retransmission rate +2340%, jitter 48ms, SNR below threshold.',
    },
    {
      title: 'Recovery Action',
      content:
        'Recommended action: failover to backup network path via Core-Router-02. Risk level: Low. Expected improvement: latency <5ms, packet loss <0.5%, throughput >800 Mbps.',
    },
    {
      title: 'Verification Results',
      content:
        'Post-recovery metrics: latency 3ms ✓, packet loss 0.1% ✓, throughput 891 Mbps ✓, health score 96/100 ✓. Backup path stable. Incident resolved.',
    },
    {
      title: 'Before / After Metrics',
      content:
        'Latency: 142ms → 3ms (−97.9%). Packet Loss: 8.4% → 0.1% (−98.8%). Throughput: 312 Mbps → 891 Mbps (+185.6%). Health Score: 61 → 96 (+57.4%).',
    },
  ],
})
