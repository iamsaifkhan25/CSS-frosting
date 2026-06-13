'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import AuthModal from '@/components/AuthModal'
import Footer from '@/components/Footer'
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
  const [emailInput, setEmailInput] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribing(true)
    // Simulate API call to register subscription
    await new Promise((resolve) => setTimeout(resolve, 800))
    setNotification({
      type: 'success',
      message: `Successfully subscribed ${emailInput} to preset drop notifications!`
    })
    setEmailInput('')
    setSubscribing(false)
  }

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
    if (purchases.includes('glass-premium-all-access') || purchases.includes('glass-mega-bundle')) return false
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
      id: 'glass-button-group',
      name: 'Frosted Button Group',
      description: 'Sleek inline pill tags and buttons featuring frosted borders and subtle micro-shadowing, optimized for actions.',
      type: 'free',
      icon: Sparkles,
      price: '$0.00',
      css: `background: rgba(255, 255, 255, 0.08);\nbackdrop-filter: blur(8px);\nborder: 1px solid rgba(255, 255, 255, 0.12);\nbox-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\nborder-radius: 8px;`,
      canvasBg: 'aurora'
    },
    {
      id: 'glass-navbar',
      name: 'Translucent Header Nav',
      description: 'Horizontal top bar layout. Implements high backdrop-blur and a thin bottom border to separate headers cleanly.',
      type: 'free',
      icon: LayoutGrid,
      price: '$0.00',
      css: `background: rgba(10, 10, 10, 0.5);\nbackdrop-filter: blur(20px);\nborder-bottom: 1px solid rgba(255, 255, 255, 0.08);\nborder-radius: 0px;`,
      canvasBg: 'ocean'
    },
    {
      id: 'glass-tooltip',
      name: 'Interactive Tooltip HUD',
      description: 'Compact hover popover card with high translucent shine, ideal for tooltips and contextual alerts.',
      type: 'free',
      icon: Smartphone,
      price: '$0.00',
      css: `background: rgba(255, 255, 255, 0.12);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.2);\nbox-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);\nborder-radius: 12px;`,
      canvasBg: 'cyberpunk'
    },
    {
      id: 'glass-premium-card',
      name: 'Elite Card Design',
      description: 'Premium golden-metallic custom layout. Employs advanced linear-gradient outlines and reflective high-saturate glass parameters.',
      type: 'premium',
      icon: CreditCard,
      price: '$3.99',
      css: `background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);\nbackdrop-filter: blur(20px) saturate(160%);\nborder: 1px solid rgba(255, 215, 0, 0.25);\nbox-shadow: 0 12px 40px 0 rgba(234, 179, 8, 0.15);\nborder-radius: 20px;`,
      canvasBg: 'sunset'
    },
    {
      id: 'glass-premium-modal',
      name: 'Live Server Widget',
      description: 'Stunning server monitoring HUD widget. Includes gradient micro-glow overlays and an embedded sparkline data component.',
      type: 'premium',
      icon: Sparkles,
      price: '$4.99',
      css: `background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);\nbackdrop-filter: blur(18px) saturate(140%);\nborder: 1px solid rgba(255, 255, 255, 0.15);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);\nborder-radius: 24px;`,
      canvasBg: 'cyberpunk'
    },
    {
      id: 'glass-premium-pricing',
      name: 'Cyber Pricing Panel',
      description: 'High-saturate glass pricing card containing neon cyan border highlights, extreme blur, and deep dark inner drop shadows.',
      type: 'premium',
      icon: Sparkles,
      price: '$5.99',
      css: `background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(236, 72, 153, 0.02) 100%);\nbackdrop-filter: blur(24px) saturate(180%);\nborder: 1px solid rgba(6, 182, 212, 0.25);\nbox-shadow: 0 16px 45px 0 rgba(6, 182, 212, 0.15);\nborder-radius: 24px;`,
      canvasBg: 'cyberpunk'
    },
    {
      id: 'glass-premium-player',
      name: 'Aura Music HUD',
      description: 'Interactive media playback widget with double-layered blur effects, magenta tint filters, and frosted controller buttons.',
      type: 'premium',
      icon: Smartphone,
      price: '$3.99',
      css: `background: linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(147, 51, 234, 0.03) 100%);\nbackdrop-filter: blur(16px) saturate(150%);\nborder: 1px solid rgba(244, 63, 94, 0.2);\nbox-shadow: 0 12px 36px 0 rgba(244, 63, 94, 0.2);\nborder-radius: 20px;`,
      canvasBg: 'aurora'
    },
    {
      id: 'glass-premium-wallet',
      name: 'DeFi Wallet Panel',
      description: 'Luxury cryptocurrency status widget with custom silver border shines, advanced radial grain filters, and custom transaction rows.',
      type: 'premium',
      icon: CreditCard,
      price: '$7.99',
      css: `background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.01));\nbackdrop-filter: blur(30px) saturate(120%);\nborder: 1px solid rgba(255, 255, 255, 0.25);\nbox-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.4);\nborder-radius: 28px;`,
      canvasBg: 'sunset'
    },
    {
      id: 'glass-premium-analytics',
      name: 'Cosmic Analytics Hub',
      description: 'Ultimate cockpit data console panel containing complex double-layer masking borders, intense backdrop saturate filters, and deep space blue background tinting.',
      type: 'premium',
      icon: LayoutGrid,
      price: '$8.99',
      css: `background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);\nbackdrop-filter: blur(28px) saturate(200%);\nborder: 1px solid rgba(59, 130, 246, 0.2);\nbox-shadow: 0 15px 35px 0 rgba(59, 130, 246, 0.15);\nborder-radius: 22px;`,
      canvasBg: 'ocean'
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

        {/* Lifetime All-Access Promo Banner */}
        {!purchases.includes('glass-premium-all-access') && !purchases.includes('glass-mega-bundle') && (
          <div className="bg-gradient-to-r from-purple-950/20 via-black to-cyan-950/20 border border-yellow-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            {/* Ambient glows */}
            <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10 max-w-xl text-left">
              <span className="inline-flex items-center space-x-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                <Sparkles className="w-3 h-3 fill-yellow-400" />
                <span>LIFETIME VALUE PASS</span>
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white">Unlock All Current & Future Presets</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Get instant, permanent access to all existing and future premium layouts. No recurring subscriptions. Unlock everything at once and accelerate your workflow.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
              <button
                onClick={() => handlePurchase('glass-mega-bundle')}
                disabled={purchasingId !== null}
                className="bg-white hover:bg-white/90 active:scale-95 text-black px-6 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-[0_4px_25px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Get Mega Bundle ($71.99)</span>
              </button>
              <button
                onClick={() => handlePurchase('glass-premium-all-access')}
                disabled={purchasingId !== null}
                className="bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 text-white px-5 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Presets Only ($69.99)</span>
              </button>
            </div>
          </div>
        )}

        {/* Presets Grid */}
        <div className="flex flex-row overflow-x-auto gap-6 pb-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredPresets.map((preset) => {
            const Icon = preset.icon
            const isLocked = isPremiumLocked(preset.id)
            const isOwned = purchases.includes(preset.id)
            const isPremium = preset.type === 'premium'

            return (
              <div 
                key={preset.id}
                className="w-[280px] sm:w-[320px] md:w-auto shrink-0 snap-start bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-2xl"
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
                    className="w-48 aspect-[1.6] p-4 flex flex-col justify-between relative border shadow-md z-10 transition-transform duration-300 group-hover:scale-[1.03] overflow-hidden"
                  >
                    {renderMicroPreview(preset.id, Icon)}
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

        {/* Newsletter Subscription Box */}
        <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto w-full text-center relative overflow-hidden mt-12">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 max-w-lg mx-auto">
            <h3 className="text-xl font-bold">Get Notified of New Presets</h3>
            <p className="text-xs text-white/55">
              We release premium, hand-crafted glassmorphic layouts every week. Subscribe to get instant email notifications whenever a new preset drops.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                required
                type="email"
                placeholder="your.email@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/25 placeholder-white/35"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-white text-black hover:bg-white/90 active:scale-95 font-bold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 shrink-0 cursor-pointer"
              >
                <span>Notify Me</span>
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={fetchUserAndPurchases}
      />
      <Footer />
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

function renderMicroPreview(presetId: string, Icon: any) {
  switch (presetId) {
    case 'credit-card':
      return (
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-0.5">
              <span className="text-[5px] font-mono uppercase tracking-widest text-white/45 font-bold">Project Vault</span>
              <span className="text-[7px] font-semibold text-white/85">Premium Card</span>
            </div>
            <div className="w-5 h-3 bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-600 border border-yellow-700/30 rounded shadow-inner"></div>
          </div>
          <div className="text-[9px] font-mono tracking-widest text-white/95 my-1 text-center">
            4012  9821  6604  9922
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <span className="text-[4px] font-mono uppercase tracking-wider text-white/40 block">Card Holder</span>
              <span className="text-[6.5px] font-medium text-white/80 uppercase">John Doe</span>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[4px] font-mono uppercase tracking-wider text-white/40 block">Expires</span>
              <span className="text-[6.5px] font-mono text-white/80">12/29</span>
            </div>
          </div>
        </div>
      )
    case 'login-modal':
      return (
        <div className="flex flex-col space-y-1.5 w-full items-center justify-center h-full">
          <div className="text-center space-y-0.5">
            <div className="text-[8px] font-bold text-white/95 leading-none">Sign In</div>
            <div className="text-[5px] text-white/45">Enter credentials</div>
          </div>
          <div className="w-full space-y-1">
            <div className="w-full h-3 bg-white/5 border border-white/10 rounded flex items-center px-1">
              <div className="w-12 h-0.5 bg-white/30 rounded-full"></div>
            </div>
            <div className="w-full h-3 bg-white/5 border border-white/10 rounded flex items-center px-1">
              <div className="w-8 h-0.5 bg-white/30 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-3 bg-white text-black text-[6px] font-bold rounded flex items-center justify-center">
            Log In
          </div>
        </div>
      )
    case 'dashboard-sidebar':
      return (
        <div className="flex flex-row w-full h-full -m-4 p-2.5 space-x-2">
          <div className="w-[30%] border-r border-white/10 h-full flex flex-col justify-between p-1 space-y-1 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-sm bg-white/20"></div>
                <div className="w-5 h-0.5 bg-white/60 rounded-full"></div>
              </div>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-white/15 rounded-sm"></div>
                <div className="w-full h-1 bg-white/5 rounded-sm"></div>
                <div className="w-full h-1 bg-white/5 rounded-sm"></div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-sm"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between py-1 pr-1">
            <div className="w-6 h-1 bg-white/40 rounded-full"></div>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 bg-white/5 border border-white/10 rounded-sm"></div>
              <div className="h-4 bg-white/5 border border-white/10 rounded-sm"></div>
            </div>
          </div>
        </div>
      )
    case 'glass-button-group':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full items-center justify-center">
          <div className="text-[5.5px] text-white/40 font-semibold tracking-wider uppercase">Buttons & Tags</div>
          <div className="flex flex-wrap gap-1 justify-center">
            <div className="px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[5px] text-white">Action</div>
            <div className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[5.5px] text-white/60">Cancel</div>
            <div className="px-1 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/25 text-[5px] text-purple-400">New</div>
          </div>
        </div>
      )
    case 'glass-navbar':
      return (
        <div className="flex flex-col justify-between w-full h-full -m-4 p-2">
          <div className="w-full border-b border-white/10 flex items-center justify-between px-1.5 pb-1">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white/25 rounded-sm"></div>
              <span className="text-[5.5px] font-bold">Brand.io</span>
            </div>
            <div className="flex space-x-1.5 text-[5px] text-white/50">
              <span>Home</span>
              <span>Docs</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[5px] text-white/20 font-mono">Top Navigation Bar</span>
          </div>
        </div>
      )
    case 'glass-tooltip':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full justify-center text-left">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-2 h-2 text-yellow-400 fill-yellow-400" />
            <span className="text-[6.5px] font-bold text-white/95">Pro Hint</span>
          </div>
          <p className="text-[5.5px] text-white/60 leading-normal">
            Backdrop-blur values over 20px create a very dense, frosted glass pane effect.
          </p>
        </div>
      )
    case 'glass-premium-card':
      return (
        <div className="flex flex-col justify-between h-full w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-xl pointer-events-none"></div>
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col text-left">
              <span className="text-[5px] font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center">
                <Sparkles className="w-1.5 h-1.5 mr-0.5 fill-yellow-400 text-yellow-400" />
                <span>Vault Premium</span>
              </span>
              <span className="text-[7px] font-bold text-white uppercase leading-none mt-0.5">Hyperion Elite</span>
            </div>
            <div className="w-5 h-3 bg-gradient-to-tr from-yellow-500 via-yellow-300 to-yellow-500 border border-yellow-400/50 rounded-sm flex items-center justify-center text-[4px] text-black font-bold uppercase tracking-wider shadow-sm">
              GOLD
            </div>
          </div>
          <div className="text-[9px] font-mono tracking-widest text-white/95 my-1 z-10 text-center">
            4012  9821  6604  9922
          </div>
          <div className="flex justify-between items-end z-10">
            <div className="space-y-0.5 text-left">
              <span className="text-[4px] font-mono uppercase tracking-wider text-white/45 block">Elite Member</span>
              <span className="text-[7px] font-semibold text-white/90 uppercase leading-none">E. Sterling</span>
            </div>
            <div className="text-right">
              <span className="text-[4px] font-mono uppercase tracking-wider text-white/45 block">Valid Thru</span>
              <span className="text-[7px] font-semibold text-white/90 font-mono leading-none">12/32</span>
            </div>
          </div>
        </div>
      )
    case 'glass-premium-modal':
      return (
        <div className="flex flex-col space-y-1 w-full h-full justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-2 h-2 text-yellow-400 fill-yellow-400" />
              <span className="text-[5.5px] font-bold text-white/80 uppercase tracking-wider">Server Status</span>
            </div>
            <span className="text-[4px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded-full font-bold">
              ONLINE
            </span>
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-[5px] text-white/50 font-bold uppercase">CPU Core Load</span>
            <div className="flex items-baseline space-x-0.5">
              <span className="text-[10px] font-bold tracking-tight">88.42%</span>
              <span className="text-[6px] text-emerald-400 font-bold">↑ 12%</span>
            </div>
          </div>
          <div className="w-full h-4 bg-white/5 border border-white/10 rounded flex items-end relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent"></div>
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 15 5, 30 20 T 60 10 T 90 5 L 100 8"
                fill="none"
                stroke="#eab308"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[4.5px] text-white/50 border-t border-white/10 pt-0.5 font-bold uppercase">
            <span>Hits</span>
            <span className="font-mono text-white/70">1.2B reqs</span>
          </div>
        </div>
      )
    case 'glass-premium-pricing':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full justify-between">
          <div className="text-center space-y-0.5">
            <span className="text-[4.5px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1 py-0.2 rounded-full font-bold uppercase tracking-wider">
              Enterprise
            </span>
            <h4 className="text-[10px] font-bold tracking-tight text-white mt-0.5">$99<span className="text-[6px] text-white/40 font-normal">/mo</span></h4>
          </div>
          <div className="space-y-0.5 border-t border-white/5 pt-1 text-left w-full">
            {['Unlimited Assets', 'Real-time Sync'].map((feat) => (
              <div key={feat} className="flex items-center space-x-1 text-[5px] text-white/60">
                <span className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-white text-black py-0.5 rounded-md text-[6px] font-bold">
            Upgrade Now
          </button>
        </div>
      )
    case 'glass-premium-player':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full justify-center">
          <div className="flex space-x-2 items-center text-left">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[7.5px] font-bold text-white truncate">Neon Nights</p>
              <p className="text-[5.5px] text-white/45 truncate">Lofi Dreamscape</p>
            </div>
          </div>
          <div className="w-full bg-white/10 h-0.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-pink-500 w-1/3 h-full rounded-full"></div>
          </div>
          <div className="flex justify-between text-[4.5px] text-white/30 font-mono">
            <span>0:45</span>
            <span>2:15</span>
          </div>
        </div>
      )
    case 'glass-premium-wallet':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full justify-center text-left">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[4.5px] font-mono text-white/45 uppercase tracking-wider block">Balance</span>
              <span className="text-[9.5px] font-bold tracking-tight text-white leading-none">$14,204</span>
            </div>
            <span className="text-[4.5px] bg-white/10 border border-white/15 text-white/70 px-1 py-0.2 rounded font-mono">
              0x4e...9f
            </span>
          </div>
          <div className="space-y-0.5 border-t border-white/5 pt-1">
            <div className="flex justify-between text-[5px] text-white/60">
              <span>Ethereum (ETH)</span>
              <span className="font-bold">3.24</span>
            </div>
            <div className="flex justify-between text-[5px] text-white/60">
              <span>USD Coin (USDC)</span>
              <span className="font-bold">4,120</span>
            </div>
          </div>
        </div>
      )
    case 'glass-premium-analytics':
      return (
        <div className="flex flex-col space-y-1.5 w-full h-full justify-center text-left">
          <div className="flex justify-between items-center">
            <span className="text-[5px] font-bold text-white/70 uppercase tracking-wide">Live Data Engine</span>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white/5 border border-white/10 p-1 rounded-sm">
              <p className="text-[3.5px] text-white/40 uppercase font-semibold">Nodes</p>
              <p className="text-[7px] font-bold text-white mt-0.5">48 / 50</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-1 rounded-sm">
              <p className="text-[3.5px] text-white/40 uppercase font-semibold">Bandwidth</p>
              <p className="text-[7px] font-bold text-white mt-0.5">1.2 Gbps</p>
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-0.5">
            <span className="text-[6px] font-mono uppercase tracking-wider text-white/40">PREVIEW</span>
            <span className="text-[8px] font-bold text-white/80">Glass CSS</span>
          </div>
          <Icon className="w-3.5 h-3.5 text-white/70" />
        </div>
      )
  }
}


