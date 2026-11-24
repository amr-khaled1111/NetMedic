import React, { useState } from 'react'
import {
  Wrench, CheckCircle, Play, AlertTriangle, TrendingDown,
  TrendingUp, ArrowRight, Shield, Clock, Info, RotateCcw
} from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import { getRiskColor, formatDateTime } from '../utils/format'
import { useToast } from '../components/ui/Toast'
import type { RecoveryAction } from '../types'

const STATIC_ACTIONS: RecoveryAction[] = [
  {
    id: 'rec-002',
    incidentId: 'INC-2024-003',
    problem: 'Dist-Switch-02 latency spike due to CRC errors on GE0/0/2',
    proposedAction: 'Reroute traffic through Dist-Switch-01 and schedule SFP replacement',
    targetDevice: 'Dist-Switch-02',
    riskLevel: 'low',
    expectedImprovement: 'Latency: 12ms → 2ms | Error rate → 0%',
    status: 'completed',
    progress: 100,
    beforeMetrics: { latency: 12, packetLoss: 0.4, throughput: 650, healthScore: 78 },
    afterMetrics:  { latency: 2,  packetLoss: 0.0, throughput: 980, healthScore: 97 },
  },
  {
    id: 'rec-003',
    incidentId: 'INC-2024-001',
    problem: 'DB-Server-01 sustained CPU >85% impacting query performance',
    proposedAction: 'Terminate non-critical background processes and apply query plan cache flush',
    targetDevice: 'DB-Server-01',
    riskLevel: 'medium',
    expectedImprovement: 'CPU: 88% → ~50% | Query response time −40%',
    status: 'pending',
    progress: 0,
  },
]

const STEPS = [
  'Verifying backup path availability',
  'Updating routing tables',
  'Redirecting traffic flows',
  'Verifying connectivity',
  'Measuring post-recovery metrics',
]

export function Recovery() {
  const { demoState, approveRecovery, isExecutingRecovery, resetDemo } = useDemo()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const demoAction = demoState.recoveryAction
  const allActions = [
    ...(demoAction ? [demoAction] : []),
    ...STATIC_ACTIONS,
  ]

  const handleApprove = async () => {
    setConfirmOpen(false)
    setCurrentStep(0)
    // Animate steps
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, 600))
    }
    await approveRecovery()
    setCurrentStep(-1)
    toast('Recovery completed successfully!', 'success')
  }

  const statusColors: Record<string, string> = {
    pending: 'text-blue-700 bg-blue-50 border-blue-200',
    approved: 'text-purple-700 bg-purple-50 border-purple-200',
    executing: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    completed: 'text-teal-700 bg-teal-50 border-teal-200',
    failed: 'text-red-600 bg-red-50 border-red-200',
  }

  const MetricDiff = ({ label, before, after, unit, lowerIsBetter = false }:
    { label: string; before: number; after: number; unit: string; lowerIsBetter?: boolean }) => {
    const improved = lowerIsBetter ? after < before : after > before
    const pct = Math.abs(((after - before) / before) * 100).toFixed(1)
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-400">{before}{unit}</span>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <span className={`text-xl font-bold ${improved ? 'text-teal-600' : 'text-red-500'}`}>{after}{unit}</span>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${improved ? 'text-teal-600' : 'text-red-500'}`}>
          {improved ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {improved ? '−' : '+'}{pct}% {improved ? 'improvement' : 'degradation'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <Card className="gradient-brand-soft border-brand-teal/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-brand-dark">Recovery Center</h2>
            <p className="text-xs text-gray-500">Review and execute AI-recommended corrective actions</p>
          </div>
          {demoState.step === 'recovered' && (
            <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="ml-auto text-gray-500" onClick={resetDemo}>Reset Demo</Button>
          )}
        </div>
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-xs text-yellow-700">
            <strong>Simulation Only:</strong> Recovery actions are frontend simulations. No real network commands are executed.
          </p>
        </div>
      </Card>

      {/* Execution animation */}
      {isExecutingRecovery && currentStep >= 0 && (
        <Card>
          <CardHeader><CardTitle>Executing Recovery…</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < currentStep ? 'bg-teal-100' : i === currentStep ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {i < currentStep
                      ? <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      : i === currentStep
                      ? <div className="w-3 h-3 rounded-full bg-brand-blue animate-pulse" />
                      : <div className="w-3 h-3 rounded-full bg-gray-300" />}
                  </div>
                  <span className={`text-sm ${i < currentStep ? 'text-gray-400' : i === currentStep ? 'text-brand-dark font-medium' : 'text-gray-300'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            {demoAction && (
              <ProgressBar value={demoAction.progress} barClassName="bg-brand-teal" />
            )}
          </CardContent>
        </Card>
      )}

      {/* Recovery actions */}
      {allActions.map(action => (
        <Card key={action.id} className={action.incidentId === 'INC-2024-DEMO' ? 'border-brand-teal' : ''}>
          <CardHeader>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle>{action.incidentId}</CardTitle>
              <Badge className={statusColors[action.status]}>
                {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
              </Badge>
              <Badge className={getRiskColor(action.riskLevel)}>
                <Shield className="w-2.5 h-2.5 mr-1" />
                {action.riskLevel.charAt(0).toUpperCase() + action.riskLevel.slice(1)} Risk
              </Badge>
              {action.incidentId === 'INC-2024-DEMO' && (
                <Badge className="text-brand-blue bg-blue-50 border-blue-200 ml-auto">Demo Scenario</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2 space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Problem
                  </p>
                  <p className="text-sm text-red-800">{action.problem}</p>
                </div>
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
                  <p className="text-xs text-teal-600 font-medium mb-1 flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> Proposed Action
                  </p>
                  <p className="text-sm text-teal-800">{action.proposedAction}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">Target Device</p>
                    <p className="text-sm font-medium text-gray-800">{action.targetDevice}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">Expected Improvement</p>
                    <p className="text-xs font-medium text-gray-800">{action.expectedImprovement}</p>
                  </div>
                </div>
              </div>

              {/* Action button panel */}
              <div className="flex flex-col gap-3">
                {action.status === 'pending' && (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                      <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-blue-700 font-medium">Awaiting approval</p>
                      <p className="text-xs text-blue-500 mt-1">Review and approve to execute</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="md"
                      icon={<Play className="w-4 h-4" />}
                      className="w-full"
                      disabled={!demoState.diagnosisResult && action.incidentId === 'INC-2024-DEMO'}
                      onClick={() => setConfirmOpen(true)}
                    >
                      Approve & Execute
                    </Button>
                    {!demoState.diagnosisResult && action.incidentId === 'INC-2024-DEMO' && (
                      <p className="text-xs text-gray-400 text-center">Run AI Diagnosis first</p>
                    )}
                  </>
                )}

                {action.status === 'executing' && (
                  <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
                    <div className="w-6 h-6 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mx-auto mb-2" />
                    <p className="text-xs text-indigo-700 font-medium">Executing…</p>
                    <ProgressBar value={action.progress} className="mt-2" barClassName="bg-indigo-500" />
                  </div>
                )}

                {action.status === 'completed' && (
                  <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
                    <CheckCircle className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                    <p className="text-xs text-teal-700 font-semibold">Recovery Successful</p>
                    <p className="text-xs text-teal-500 mt-1">Network restored to normal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Before/After comparison */}
            {action.status === 'completed' && action.beforeMetrics && action.afterMetrics && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                  Before / After Performance Comparison
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricDiff label="Latency" before={action.beforeMetrics.latency} after={action.afterMetrics.latency} unit="ms" lowerIsBetter />
                  <MetricDiff label="Packet Loss" before={action.beforeMetrics.packetLoss} after={action.afterMetrics.packetLoss} unit="%" lowerIsBetter />
                  <MetricDiff label="Throughput" before={action.beforeMetrics.throughput} after={action.afterMetrics.throughput} unit=" Mbps" />
                  <MetricDiff label="Health Score" before={action.beforeMetrics.healthScore} after={action.afterMetrics.healthScore} unit="/100" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Recovery Execution" size="sm">
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-yellow-800 mb-1">⚠ Please Confirm</p>
            <p className="text-xs text-yellow-700">
              You are about to execute the recommended recovery action.
              In a production environment, this would modify active network configurations.
              <br /><strong>This is a demo simulation — no real changes will be made.</strong>
            </p>
          </div>
          <div className="bg-teal-50 rounded-lg p-3">
            <p className="text-xs text-teal-700 font-medium">Action: Failover traffic to backup path via Core-Router-02</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="secondary" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={handleApprove}>
              Confirm & Execute
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
