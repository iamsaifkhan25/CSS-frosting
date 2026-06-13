'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, Loader2 } from 'lucide-react'

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Verify that the user has a valid active session (established by the callback redirect)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No active password reset session found. Please request a new reset link.')
      }
    }
    checkSession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })
      if (updateError) throw updateError
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update password.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0a] min-h-[calc(100vh-4rem)] relative">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0px,transparent_60%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[#171717]/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-white/10 p-2.5 rounded-lg text-white">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white font-sans">Update Password</h2>
            <p className="text-xs text-white/50 font-sans">Enter your new secure password</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-sm text-red-400 font-sans">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 space-y-2 font-sans">
            <p className="font-semibold">Password updated successfully!</p>
            <p className="text-xs text-white/55">Redirecting to workspace home...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 font-sans">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-sans"
                />
                <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-white/30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 font-sans">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-sans"
                />
                <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-white/30" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!error}
              className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed font-medium rounded-lg text-sm py-2.5 transition-colors flex items-center justify-center space-x-2 mt-6 font-sans"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
