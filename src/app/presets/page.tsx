'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import AuthModal from '@/components/AuthModal'
import { 
  Sparkles, Lock, CreditCard, Smartphone, LayoutGrid, 
  CheckCircle, RefreshCw, Paintbrush, Copy, Check 
} from 'lucide-react'

export default function Presets() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<string[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const fetchUserAndPurchases = async () => {
    setLoadingUser(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      const { data: userPurchases, error } = await supabase
        .from('purchases')
        .select('product_id')
        .eq('user_id', session.user.id)
        .eq('status', 'completed')
      
      if (!error && userPurchases) {
        setPurchases(userPurchases.map((p: any) => p.product_id))
      }
    } else {
      setUser(null)
      setPurchases([])
    }
    setLoadingUser(false)
  }

  useEffect(() => {
    fetchUserAndPurchases()

    // Load Razorpay Script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    // Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data: userPurchases } = await supabase
            .from('purchases')
            .select('product_id')
            .eq('user_id', session.user.id)
            .eq('status', 'completed')
          if (userPurchases) {
            setPurchases(userPurchases.map((p: any) => p.product_id))
          }
        } else {
          setUser(null)
          setPurchases([])
        }
        setLoadingUser(false)
      }
    )

    // Handle checkout redirect feedback
    const query = new URLSearchParams(window.location.search)
    const checkoutStatus = query.get('checkout')

    if (checkoutStatus === 'success') {
      setNotification({
        type: 'success',
        message: 'Payment verified! Your premium layout is unlocked.',
      })
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    } else if (checkoutStatus === 'cancel') {
      setNotification({
        type: 'error',
        message: 'Payment cancelled.',
      })
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }

    return () => {
      subscription.unsubscribe()
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePurchase = async (productId: string) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setPurchasingId(productId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      
      if (data.orderId) {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'CSS Frosting Store',
          description: 'Unlock Premium Layout',
          order_id: data.orderId,
          handler: async function (response: any) {
            setPurchasingId(productId)
            try {
              const verifyRes = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  productId,
                }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success) {
                setNotification({
                  type: 'success',
                  message: 'Template permanently unlocked!',
                })
                fetchUserAndPurchases()
              } else {
                setNotification({
                  type: 'error',
                  message: verifyData.error || 'Verification failed.',
                })
              }
            } catch (err) {
              console.error(err)
              setNotification({
                type: 'error',
                message: 'Error verifying payment signature.',
              })
            } finally {
              setPurchasingId(null)
            }
          },
          prefill: {
            email: data.userEmail,
          },
          theme: {
            color: '#050505',
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        alert(data.error || 'Razorpay order creation failed.')
      }
    } catch (err) {
      console.error(err)
      alert('Network error initiating purchase.')
    } finally {
      setPurchasingId(null)
    }
  }

  const isPremiumLocked = (id: string) => {
    return id.startsWith('glass-premium-') && !purchases.includes(id)
  }

  const copyCss = (id: string, css: string) => {
    navigator.clipboard.writeText(css)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const presetsList = [
    {
      id: 'credit-card',
      name: 'Credit Card Spec',
      description: 'Elegant payment card layout featuring standard glassmorphic parameters, chip styling, and dark theme alignment.',
      type: 'free',
      icon: CreditCard,
      price: '$0.00',
      css: `background: rgba(255, 255, 255, 0.15);\nbackdrop-filter: blur(16px);\nborder: 1px solid rgba(255, 255, 255, 0.2);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);\nborder-radius: 16px;`,
      canvasBg: 'aurora'
    },
    {
      id: 'login-modal',
      name: 'Login Form / Modal',
      description: 'Standard security widget presets. Perfect for frosted credential screens, widgets, and popup components.',
      type: 'free',
      icon: Smartphone,
      price: '$0.00',
      css: `background: rgba(255, 255, 255, 0.15);\nbackdrop-filter: blur(16px);\nborder: 1px solid rgba(255, 255, 255, 0.2);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);\nborder-radius: 16px;`,
      canvasBg: 'ocean'
    },
    {
      id: 'dashboard-sidebar',
      name: 'Sidebar Navigator',
      description: 'Left-aligned vertical panel using thin border guidelines and high backdrop filters for maximum code contrast.',
      type: 'free',
      icon: LayoutGrid,
      price: '$0.00',
      css: `background: rgba(255, 255, 255, 0.15);\nbackdrop-filter: blur(16px);\nborder: 1px solid rgba(255, 255, 255, 0.2);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);\nborder-radius: 16px;`,
      canvasBg: 'cyberpunk'
    },
    {
      id: 'glass-premium-card',
      name: 'Elite Card Design',
      description: 'Premium golden-metallic custom layout. Employs advanced linear-gradient outlines and reflective high-saturate glass parameters.',
      type: 'premium',
      icon: CreditCard,
      price: '$4.99',
      css: `background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);\nbackdrop-filter: blur(20px) saturate(160%);\nborder: 1px solid rgba(255, 215, 0, 0.25);\nbox-shadow: 0 12px 40px 0 rgba(234, 179, 8, 0.15);\nborder-radius: 20px;`,
      canvasBg: 'sunset'
    },
    {
      id: 'glass-premium-modal',
      name: 'Live Server Widget',
      description: 'Stunning server monitoring HUD widget. Includes gradient micro-glow overlays and an embedded sparkline data component.',
      type: 'premium',
      icon: Sparkles,
      price: '$7.99',
      css: `background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);\nbackdrop-filter: blur(18px) saturate(140%);\nborder: 1px solid rgba(255, 255, 255, 0.15);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);\nborder-radius: 24px;`,
      canvasBg: 'cyberpunk'
    }
  ]

  const filteredPresets = presetsList.filter(preset => {
    if (filter === 'free') return preset.type === 'free'
    if (filter === 'premium') return preset.type === 'premium'
    return true
  })

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col relative select-none">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 w-full flex-1 flex flex-col space-y-10">
        
        {/* Banner notification */}
        {notification && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs max-w-xl mx-auto w-full ${
            notification.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-950/40 border-red-500/30 text-red-400'
          }`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="font-bold text-white/50 hover:text-white">✕</button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-yellow-400" />
              <span>Tailored Presets</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Presets Gallery</h2>
            <p className="text-sm text-white/50 max-w-xl">
              Unlock or customize professionally authored layouts. Open any preset directly in the generator to tune parameters to your project guidelines.
            </p>
          </div>

          {/* Preset Filters */}
          <div className="flex bg-black/45 border border-white/10 rounded-xl p-1 text-xs self-start">
            {(['all', 'free', 'premium'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${
                  filter === category
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPresets.map((preset) => {
            const Icon = preset.icon
            const isLocked = isPremiumLocked(preset.id)
            const isOwned = purchases.includes(preset.id)
            const isPremium = preset.type === 'premium'

            return (
              <div 
                key={preset.id}
                className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-2xl"
              >
                {/* Visual Preview Box */}
                <div className="aspect-[1.5] relative overflow-hidden bg-[#121212] flex items-center justify-center p-6 border-b border-white/5">
                  
                  {/* Glowing background circles */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    {preset.canvasBg === 'aurora' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl"></div>
                    )}
                    {preset.canvasBg === 'sunset' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                    )}
                    {preset.canvasBg === 'ocean' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
                    )}
                    {preset.canvasBg === 'cyberpunk' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                    )}
                  </div>

                  {/* Micro Glass component preview */}
                  <div 
                    style={parseCssStringToStyles(preset.css)}
                    className="w-48 aspect-[1.6] p-4 flex flex-col justify-between relative border shadow-md z-10 transition-transform duration-300 group-hover:scale-[1.03]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[6px] font-mono uppercase tracking-wider text-white/40">PREVIEW</span>
                        <span className="text-[8px] font-bold text-white/80">Glass CSS</span>
                      </div>
                      <Icon className="w-3.5 h-3.5 text-white/70" />
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full"></div>
                    <div className="flex justify-between items-center text-[7px] text-white/50">
                      <span>•••• 4092</span>
                      <span>06/29</span>
                    </div>
                  </div>
                </div>

                {/* Info and Actions */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{preset.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isPremium 
                          ? isLocked 
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}>
                        {isPremium ? isLocked ? `Buy (${preset.price})` : 'Unlocked' : 'Free'}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{preset.description}</p>
                  </div>

                  {/* Action row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Primary action */}
                    {isLocked ? (
                      <button
                        onClick={() => handlePurchase(preset.id)}
                        disabled={purchasingId !== null}
                        className="col-span-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-[0_4px_15px_rgba(234,179,8,0.15)]"
                      >
                        {purchasingId === preset.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock Template</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <>
                        <Link
                          href={`/generator?comp=${preset.id}`}
                          className="bg-white hover:bg-white/90 text-black py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          <Paintbrush className="w-3.5 h-3.5" />
                          <span>Customize</span>
                        </Link>
                        
                        <button
                          onClick={() => copyCss(preset.id, preset.css)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          {copiedId === preset.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy CSS</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </main>

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={fetchUserAndPurchases}
      />
    </div>
  )
}

// Parse CSS declarations into React inline styles
function parseCssStringToStyles(cssString: string): React.CSSProperties {
  const styles: any = {}
  cssString.split('\n').forEach((line) => {
    const cleanLine = line.trim()
    if (!cleanLine || cleanLine.startsWith('/*')) return
    const delimiterIndex = cleanLine.indexOf(':')
    if (delimiterIndex === -1) return
    const property = cleanLine.substring(0, delimiterIndex).trim()
    const value = cleanLine.substring(delimiterIndex + 1).replace(';', '').trim()
    
    // Map properties to React equivalent camelCase names
    if (property === 'background') styles.background = value
    else if (property === 'backdrop-filter') styles.backdropFilter = value
    else if (property === '-webkit-backdrop-filter') styles.WebkitBackdropFilter = value
    else if (property === 'border') styles.border = value
    else if (property === 'box-shadow') styles.boxShadow = value
    else if (property === 'border-radius') styles.borderRadius = value
    else if (property === 'background-image') styles.backgroundImage = value
  })
  return styles
}

