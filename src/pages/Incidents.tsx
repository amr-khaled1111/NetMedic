import React, { useState, useMemo } from 'react'
import { Search, Plus, Eye, MessageSquare, ChevronDown } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { mockIncidents } from '../data/mockIncidents'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { StatusDot } from '../components/ui/StatusDot'
import { useToast } from '../components/ui/Toast'
import { getSeverityColor, getStatusColor, statusLabel, formatDateTime } from '../utils/format'
import type { Incident, IncidentStatus } from '../types'

const ALL_STATUSES: IncidentStatus[] = [
  'new', 'investigating', 'diagnosed', 'awaiting_approval', 'recovering', 'resolved', 'failed'
]

export function Incidents() {
  const { demoIncident } = useDemo()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [noteText, setNoteText] = useState('')
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)

  const allIncidents = useMemo(() => [
    ...(demoIncident ? [demoIncident] : []),
    ...incidents,
  ], [demoIncident, incidents])

  const filtered = useMemo(() =>
    allIncidents.filter(inc => {
      const q = search.toLowerCase()
      return (
        (inc.title.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q) || inc.affectedDevice.toLowerCase().includes(q)) &&
        (severityFilter === 'all' || inc.severity === severityFilter) &&
        (statusFilter === 'all' || inc.status === statusFilter)
      )
    }),
    [allIncidents, search, severityFilter, statusFilter]
  )

  const updateStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc))
    if (selectedIncident?.id === id) setSelectedIncident(prev => prev ? { ...prev, status } : prev)
    toast(`Status updated to ${statusLabel(status)}.`, 'success')
  }

  const addNote = (id: string) => {
    if (!noteText.trim()) return
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Admin User',
      timestamp: new Date().toISOString(),
      content: noteText.trim(),
    }
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, notes: [...inc.notes, newNote] } : inc
    ))
    setSelectedIncident(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : prev)
    setNoteText('')
    toast('Note added.', 'success')
  }

  const statusCount = (s: string) => allIncidents.filter(i => i.status === s).length

  return (
    <div className="space-y-5">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Critical', filter: 'critical', color: 'text-red-700 bg-red-50 border-red-200', count: allIncidents.filter(i => i.severity === 'critical').length },
          { label: 'Open', filter: 'new', color: 'text-blue-700 bg-blue-50 border-blue-200', count: statusCount('new') },
          { label: 'Investigating', filter: 'investigating', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', count: statusCount('investigating') },
          { label: 'Resolved', filter: 'resolved', color: 'text-teal-700 bg-teal-50 border-teal-200', count: statusCount('resolved') },
        ].map(({ label, filter, color, count }) => (
          <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer hover:opacity-80 ${color}`}
            onClick={() => setSeverityFilter(f => f === filter ? 'all' : filter)}>
            <span>{label}</span>
            <span className="font-bold">{count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents ({filtered.length})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search incidents…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30 w-44"
              />
            </div>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">No incidents match the current filters.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(inc => (
                <div key={inc.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="flex items-start gap-3 min-w-0">
                    <StatusDot status={inc.status} pulse={inc.status === 'new'} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-gray-400">{inc.id}</span>
                        <Badge className={getSeverityColor(inc.severity)}>{inc.severity.toUpperCase()}</Badge>
                        <Badge className={getStatusColor(inc.status)}>{statusLabel(inc.status)}</Badge>
                      </div>
                      <p className="text-sm font-semibold text-brand-dark mt-0.5">{inc.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-sm">{inc.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {inc.affectedDevice} · {formatDateTime(inc.detectionTime)}
                        {inc.notes.length > 0 && ` · ${inc.notes.length} note${inc.notes.length > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedIncident(inc)}>
                      Details
                    </Button>
                    {inc.status !== 'resolved' && inc.status !== 'failed' && (
                      <div className="relative group">
                        <Button variant="outline" size="sm" iconRight={<ChevronDown className="w-3 h-3" />}>
                          Status
                        </Button>
                        <div className="absolute right-0 top-8 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 hidden group-hover:block">
                          {ALL_STATUSES.filter(s => s !== inc.status).map(s => (
                            <button key={s} onClick={() => updateStatus(inc.id, s)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl flex items-center gap-2">
                              <StatusDot status={s} size="sm" />
                              {statusLabel(s)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident detail modal */}
      <Modal
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident?.id ?? ''}
        size="lg"
      >
        {selectedIncident && (
          <div className="space-y-4 max-h-[72vh] overflow-y-auto scrollbar-thin pr-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getSeverityColor(selectedIncident.severity)}>{selectedIncident.severity.toUpperCase()}</Badge>
              <Badge className={getStatusColor(selectedIncident.status)}>{statusLabel(selectedIncident.status)}</Badge>
            </div>
            <h3 className="text-base font-semibold text-brand-dark">{selectedIncident.title}</h3>
            <p className="text-sm text-gray-700">{selectedIncident.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Affected Device', selectedIncident.affectedDevice],
                ['Detected', formatDateTime(selectedIncident.detectionTime)],
                ...(selectedIncident.affectedLink ? [['Affected Link', selectedIncident.affectedLink]] : []),
                ...(selectedIncident.resolvedTime ? [['Resolved', formatDateTime(selectedIncident.resolvedTime)]] : []),
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-sm font-medium text-gray-800">{v}</p>
                </div>
              ))}
            </div>

            {/* Change status */}
            {selectedIncident.status !== 'resolved' && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.filter(s => s !== selectedIncident.status).map(s => (
                    <button key={s} onClick={() => updateStatus(selectedIncident.id, s)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs hover:bg-gray-50 transition-colors">
                      <StatusDot status={s} size="sm" />
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Investigation Notes ({selectedIncident.notes.length})
              </p>
              {selectedIncident.notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No notes yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedIncident.notes.map(note => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-brand-blue">{note.author}</span>
                        <span className="text-xs text-gray-400">{formatDateTime(note.timestamp)}</span>
                      </div>
                      <p className="text-xs text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <input
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNote(selectedIncident.id)}
                  placeholder="Add investigation note…"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => addNote(selectedIncident.id)}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
