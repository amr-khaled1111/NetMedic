import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Shield, Activity, Network } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

interface LoginProps {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [email, setEmail] = useState('admin@netmedic.demo')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    if (email === 'admin@netmedic.demo' && password === 'demo1234') {
      toast('Welcome back, Admin!', 'success')
      onLogin()
      navigate('/dashboard')
    } else {
      setError('Invalid credentials. Use admin@netmedic.demo / demo1234')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">NetMedic</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            AI-Powered<br />Network Operations
          </h2>
          <p className="text-white/70 text-base mb-10">
            Monitor, diagnose, and autonomously recover your network infrastructure with real-time AI assistance.
          </p>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Activity,  label: 'Real-time Monitoring',   desc: 'Full visibility across all devices' },
              { icon: Shield,    label: 'AI Anomaly Detection',   desc: '94% detection confidence' },
              { icon: Network,   label: 'Autonomous Recovery',    desc: 'Self-healing network paths' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-white/60 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2024 NetMedic · Frontend Demo Prototype</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-brand-blue font-bold text-lg">NetMedic</span>
          </div>

          <h1 className="text-2xl font-bold text-brand-dark mb-1">Sign In</h1>
          <p className="text-gray-500 text-sm mb-6">Access your network operations dashboard</p>

          {/* Demo credentials hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 text-xs">
            <p className="font-semibold text-blue-700 mb-1">Demo credentials</p>
            <p className="text-blue-600">Email: admin@netmedic.demo</p>
            <p className="text-blue-600">Password: demo1234</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded" defaultChecked />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
