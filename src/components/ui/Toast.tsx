import React, { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id))
    }, 4000)
  }, [])

  const remove = (id: string) => setToasts(t => t.filter(x => x.id !== id))

  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
  const colors = {
    success: 'border-teal-200 bg-teal-50 text-teal-800',
    error:   'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info:    'border-blue-200 bg-blue-50 text-blue-800',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-80">
        {toasts.map(t => {
          const Icon = icons[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border shadow-lg animate-fade-in',
                colors[t.type]
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
