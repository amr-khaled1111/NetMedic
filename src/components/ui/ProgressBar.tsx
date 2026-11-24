import React from 'react'
import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showLabel,
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color =
    pct >= 90 ? 'bg-red-500' :
    pct >= 70 ? 'bg-yellow-400' :
    'bg-brand-teal'

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-gray-100 rounded-full overflow-hidden',
        size === 'sm' ? 'h-1.5' : 'h-2'
      )}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barClassName ?? color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{value}%</p>
      )}
    </div>
  )
}
