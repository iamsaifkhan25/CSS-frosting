'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { X, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) throw signUpError
        setMessage('Check your email for the confirmation link.')
      } else if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        onAuthSuccess()
        onClose()
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (resetError) throw resetError
        setMessage('Password reset link sent! Please check your email inbox.')
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred during authentication.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    if (mode === 'signup') return 'Create account'
    if (mode === 'forgot') return 'Reset Password'
    return 'Sign in'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-[#171717] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/10 p-2 rounded-lg text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {getTitle()}
              </h2>
              <p className="text-xs text-white/50">Project Vault: Glassmorphism</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-blue-950/50 border border-blue-500/30 rounded-lg text-sm text-blue-300">
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-white/30" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-white/70">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot')
                        setError(null)
                        setMessage(null)
                      }}
                      className="text-xs text-white/40 hover:text-white transition-colors underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-white/30" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed font-medium rounded-lg text-sm py-2.5 transition-colors flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>
                  {mode === 'signup' && 'Create account'}
                  {mode === 'signin' && 'Sign in'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div>
              {mode !== 'forgot' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin')
                    setError(null)
                    setMessage(null)
                  }}
                  className="text-xs text-white/55 hover:text-white underline transition-colors"
                >
                  {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin')
                    setError(null)
                    setMessage(null)
                  }}
                  className="text-xs text-white/55 hover:text-white underline transition-colors"
                >
                  Back to Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
