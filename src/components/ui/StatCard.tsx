import React from 'react'
import { cn } from '../../utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  trendGood?: boolean
  colorClass?: string
  bgClass?: string
  className?: string
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  trendGood,
  colorClass = 'text-brand-blue',
  bgClass = 'bg-blue-50',
  className,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trendGood === undefined
    ? 'text-gray-500'
    : trendGood
    ? 'text-teal-600'
    : 'text-red-500'

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-100 shadow-card p-5 flex flex-col gap-3 transition-shadow hover:shadow-card-hover',
      className
    )}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <div className={cn('p-2 rounded-lg', bgClass)}>
          <span className={cn('w-4 h-4 block', colorClass)}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-brand-dark">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
