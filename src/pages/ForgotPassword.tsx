import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
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

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-brand-dark mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              <br /><span className="text-xs text-gray-400">(This is a demo — no actual email is sent.)</span>
            </p>
            <Link to="/login">
              <Button variant="outline" size="md" className="w-full" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-brand-dark mb-1">Reset Password</h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              <Link to="/login" className="text-brand-blue font-medium hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
