export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
    case 'high':     return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'medium':   return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'low':      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:         return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'online':   case 'up':       case 'resolved':   return 'text-teal-700 bg-teal-50 border-teal-200'
    case 'warning':  case 'degraded': case 'investigating': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'critical': case 'down':     case 'failed':     return 'text-red-600 bg-red-50 border-red-200'
    case 'offline':                                       return 'text-gray-500 bg-gray-50 border-gray-200'
    case 'new':                                           return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'diagnosed': case 'awaiting_approval':           return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'recovering':                                    return 'text-indigo-600 bg-indigo-50 border-indigo-200'
    default:         return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getRiskColor(risk: string) {
  switch (risk) {
    case 'high':   return 'text-red-600 bg-red-50 border-red-200'
    case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'low':    return 'text-teal-700 bg-teal-50 border-teal-200'
    default:       return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
