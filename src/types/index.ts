// ─── Device & Network ────────────────────────────────────────────────────────

export type DeviceStatus = 'online' | 'warning' | 'critical' | 'offline'
export type DeviceType = 'router' | 'switch' | 'server' | 'pc' | 'firewall' | 'ap'

export interface Device {
  id: string
  name: string
  type: DeviceType
  ipAddress: string
  vlan: string
  status: DeviceStatus
  cpuUsage: number
  memoryUsage: number
  latency: number
  lastSeen: string
  location: string
  model: string
  uptime: string
}

export interface NetworkLink {
  id: string
  source: string
  destination: string
  interface: string
  status: 'up' | 'degraded' | 'down'
  bandwidth: string
  utilization: number
  packetLoss: number
  latency: number
  isPrimary: boolean
  isActive: boolean
}

export interface VLAN {
  id: string
  vlanId: number
  name: string
  subnet: string
  connectedDevices: number
  avgLatency: number
  packetLoss: number
  healthScore: number
}

// ─── Incidents ───────────────────────────────────────────────────────────────

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus =
  | 'new'
  | 'investigating'
  | 'diagnosed'
  | 'awaiting_approval'
  | 'recovering'
  | 'resolved'
  | 'failed'

export interface IncidentNote {
  id: string
  author: string
  timestamp: string
  content: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: IncidentSeverity
  affectedDevice: string
  affectedLink?: string
  detectionTime: string
  status: IncidentStatus
  notes: IncidentNote[]
  resolvedTime?: string
}

// ─── Diagnosis ───────────────────────────────────────────────────────────────

export interface DiagnosisResult {
  id: string
  incidentId: string
  anomalyDetected: boolean
  anomalyScore: number
  affectedDevice: string
  affectedLink: string
  abnormalMetrics: string[]
  detectionTime: string
  rootCause: string
  evidence: string[]
  confidenceScore: number
  recommendedAction: string
  recommendedActionDetail: string
  severity: IncidentSeverity
}

// ─── Recovery ────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high'
export type RecoveryStatus = 'pending' | 'approved' | 'executing' | 'completed' | 'failed'

export interface RecoveryAction {
  id: string
  incidentId: string
  problem: string
  proposedAction: string
  targetDevice: string
  riskLevel: RiskLevel
  expectedImprovement: string
  status: RecoveryStatus
  progress: number
  beforeMetrics?: MetricSnapshot
  afterMetrics?: MetricSnapshot
}

export interface MetricSnapshot {
  latency: number
  packetLoss: number
  throughput: number
  healthScore: number
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export type ReportType = 'performance' | 'incident' | 'diagnosis' | 'recovery' | 'comparison'
export type ReportStatus = 'draft' | 'final' | 'archived'

export interface Report {
  id: string
  title: string
  type: ReportType
  createdAt: string
  relatedIncident?: string
  status: ReportStatus
  summary: string
  sections: ReportSection[]
}

export interface ReportSection {
  title: string
  content: string
}

// ─── Topology ────────────────────────────────────────────────────────────────

export interface TopologyNode {
  id: string
  label: string
  type: DeviceType
  status: DeviceStatus
  x: number
  y: number
  ipAddress: string
  details: Record<string, string>
}

export interface TopologyEdge {
  id: string
  source: string
  target: string
  status: 'up' | 'degraded' | 'down'
  bandwidth: string
  utilization: number
  isPrimary: boolean
  isActive: boolean
}

// ─── Packet Tracer Projects ───────────────────────────────────────────────────

export interface PTProject {
  id: string
  name: string
  description: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  isActive: boolean
  status: 'ready' | 'processing' | 'error'
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  time: string
  value: number
  value2?: number
}

export interface DashboardMetrics {
  healthScore: number
  totalDevices: number
  activeDevices: number
  devicesWithIssues: number
  activeAlerts: number
  avgLatency: number
  packetLoss: number
  throughput: number
}

// ─── Demo State ───────────────────────────────────────────────────────────────

export type DemoStep =
  | 'idle'
  | 'issue_simulated'
  | 'diagnosing'
  | 'diagnosed'
  | 'recovering'
  | 'recovered'
  | 'report_generated'

export interface DemoState {
  step: DemoStep
  networkDegraded: boolean
  diagnosisResult: DiagnosisResult | null
  recoveryAction: RecoveryAction | null
  reportGenerated: boolean
}
