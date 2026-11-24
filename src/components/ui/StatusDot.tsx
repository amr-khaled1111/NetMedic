import React from 'react'
import { cn } from '../../utils/cn'

interface StatusDotProps {
  status: string
  size?: 'sm' | 'md'
  pulse?: boolean
}

export function StatusDot({ status, size = 'md', pulse }: StatusDotProps) {
  const color = {
    online:    'bg-teal-500',
    up:        'bg-teal-500',
    resolved:  'bg-teal-500',
    warning:   'bg-yellow-400',
    degraded:  'bg-yellow-400',
    critical:  'bg-red-500',
    down:      'bg-red-500',
    failed:    'bg-red-500',
    offline:   'bg-gray-400',
    new:       'bg-blue-500',
    investigating: 'bg-orange-400',
    diagnosed: 'bg-purple-500',
    awaiting_approval: 'bg-purple-500',
    recovering: 'bg-indigo-500',
  }[status] ?? 'bg-gray-400'

  return (
    <span className={cn(
      'relative inline-flex rounded-full',
      size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
      color,
    )}>
      {pulse && (
        <span className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-50',
          color,
        )} />
      )}
    </span>
  )
}
