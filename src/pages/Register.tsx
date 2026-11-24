import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

export function Register() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast('Account created! Please sign in with the demo credentials.', 'success')
    navigate('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-brand-blue font-bold text-lg">NetMedic</span>
        </div>

        <h1 className="text-xl font-bold text-brand-dark mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-5">
          This is a demo prototype. Registration is simulated.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Smith' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={set(key as keyof typeof form)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                placeholder="Min 8 characters"
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={set('confirm')}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              placeholder="Repeat password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
