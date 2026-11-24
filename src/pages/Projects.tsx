import React, { useState, useRef } from 'react'
import {
  Upload, FolderOpen, Trash2, Eye, CheckCircle, XCircle,
  FileText, Database, Package, Plus, Star
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useToast } from '../components/ui/Toast'
import { formatBytes, formatDateTime } from '../utils/format'
import type { PTProject } from '../types'

const SAMPLE_PROJECTS: PTProject[] = [
  {
    id: 'pt-001',
    name: 'Enterprise Core Network',
    description: 'Multi-layer enterprise topology with core, distribution, and access layers. Includes OSPF routing, HSRP redundancy, and QoS policies.',
    fileName: 'enterprise-core.pkt',
    fileSize: 245760,
    fileType: '.pkt',
    uploadedAt: '2024-03-10T09:00:00Z',
    isActive: true,
    status: 'ready',
  },
  {
    id: 'pt-002',
    name: 'Branch Office Topology',
    description: 'Small branch office with WAN connectivity, VPN tunnel, and local switching.',
    fileName: 'branch-office.pkt',
    fileSize: 102400,
    fileType: '.pkt',
    uploadedAt: '2024-03-12T14:00:00Z',
    isActive: false,
    status: 'ready',
  },
]

const ACCEPTED = ['.pkt', '.pka', '.csv', '.txt', '.log', '.zip']

export function Projects() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<PTProject[]>(SAMPLE_PROJECTS)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [viewProject, setViewProject] = useState<PTProject | null>(null)
  const [descriptionModal, setDescriptionModal] = useState<{ id: string; desc: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateUpload = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED.includes(ext)) {
      toast(`File type ${ext} is not supported.`, 'error')
      return
    }
    setUploading(true)
    setUploadProgress(0)
    for (let p = 0; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 200))
      setUploadProgress(p)
    }
    const newProject: PTProject = {
      id: `pt-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      description: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: ext,
      uploadedAt: new Date().toISOString(),
      isActive: false,
      status: 'ready',
    }
    setProjects(p => [...p, newProject])
    setUploading(false)
    setUploadProgress(0)
    toast(`${file.name} uploaded successfully.`, 'success')
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    Array.from(files).forEach(f => simulateUpload(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const setActive = (id: string) => {
    setProjects(p => p.map(proj => ({ ...proj, isActive: proj.id === id })))
    toast('Active demo network updated.', 'success')
  }

  const deleteProject = (id: string) => {
    setProjects(p => p.filter(proj => proj.id !== id))
    toast('Project removed.', 'info')
  }

  const saveDescription = () => {
    if (!descriptionModal) return
    setProjects(p => p.map(proj =>
      proj.id === descriptionModal.id ? { ...proj, description: descriptionModal.desc } : proj
    ))
    setDescriptionModal(null)
    toast('Description saved.', 'success')
  }

  const fileIcon = (type: string) => {
    if (type === '.csv') return <Database className="w-5 h-5 text-teal-600" />
    if (type === '.zip') return <Package className="w-5 h-5 text-purple-600" />
    return <FileText className="w-5 h-5 text-brand-blue" />
  }

  return (
    <div className="space-y-5">
      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Project Files</CardTitle>
          <span className="text-xs text-gray-400">.pkt · .pka · .csv · .txt · .log · .zip</span>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-brand-teal bg-teal-50' : 'border-gray-200 hover:border-brand-blue hover:bg-blue-50/30'
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? 'text-brand-teal' : 'text-gray-300'}`} />
            <p className="text-sm font-medium text-gray-700">
              {dragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED.join(',')}
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {uploading && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700">Uploading…</span>
                <span className="text-xs text-blue-600">{uploadProgress}%</span>
              </div>
              <ProgressBar value={uploadProgress} barClassName="bg-brand-blue" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects list */}
      <Card>
        <CardHeader>
          <CardTitle>Packet Tracer Projects ({projects.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-10">
              <FolderOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No projects yet. Upload a file to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    proj.isActive
                      ? 'border-brand-teal bg-teal-50/40'
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {fileIcon(proj.fileType)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-brand-dark truncate">{proj.name}</p>
                        {proj.isActive && (
                          <Badge className="text-teal-700 bg-teal-100 border-teal-200">
                            <Star className="w-2.5 h-2.5 mr-1" /> Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{proj.fileName} · {formatBytes(proj.fileSize)} · {proj.fileType.toUpperCase()}</p>
                      {proj.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{proj.description}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-0.5">Uploaded {formatDateTime(proj.uploadedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setViewProject(proj)}>View</Button>
                    <Button variant="ghost" size="sm"
                      onClick={() => setDescriptionModal({ id: proj.id, desc: proj.description })}>
                      Edit
                    </Button>
                    {!proj.isActive && (
                      <Button variant="outline" size="sm"
                        onClick={() => setActive(proj.id)}>
                        Set Active
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
                      onClick={() => deleteProject(proj.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV import notice */}
      <Card>
        <CardHeader>
          <CardTitle>Import Monitoring Data (CSV)</CardTitle>
          <Badge className="text-purple-600 bg-purple-50 border-purple-200">Separate from Projects</Badge>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
            <p className="font-medium mb-1">CSV Data Import</p>
            <p className="text-xs text-blue-600">
              Upload CSV files containing historical network monitoring data (device metrics, interface stats, event logs).
              This data is used to populate dashboard charts and reports. It is separate from Packet Tracer topology files.
            </p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-blue hover:bg-blue-50/30 transition-all"
          >
            <Database className="w-8 h-8 mx-auto mb-2 text-blue-300" />
            <p className="text-sm text-gray-600">Click to upload CSV monitoring data</p>
            <p className="text-xs text-gray-400 mt-1">Supported: .csv, .txt, .log</p>
          </div>
        </CardContent>
      </Card>

      {/* View modal */}
      <Modal open={!!viewProject} onClose={() => setViewProject(null)} title="Project Details" size="md">
        {viewProject && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {fileIcon(viewProject.fileType)}
              <div>
                <p className="font-semibold text-brand-dark">{viewProject.name}</p>
                <p className="text-xs text-gray-400">{viewProject.fileName}</p>
              </div>
              {viewProject.isActive && (
                <Badge className="ml-auto text-teal-700 bg-teal-50 border-teal-200">Active Network</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['File Name', viewProject.fileName],
                ['File Type', viewProject.fileType.toUpperCase()],
                ['File Size', formatBytes(viewProject.fileSize)],
                ['Uploaded', formatDateTime(viewProject.uploadedAt)],
                ['Status', viewProject.status],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-sm font-medium text-gray-800">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700">{viewProject.description || 'No description provided.'}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700">
                <strong>Demo Note:</strong> This is a frontend prototype. No actual Packet Tracer file parsing is performed.
                File metadata is stored in browser state only.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Description modal */}
      <Modal open={!!descriptionModal} onClose={() => setDescriptionModal(null)} title="Edit Description" size="sm">
        {descriptionModal && (
          <div className="space-y-3">
            <textarea
              value={descriptionModal.desc}
              onChange={e => setDescriptionModal(d => d ? { ...d, desc: e.target.value } : d)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-none"
              placeholder="Enter project description…"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDescriptionModal(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={saveDescription}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
