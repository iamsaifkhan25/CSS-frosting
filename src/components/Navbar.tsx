'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Layers, User, LogOut, Sparkles, Menu, X, BookOpen, LayoutGrid, Paintbrush } from 'lucide-react'
import AuthModal from './AuthModal'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  // Keep verifier page indicator active for 30 days (June 14 to July 14, 2026)
  const showNewIndicator = new Date() < new Date('2026-07-14')

  const fetchUser = async () => {
    setLoadingUser(true)
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    setLoadingUser(false)
  }

  useEffect(() => {
    let active = true
    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (active) {
        setUser(session?.user || null)
        setLoadingUser(false)
      }
    }
    initUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) {
        setUser(session?.user || null)
        setLoadingUser(false)
        if (event === 'PASSWORD_RECOVERY') {
          window.location.href = '/auth/reset-password'
        }
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const navLinks = [
    { name: 'Generator', href: '/generator', icon: Paintbrush },
    { name: 'Presets', href: '/presets', icon: LayoutGrid },
    { name: 'Glass Analyzer', href: '/analyzer', icon: Sparkles },
    { name: 'Documentation', href: '/docs', icon: BookOpen },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6 transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center bg-white/5 group-hover:bg-white/10 w-9 h-9 rounded-lg border border-white/15 group-hover:border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <Layers className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wider text-white flex items-center uppercase">
                CSS Frosting
                <span className="mx-2 text-white/30 font-normal">|</span>
                <span className="text-white/60 font-medium lowercase text-xs tracking-normal">v2.0</span>
              </h1>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
                {link.name === 'Presets' && (
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                )}
                {link.name === 'Glass Analyzer' && showNewIndicator && (
                  <span className="bg-purple-500 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1 shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    New
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Account / Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {loadingUser ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          ) : user ? (
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full pl-3 pr-1 py-1 text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <span className="text-white/70 max-w-[150px] truncate font-medium">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 p-1.5 rounded-full transition-all duration-200 text-white/60"
                title="Sign Out"
                id="sign-out-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-black hover:bg-white/90 active:scale-95 font-semibold px-5 py-2 rounded-full text-xs transition-all duration-200 flex items-center space-x-1.5 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              id="sign-in-btn"
            >
              <User className="w-3.5 h-3.5" />
              <span>Connect Wallet / Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/80 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur-2xl border-b border-white/10 flex flex-col p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.name}</span>
                  {link.name === 'Presets' && (
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                  )}
                  {link.name === 'Glass Analyzer' && showNewIndicator && (
                    <span className="bg-purple-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-auto shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                      New
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          <div className="border-t border-white/10 pt-4 flex flex-col">
            {loadingUser ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
            ) : user ? (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 text-xs">
                <span className="text-white/70 truncate">{user.email}</span>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)}
                  }
                  className="bg-red-500/10 hover:bg-red-500/25 text-red-400 px-3 py-1.5 rounded-md transition-all duration-200 flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold py-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-[0_4px_15px_rgba(255,255,255,0.1)]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Connect Wallet / Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={fetchUser}
      />
    </>
  )
}
