import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  DemoState,
  DemoStep,
  DiagnosisResult,
  RecoveryAction,
  Incident,
  DashboardMetrics,
  Report,
} from '../types'
import { normalMetrics, degradedMetrics, recoveredMetrics } from '../data/mockMetrics'
import { getDemoIncident } from '../data/mockIncidents'
import { generateDemoReport } from '../data/mockReports'

interface DemoContextValue {
  demoState: DemoState
  metrics: DashboardMetrics
  demoIncident: Incident | null
  demoReport: Report | null
  simulateNetworkIssue: () => void
  runDiagnosis: () => Promise<void>
  approveRecovery: () => Promise<void>
  generateReport: () => void
  resetDemo: () => void
  isRunningDiagnosis: boolean
  isExecutingRecovery: boolean
}

const DemoContext = createContext<DemoContextValue | null>(null)

const DEMO_DIAGNOSIS: DiagnosisResult = {
  id: 'diag-demo-001',
  incidentId: 'INC-2024-DEMO',
  anomalyDetected: true,
  anomalyScore: 0.94,
  affectedDevice: 'Core-Router-01',
  affectedLink: 'link-001 (GE0/0/0 → ISP-Gateway)',
  abnormalMetrics: ['Latency (+3450%)', 'Packet Loss (+1580%)', 'Throughput (−63%)', 'Jitter (+960%)', 'Retransmissions (+2340%)'],
  detectionTime: new Date().toISOString(),
  rootCause: 'Physical layer degradation on primary WAN link GE0/0/0. Likely cause: fiber optic signal attenuation or hardware fault on upstream ISP equipment.',
  evidence: [
    'Interface retransmission rate increased 2340% in under 2 minutes',
    'Jitter measured at 48ms (normal: <5ms)',
    'Signal-to-noise ratio dropped below acceptable threshold',
    'Error counters on GE0/0/0 rising at 340 errors/minute',
    'Backup link (Core-Router-02) shows zero anomalies',
    'All other network paths functioning normally',
  ],
  confidenceScore: 94,
  recommendedAction: 'Switch traffic to the backup network path',
  recommendedActionDetail:
    'Failover primary traffic from Core-Router-01 GE0/0/0 to backup path via Core-Router-02. Expected improvement: latency <5ms, packet loss <0.5%, full throughput restoration.',
  severity: 'critical',
}

const DEMO_RECOVERY: RecoveryAction = {
  id: 'rec-demo-001',
  incidentId: 'INC-2024-DEMO',
  problem: 'Primary WAN link degradation causing 142ms latency and 8.4% packet loss',
  proposedAction: 'Failover traffic to backup path via Core-Router-02',
  targetDevice: 'Core-Router-01 / Core-Router-02',
  riskLevel: 'low',
  expectedImprovement: 'Latency: 142ms → <5ms | Packet Loss: 8.4% → <0.5% | Throughput: 312 → 850+ Mbps',
  status: 'pending',
  progress: 0,
  beforeMetrics: { latency: 142, packetLoss: 8.4, throughput: 312, healthScore: 61 },
}

const initialDemoState: DemoState = {
  step: 'idle',
  networkDegraded: false,
  diagnosisResult: null,
  recoveryAction: null,
  reportGenerated: false,
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>(initialDemoState)
  const [metrics, setMetrics] = useState<DashboardMetrics>(normalMetrics)
  const [demoIncident, setDemoIncident] = useState<Incident | null>(null)
  const [demoReport, setDemoReport] = useState<Report | null>(null)
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false)
  const [isExecutingRecovery, setIsExecutingRecovery] = useState(false)

  const simulateNetworkIssue = useCallback(() => {
    setMetrics(degradedMetrics)
    setDemoIncident(getDemoIncident())
    setDemoState(s => ({ ...s, step: 'issue_simulated', networkDegraded: true }))
  }, [])

  const runDiagnosis = useCallback(async () => {
    setIsRunningDiagnosis(true)
    setDemoState(s => ({ ...s, step: 'diagnosing' }))
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 3200))
    setDemoState(s => ({
      ...s,
      step: 'diagnosed',
      diagnosisResult: DEMO_DIAGNOSIS,
      recoveryAction: DEMO_RECOVERY,
    }))
    setDemoIncident(prev => prev ? { ...prev, status: 'diagnosed' } : prev)
    setIsRunningDiagnosis(false)
  }, [])

  const approveRecovery = useCallback(async () => {
    setIsExecutingRecovery(true)
    setDemoState(s => ({
      ...s,
      step: 'recovering',
      recoveryAction: s.recoveryAction
        ? { ...s.recoveryAction, status: 'executing', progress: 0 }
        : null,
    }))
    setDemoIncident(prev => prev ? { ...prev, status: 'recovering' } : prev)

    // Simulate step-by-step progress
    for (let progress = 10; progress <= 100; progress += 10) {
      await new Promise(r => setTimeout(r, 300))
      setDemoState(s => ({
        ...s,
        recoveryAction: s.recoveryAction
          ? { ...s.recoveryAction, progress }
          : null,
      }))
    }

    // Apply recovered metrics
    setMetrics(recoveredMetrics)
    setDemoState(s => ({
      ...s,
      step: 'recovered',
      networkDegraded: false,
      recoveryAction: s.recoveryAction
        ? {
            ...s.recoveryAction,
            status: 'completed',
            progress: 100,
            afterMetrics: { latency: 3, packetLoss: 0.1, throughput: 891, healthScore: 96 },
          }
        : null,
    }))
    setDemoIncident(prev =>
      prev
        ? { ...prev, status: 'resolved', resolvedTime: new Date().toISOString() }
        : prev
    )
    setIsExecutingRecovery(false)
  }, [])

  const generateReport = useCallback(() => {
    const report = generateDemoReport('INC-2024-DEMO')
    setDemoReport(report)
    setDemoState(s => ({ ...s, step: 'report_generated', reportGenerated: true }))
  }, [])

  const resetDemo = useCallback(() => {
    setDemoState(initialDemoState)
    setMetrics(normalMetrics)
    setDemoIncident(null)
    setDemoReport(null)
    setIsRunningDiagnosis(false)
    setIsExecutingRecovery(false)
  }, [])

  return (
    <DemoContext.Provider
      value={{
        demoState,
        metrics,
        demoIncident,
        demoReport,
        simulateNetworkIssue,
        runDiagnosis,
        approveRecovery,
        generateReport,
        resetDemo,
        isRunningDiagnosis,
        isExecutingRecovery,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
