import React from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-brand-blue text-white hover:bg-[#014d8c] focus:ring-brand-blue',
    secondary: 'bg-brand-teal text-white hover:bg-[#007a7a] focus:ring-brand-teal',
    outline:   'border border-brand-blue text-brand-blue bg-white hover:bg-blue-50 focus:ring-brand-blue',
    ghost:     'text-brand-dark bg-transparent hover:bg-gray-100 focus:ring-gray-300',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success:   'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
  }

  const sizes = {
    sm:  'px-3 py-1.5 text-xs',
    md:  'px-4 py-2 text-sm',
    lg:  'px-6 py-2.5 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {iconRight}
    </button>
  )
}
