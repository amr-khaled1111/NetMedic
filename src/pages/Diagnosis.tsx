import { useState } from 'react'
import {
  Brain, Play, AlertTriangle, CheckCircle, ChevronRight,
  Cpu, Radio, TrendingUp, Zap, Info, RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getSeverityColor, formatDateTime } from '../utils/format'
import { useToast } from '../components/ui/Toast'

const EXAMPLE_INCIDENTS = [
  { id: 'ex-1', title: 'High Latency', icon: TrendingUp, desc: 'Sustained latency above 50ms on core links', cause: 'Network congestion on uplink', severity: 'high' },
  { id: 'ex-2', title: 'Packet Loss',  icon: Radio,      desc: '3.2% packet loss on distribution switch', cause: 'CRC errors on interface GE0/0/2', severity: 'medium' },
  { id: 'ex-3', title: 'Congestion',   icon: Cpu,        desc: 'Interface utilization >95% on WAN link', cause: 'Bandwidth saturation from backup jobs', severity: 'high' },
  { id: 'ex-4', title: 'Interface Errors', icon: AlertTriangle, desc: 'Rising error counters on Dist-SW-02', cause: 'Duplex mismatch on access port', severity: 'medium' },
  { id: 'ex-5', title: 'Link Degradation', icon: Zap,    desc: 'Primary WAN link signal degradation',   cause: 'Physical layer fault — fiber attenuation', severity: 'critical' },
]

type DiagStep = 'collecting' | 'analyzing' | 'correlating' | 'scoring' | 'done'

export function Diagnosis() {
  const navigate = useNavigate()
  const { demoState, runDiagnosis, isRunningDiagnosis } = useDemo()
  const { toast } = useToast()
  const [diagStep, setDiagStep] = useState<DiagStep | null>(null)
  const [stepProgress, setStepProgress] = useState(0)

  const handleRunDiagnosis = async () => {
    if (!demoState.networkDegraded) {
      toast('Simulate a network issue first from the Dashboard.', 'warning')
      return
    }
    // Animate diagnosis steps
    const steps: DiagStep[] = ['collecting', 'analyzing', 'correlating', 'scoring']
    for (const step of steps) {
      setDiagStep(step)
      for (let p = 0; p <= 100; p += 25) {
        await new Promise(r => setTimeout(r, 200))
        setStepProgress(p)
      }
    }
    setDiagStep('done')
    await runDiagnosis()
  }

  const result = demoState.diagnosisResult

  const diagStepLabels: Record<DiagStep, string> = {
    collecting:  'Collecting network telemetry…',
    analyzing:   'Analyzing metric anomalies…',
    correlating: 'Correlating events and evidence…',
    scoring:     'Computing confidence score…',
    done:        'Analysis complete',
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card className="gradient-brand-soft border-brand-teal/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-brand-dark">AI Diagnosis Engine</h2>
              <p className="text-xs text-gray-500">Simulated AI-powered anomaly detection and root cause analysis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4" />}
              loading={isRunningDiagnosis}
              onClick={handleRunDiagnosis}
              disabled={!!result}
            >
              {isRunningDiagnosis ? 'Running Diagnosis…' : result ? 'Diagnosis Complete' : 'Run Network Diagnosis'}
            </Button>
            {result && (
              <Button variant="outline" size="md" icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Demo notice */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700">
            <strong>Simulated Results:</strong> This diagnosis engine is a frontend prototype.
            All results, confidence scores, and evidence are pre-programmed demo data. No real AI model is connected.
          </p>
        </div>
      </Card>

      {/* Diagnosis animation */}
      {isRunningDiagnosis && diagStep && (
        <Card>
          <CardHeader><CardTitle>Diagnosis in Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['collecting', 'analyzing', 'correlating', 'scoring'] as DiagStep[]).map((step, i) => {
                const steps: DiagStep[] = ['collecting', 'analyzing', 'correlating', 'scoring']
                const currentIdx = steps.indexOf(diagStep)
                const thisIdx = i
                const done = thisIdx < currentIdx
                const active = thisIdx === currentIdx
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-teal-100' : active ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {done
                        ? <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        : active
                        ? <div className="w-3 h-3 rounded-full bg-brand-blue animate-pulse" />
                        : <div className="w-3 h-3 rounded-full bg-gray-300" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${active ? 'text-brand-dark font-medium' : done ? 'text-gray-400' : 'text-gray-300'}`}>
                        {diagStepLabels[step]}
                      </p>
                      {active && (
                        <ProgressBar value={stepProgress} size="sm" className="mt-1 w-48" barClassName="bg-brand-blue" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Alert banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-red-800">Anomaly Detected</p>
                <Badge className={getSeverityColor(result.severity)}>{result.severity.toUpperCase()}</Badge>
                <span className="text-xs text-red-600">Score: {result.anomalyScore.toFixed(2)}</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{result.rootCause}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="text-2xl font-bold text-brand-blue">{result.confidenceScore}%</p>
            </div>
          </div>

          {/* Two-column details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Detection details */}
            <Card>
              <CardHeader><CardTitle>Detection Details</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {[
                    ['Anomaly Detected', result.anomalyDetected ? 'Yes' : 'No'],
                    ['Anomaly Score', result.anomalyScore.toFixed(2) + ' / 1.00'],
                    ['Affected Device', result.affectedDevice],
                    ['Affected Link', result.affectedLink],
                    ['Detection Time', formatDateTime(result.detectionTime)],
                    ['Confidence Score', result.confidenceScore + '%'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-xs text-gray-500">{k}</span>
                      <span className="text-xs font-semibold text-gray-800 text-right max-w-[180px]">{v}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Abnormal metrics */}
            <Card>
              <CardHeader><CardTitle>Abnormal Metrics</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.abnormalMetrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-red-700">{m}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Root cause + evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Root Cause Analysis</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-3">
                  <p className="text-sm font-semibold text-orange-800 mb-1">Identified Root Cause</p>
                  <p className="text-sm text-orange-700">{result.rootCause}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Supporting Evidence</p>
                  {result.evidence.map((e, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700">{e}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recommended Action</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <p className="text-sm font-semibold text-teal-800">{result.recommendedAction}</p>
                  </div>
                  <p className="text-xs text-teal-700">{result.recommendedActionDetail}</p>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-semibold text-brand-blue">{result.confidenceScore}%</span>
                  </div>
                  <ProgressBar value={result.confidenceScore} barClassName="bg-brand-teal" />
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/recovery')}
                >
                  Proceed to Recovery Center →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Example incidents */}
      {!result && (
        <Card>
          <CardHeader>
            <CardTitle>Example Diagnosable Incidents</CardTitle>
            <span className="text-xs text-gray-400">Pre-loaded demo scenarios</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {EXAMPLE_INCIDENTS.map(inc => {
                const Icon = inc.icon
                return (
                  <div key={inc.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-brand-blue hover:bg-blue-50/20 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-brand-blue" />
                      <span className="text-sm font-semibold text-brand-dark">{inc.title}</span>
                      <Badge className={`ml-auto ${getSeverityColor(inc.severity)}`}>{inc.severity}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{inc.desc}</p>
                    <p className="text-xs text-teal-700 font-medium">Root cause: {inc.cause}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
