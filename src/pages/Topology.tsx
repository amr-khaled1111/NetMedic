import React, { useState, useRef } from 'react'
import {
  Router, Layers, Server, Monitor, Shield, Wifi,
  ZoomIn, ZoomOut, Maximize2, Info, X
} from 'lucide-react'
import { mockTopologyNodes, mockTopologyEdges } from '../data/mockTopology'
import { useDemo } from '../context/DemoContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import type { TopologyNode, TopologyEdge } from '../types'

const NODE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  router:   Router,
  switch:   Layers,
  server:   Server,
  pc:       Monitor,
  firewall: Shield,
  ap:       Wifi,
}

const STATUS_COLORS: Record<string, string> = {
  online:   '#009999',
  warning:  '#FBC02D',
  critical: '#ef4444',
  offline:  '#94a3b8',
}

const EDGE_COLORS: Record<string, string> = {
  up:       '#009999',
  degraded: '#FBC02D',
  down:     '#ef4444',
}

export function Topology() {
  const { demoState } = useDemo()
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<TopologyEdge | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Modify topology if network is degraded
  const edges = mockTopologyEdges.map(e => {
    if (demoState.networkDegraded && e.id === 'e-003') {
      return { ...e, status: 'degraded' as const, utilization: 98 }
    }
    if (demoState.step === 'recovered' && e.id === 'e-005') {
      return { ...e, status: 'up' as const, isActive: true }
    }
    return e
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.node')) return
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  const statusCounts = {
    online:  mockTopologyNodes.filter(n => n.status === 'online').length,
    warning: mockTopologyNodes.filter(n => n.status === 'warning').length,
    offline: mockTopologyNodes.filter(n => n.status === 'offline').length,
  }

  return (
    <div className="space-y-4">
      {/* Legend + controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs capitalize text-gray-600">{status}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button onClick={() => setScale(s => Math.min(2, s + 0.2))}
              className="p-1 hover:bg-gray-100 rounded"><ZoomIn className="w-3.5 h-3.5" /></button>
            <span className="text-xs px-1 text-gray-600">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.max(0.4, s - 0.2))}
              className="p-1 hover:bg-gray-100 rounded"><ZoomOut className="w-3.5 h-3.5" /></button>
          </div>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }) }}
            className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Canvas */}
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Network Topology — Cisco Packet Tracer Simulation</span>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="text-teal-600 font-semibold">{statusCounts.online} Online</span>
                <span className="text-yellow-600 font-semibold">{statusCounts.warning} Warning</span>
                <span className="text-gray-400 font-semibold">{statusCounts.offline} Offline</span>
              </div>
            </div>
            <div
              className="relative overflow-hidden bg-white"
              style={{ height: 540, cursor: dragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: 'center center', transition: dragging ? 'none' : 'transform 0.1s' }}
              >
                {/* Grid dots */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#e2e8f0" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Edges */}
                {edges.map(edge => {
                  const src = mockTopologyNodes.find(n => n.id === edge.source)
                  const tgt = mockTopologyNodes.find(n => n.id === edge.target)
                  if (!src || !tgt) return null
                  const color = EDGE_COLORS[edge.status] ?? '#94a3b8'
                  const active = edge.isActive
                  return (
                    <g key={edge.id} onClick={() => { setSelectedEdge(edge); setSelectedNode(null) }} style={{ cursor: 'pointer' }}>
                      <line
                        x1={src.x + 24} y1={src.y + 24}
                        x2={tgt.x + 24} y2={tgt.y + 24}
                        stroke={color}
                        strokeWidth={active ? 2.5 : 1.5}
                        strokeDasharray={!active ? '6 4' : undefined}
                        opacity={active ? 1 : 0.5}
                      />
                      {/* Utilization label on middle of link */}
                      <text
                        x={(src.x + tgt.x) / 2 + 24}
                        y={(src.y + tgt.y) / 2 + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill={color}
                        fontFamily="Poppins, sans-serif"
                        fontWeight="500"
                      >
                        {edge.utilization}%
                      </text>
                    </g>
                  )
                })}

                {/* Nodes */}
                {mockTopologyNodes.map(node => {
                  const Icon = NODE_ICONS[node.type] ?? Server
                  const color = STATUS_COLORS[node.status] ?? '#94a3b8'
                  const isSelected = selectedNode?.id === node.id
                  return (
                    <g
                      key={node.id}
                      className="node"
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => { setSelectedNode(node); setSelectedEdge(null) }}
                      style={{ cursor: 'pointer' }}
                    >
                      {isSelected && (
                        <circle cx="24" cy="24" r="30" fill={color} opacity={0.15} />
                      )}
                      <rect
                        x="4" y="4" width="40" height="40" rx="10"
                        fill="white"
                        stroke={color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter="url(#shadow)"
                      />
                      <foreignObject x="12" y="12" width="24" height="24">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                      </foreignObject>
                      {/* Status dot */}
                      <circle cx="40" cy="8" r="5" fill={color} stroke="white" strokeWidth="1.5" />
                      {/* Label */}
                      <text
                        x="24" y="56"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#1E293B"
                        fontFamily="Poppins, sans-serif"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                      <text
                        x="24" y="68"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="Poppins, sans-serif"
                      >
                        {node.ipAddress}
                      </text>
                    </g>
                  )
                })}

                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#013462" floodOpacity="0.08" />
                  </filter>
                </defs>
              </svg>
              <p className="absolute bottom-2 right-3 text-[10px] text-gray-400">Drag to pan · Scroll to zoom</p>
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {!selectedNode && !selectedEdge && (
            <Card className="border-dashed">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Info className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">Click a device or link to view details</p>
              </div>
            </Card>
          )}

          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedNode.label}</CardTitle>
                <button onClick={() => setSelectedNode(null)}><X className="w-4 h-4 text-gray-400" /></button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedNode.status] }} />
                    <span className="text-xs capitalize font-medium text-gray-700">{selectedNode.status}</span>
                    <Badge className="text-blue-600 bg-blue-50 border-blue-200 ml-auto capitalize">{selectedNode.type}</Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500">IP Address</p>
                    <p className="text-xs font-mono font-medium">{selectedNode.ipAddress}</p>
                  </div>
                  {Object.entries(selectedNode.details).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500">{k}</p>
                      <p className="text-xs font-medium text-gray-800">{v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedEdge && (
            <Card>
              <CardHeader>
                <CardTitle>Link Details</CardTitle>
                <button onClick={() => setSelectedEdge(null)}><X className="w-4 h-4 text-gray-400" /></button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EDGE_COLORS[selectedEdge.status] }} />
                    <span className="text-xs capitalize font-medium">{selectedEdge.status}</span>
                  </div>
                  {[
                    ['Source', mockTopologyNodes.find(n => n.id === selectedEdge.source)?.label],
                    ['Target', mockTopologyNodes.find(n => n.id === selectedEdge.target)?.label],
                    ['Bandwidth', selectedEdge.bandwidth],
                    ['Utilization', `${selectedEdge.utilization}%`],
                    ['Type', selectedEdge.isPrimary ? 'Primary' : 'Backup'],
                    ['Active', selectedEdge.isActive ? 'Yes' : 'No'],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500">{k}</p>
                      <p className="text-xs font-medium text-gray-800">{v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Total Nodes', value: mockTopologyNodes.length },
                  { label: 'Total Links', value: mockTopologyEdges.length },
                  { label: 'Active Links', value: mockTopologyEdges.filter(e => e.isActive).length },
                  { label: 'Healthy Devices', value: statusCounts.online },
                  { label: 'Warning Devices', value: statusCounts.warning },
                  { label: 'Offline Devices', value: statusCounts.offline },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
