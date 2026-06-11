'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import AuthModal from '@/components/AuthModal'
import { 
  Copy, Check, User, LogOut, Lock as LockIcon, Sparkles, 
  CreditCard, Smartphone, LayoutGrid, Info, CheckCircle, 
  RefreshCw, Layers, ShieldCheck, ChevronRight
} from 'lucide-react'

// Color conversions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 }
}

export default function Home() {
  // Supabase Auth & Purchase state
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<string[]>([])
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  // Canvas background selections
  const [bgStyle, setBgStyle] = useState<'mesh' | 'develop' | 'preview' | 'ship'>('mesh')

  // Sliders/Controls state
  const [tintColor, setTintColor] = useState('#ffffff')
  const [bgOpacity, setBgOpacity] = useState(0.2)
  const [blurRadius, setBlurRadius] = useState(16)
  const [borderOpacity, setBorderOpacity] = useState(0.15)
  const [borderWidth, setBorderWidth] = useState(1)
  const [shadowOpacity, setShadowOpacity] = useState(25)
  const [shadowColor, setShadowColor] = useState('#000000')

  // Selected component
  const [selectedComp, setSelectedComp] = useState<string>('credit-card')
  const [premiumCss, setPremiumCss] = useState<string | null>(null)
  const [loadingPremium, setLoadingPremium] = useState(false)

  // Code exporter state
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'styled'>('css')
  const [copied, setCopied] = useState(false)

  // Notification states
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const supabase = createClient()

  // Load user details & purchases
  const fetchUserAndPurchases = async () => {
    setLoadingUser(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      // Fetch user purchases
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
          // Fetch purchases
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
    const productId = query.get('product_id')

    if (checkoutStatus === 'success') {
      setNotification({
        type: 'success',
        message: `Payment successful! Premium template has been permanently unlocked.`,
      })
      // Clear URL params
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    } else if (checkoutStatus === 'cancel') {
      setNotification({
        type: 'error',
        message: 'Payment cancelled. Try again whenever you are ready!',
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

  // Fetch premium CSS when purchased product is selected
  useEffect(() => {
    if (selectedComp.startsWith('glass-premium-')) {
      const isOwned = purchases.includes(selectedComp)
      if (isOwned && user) {
        setLoadingPremium(true)
        fetch(`/api/premium?productId=${selectedComp}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.css) {
              setPremiumCss(data.css)
            } else {
              setPremiumCss(null)
            }
          })
          .catch((err) => console.error('Error fetching premium styles:', err))
          .finally(() => setLoadingPremium(false))
      } else {
        setPremiumCss(null)
      }
    } else {
      setPremiumCss(null)
    }
  }, [selectedComp, purchases, user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setPurchases([])
    if (selectedComp.startsWith('glass-premium-')) {
      setSelectedComp('credit-card')
    }
  }

  // Generate styles based on input sliders
  const rgb = hexToRgb(tintColor)
  const shadowRgb = hexToRgb(shadowColor)

  const glassStyle: React.CSSProperties = premiumCss
    ? parseCssStringToStyles(premiumCss)
    : {
        background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity})`,
        backdropFilter: `blur(${blurRadius}px)`,
        WebkitBackdropFilter: `blur(${blurRadius}px)`,
        border: `${borderWidth}px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
        boxShadow: `0 8px 32px 0 rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${shadowOpacity / 100})`,
      }

  // Create text representations
  const cssCodeString = premiumCss || `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity});
backdrop-filter: blur(${blurRadius}px);
-webkit-backdrop-filter: blur(${blurRadius}px);
border: ${borderWidth}px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${shadowOpacity / 100});`

  const tailwindCodeString = premiumCss 
    ? `/* Customized premium layout classes */` 
    : `bg-[rgba(${rgb.r},${rgb.g},${rgb.b},${bgOpacity})] backdrop-blur-[${blurRadius}px] border-[${borderWidth}px] border-[rgba(${rgb.r},${rgb.g},${rgb.b},${borderOpacity})] shadow-[0_8px_32px_0_rgba(${shadowRgb.r},${shadowRgb.g},${shadowRgb.b},${shadowOpacity/100})]`

  const styledComponentsCodeString = `const GlassmorphicBox = styled.div\`
  ${cssCodeString.split('\n').map(line => `  ${line}`).join('\n').trim()}
\`;`

  const getActiveCodeString = () => {
    if (exportTab === 'css') return cssCodeString
    if (exportTab === 'tailwind') return tailwindCodeString
    return styledComponentsCodeString
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCodeString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          name: 'Project Vault',
          description: 'Unlock Premium Glassmorphic Layout',
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
                  message: 'Payment successful! Premium template has been permanently unlocked.',
                })
                fetchUserAndPurchases()
              } else {
                setNotification({
                  type: 'error',
                  message: verifyData.error || 'Payment verification failed.',
                })
              }
            } catch (err) {
              console.error(err)
              setNotification({
                type: 'error',
                message: 'Error verifying signature callback.',
              })
            } finally {
              setPurchasingId(null)
            }
          },
          prefill: {
            email: data.userEmail,
          },
          theme: {
            color: '#171717',
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans select-none antialiased">
      {/* Top sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center bg-white/10 w-9 h-9 rounded-lg border border-white/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight text-white flex items-center">
              Project Vault <span className="mx-2 text-white/30">|</span> 
              <span className="text-white/60 font-normal">CSS Glassmorphism</span>
            </h1>
          </div>
        </div>

        {/* User Account Section */}
        <div className="flex items-center space-x-4">
          {loadingUser ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          ) : user ? (
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full pl-3 pr-1 py-1 text-xs">
              <span className="text-white/70 max-w-[150px] truncate">{user.email}</span>
              <button 
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 p-1.5 rounded-full transition-all text-white/60"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-black hover:bg-white/90 font-medium px-4 py-1.5 rounded-full text-xs transition-colors flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Connect Wallet / Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Parameters Control Panel */}
        <section className="lg:col-span-4 bg-[#0d0d0d] border-r border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Notification banners */}
          {notification && (
            <div className={`p-3 rounded-lg border flex items-start space-x-2 text-xs transition-all ${
              notification.type === 'success' 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-950/40 border-red-500/30 text-red-400'
            }`}>
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1">{notification.message}</div>
              <button 
                onClick={() => setNotification(null)}
                className="text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {/* Component Tabs Selector */}
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
              Select Preset Component
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedComp('credit-card')}
                className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  selectedComp === 'credit-card'
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                onClick={() => setSelectedComp('login-modal')}
                className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  selectedComp === 'login-modal'
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Login Modal</span>
              </button>

              <button
                onClick={() => setSelectedComp('dashboard-sidebar')}
                className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  selectedComp === 'dashboard-sidebar'
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Sidebar</span>
              </button>
            </div>

            {/* Premium presets */}
            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 mr-0.5 fill-yellow-400 text-yellow-400" />
                  <span>Premium Layouts</span>
                </span>
                {purchases.length > 0 && (
                  <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    Unlocked: {purchases.length}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedComp('glass-premium-card')}
                  className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all flex items-center justify-between ${
                    selectedComp === 'glass-premium-card'
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                      : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">Premium Card</span>
                  {isPremiumLocked('glass-premium-card') ? (
                    <LockIcon className="w-3 h-3 text-white/40 shrink-0 ml-1" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedComp('glass-premium-modal')}
                  className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all flex items-center justify-between ${
                    selectedComp === 'glass-premium-modal'
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                      : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">Premium Widget</span>
                  {isPremiumLocked('glass-premium-modal') ? (
                    <LockIcon className="w-3 h-3 text-white/40 shrink-0 ml-1" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sliders Control Engine (Disabled for Premium locked components) */}
          <div className={`space-y-5 flex-1 ${selectedComp.startsWith('glass-premium-') ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Engine Controllers
              </h3>
              {selectedComp.startsWith('glass-premium-') && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">
                  Preset Active
                </span>
              )}
            </div>

            {/* Tint Color Picker */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Glass Tint Color</span>
                <span className="text-white/50 font-mono">{tintColor.toUpperCase()}</span>
              </div>
              <div className="flex space-x-3">
                <input
                  type="color"
                  value={tintColor}
                  onChange={(e) => setTintColor(e.target.value)}
                  className="w-10 h-8 rounded border border-white/15 bg-transparent cursor-pointer overflow-hidden p-0"
                />
                <div className="flex-1 flex gap-1.5 items-center overflow-x-auto">
                  {['#ffffff', '#0f172a', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTintColor(color)}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        tintColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent scale-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background Opacity */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Background Opacity</span>
                <span className="text-white/50 font-mono">{(bgOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgOpacity * 100}
                onChange={(e) => setBgOpacity(Number(e.target.value) / 100)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Backdrop Blur Radius */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Backdrop Blur Radius</span>
                <span className="text-white/50 font-mono">{blurRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blurRadius}
                onChange={(e) => setBlurRadius(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Border Opacity */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Border Opacity</span>
                <span className="text-white/50 font-mono">{(borderOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={borderOpacity * 100}
                onChange={(e) => setBorderOpacity(Number(e.target.value) / 100)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Border Width */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Border Width</span>
                <span className="text-white/50 font-mono">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Box Shadow */}
            <div className="border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Box Shadow Opacity</span>
                <span className="text-white/50 font-mono">{shadowOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={shadowOpacity}
                onChange={(e) => setShadowOpacity(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              
              <div className="flex justify-between text-xs mt-3 mb-1.5">
                <span className="text-white/70">Shadow Color</span>
                <span className="text-white/50 font-mono">{shadowColor.toUpperCase()}</span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/15 bg-transparent cursor-pointer overflow-hidden p-0"
                />
                <div className="flex gap-1.5 items-center">
                  {['#000000', '#1e1b4b', '#4c0519', '#022c22'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setShadowColor(color)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        shadowColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Center & Right Side: Preview Area & Exporter */}
        <section className="lg:col-span-8 flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
          
          {/* Main Visual Preview Area */}
          <div className="flex-1 bg-[#121212] relative overflow-hidden flex flex-col items-center justify-center p-6 border-b border-white/10">
            {/* Background selector tabs */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-1">
              {(['mesh', 'develop', 'preview', 'ship'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setBgStyle(style)}
                  className={`px-3 py-1 rounded text-[10px] font-semibold tracking-wider uppercase transition-all ${
                    bgStyle === style
                      ? 'bg-white/15 text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Vibrant Background Canvas layer */}
            <div className="absolute inset-0 z-0">
              {bgStyle === 'mesh' && (
                <div className="w-full h-full bg-[#0a0a0c] relative overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-full blur-[120px] animation-delay-2000 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-yellow-500/15 rounded-full blur-[90px]"></div>
                </div>
              )}
              {bgStyle === 'develop' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#002f52] via-[#000e1a] to-black"></div>
              )}
              {bgStyle === 'preview' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#3a084c] via-[#0d0012] to-black"></div>
              )}
              {bgStyle === 'ship' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#521c00] via-[#1a0800] to-black"></div>
              )}
            </div>

            {/* Live Component Render (Centered Overlay) */}
            <div className="z-10 w-full max-w-lg flex items-center justify-center min-h-[300px]">
              {isPremiumLocked(selectedComp) ? (
                /* Premium Lock State card overlay */
                <div 
                  className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-yellow-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-yellow-500/10 p-3 rounded-full border border-yellow-500/20 text-yellow-400">
                      <LockIcon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-md font-semibold text-white">Premium Template Locked</h4>
                      <p className="text-xs text-white/50 max-w-[250px] mx-auto">
                        This template uses advanced micro-glow parameters, gradient border masks, and high-performance settings.
                      </p>
                    </div>

                    <div className="w-full border-t border-white/15 my-2"></div>

                    <div className="flex items-center justify-between w-full text-xs text-white/60 mb-2">
                      <span>Premium Layout</span>
                      <span className="font-bold text-yellow-400 text-sm">
                        {selectedComp === 'glass-premium-card' ? '$4.99' : '$7.99'}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePurchase(selectedComp)}
                      disabled={purchasingId !== null}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center justify-center space-x-2"
                    >
                      {purchasingId === selectedComp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-black" />
                          <span>Buy Now with Stripe</span>
                        </>
                      )}
                    </button>
                    {!user && (
                      <p className="text-[10px] text-white/40">
                        * Redirects to safe Stripe Checkout. Login required.
                      </p>
                    )}
                  </div>
                </div>
              ) : loadingPremium ? (
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-white/60" />
                  <span className="text-xs text-white/40 font-mono">Decrypting Premium Styling...</span>
                </div>
              ) : (
                /* Unlocked component rendering */
                <>
                  {selectedComp === 'credit-card' && (
                    <div 
                      style={glassStyle}
                      className="w-96 h-56 rounded-2xl p-6 relative flex flex-col justify-between transition-all"
                    >
                      {/* Top section */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">Project Vault</span>
                          <span className="text-xs font-semibold text-white/90">Apex Card</span>
                        </div>
                        {/* Metallic chip */}
                        <div className="w-10 h-7 bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-600 border border-yellow-700/30 rounded-md shadow-inner"></div>
                      </div>
                      
                      {/* Middle section (Card Number) */}
                      <div className="text-lg font-mono tracking-widest text-white/80 my-3">
                        ••••  ••••  ••••  8092
                      </div>

                      {/* Bottom section */}
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono uppercase tracking-wider text-white/45 block">Card Holder</span>
                          <span className="text-xs font-medium text-white/80 uppercase">Alexis Vance</span>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="text-[8px] font-mono uppercase tracking-wider text-white/45 block">Expires</span>
                          <span className="text-xs font-medium text-white/80 font-mono">06/29</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'login-modal' && (
                    <div 
                      style={glassStyle}
                      className="w-80 rounded-2xl p-6 flex flex-col space-y-4 transition-all"
                    >
                      <div className="space-y-1 text-center">
                        <h4 className="font-semibold text-sm">Vault Login</h4>
                        <p className="text-[10px] text-white/50">Enter credentials to unlock secure data</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/60 font-medium">Email Address</label>
                          <input 
                            disabled
                            type="text" 
                            placeholder="admin@vault.io" 
                            className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 px-3.5 text-xs text-white/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/60 font-medium">Master Password</label>
                          <input 
                            disabled
                            type="password" 
                            placeholder="••••••••••••" 
                            className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 px-3.5 text-xs text-white/40 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <button 
                        disabled 
                        className="w-full bg-white text-black py-2 rounded-lg text-xs font-semibold mt-2 cursor-not-allowed opacity-80"
                      >
                        Unlock Database
                      </button>
                    </div>
                  )}

                  {selectedComp === 'dashboard-sidebar' && (
                    <div 
                      style={glassStyle}
                      className="w-64 h-80 rounded-2xl p-4 flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-6">
                        {/* Sidebar Header */}
                        <div className="flex items-center space-x-2 px-1">
                          <div className="w-5 h-5 bg-white/10 border border-white/20 rounded-md flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <span className="text-xs font-semibold tracking-wide">Workspace</span>
                        </div>

                        {/* Nav Items */}
                        <nav className="space-y-1">
                          {['Dashboard', 'Analytics', 'Team Access', 'Settings'].map((item, idx) => (
                            <div 
                              key={item}
                              className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                                idx === 0 
                                  ? 'bg-white/10 text-white font-medium border-l-2 border-white' 
                                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                              }`}
                            >
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </nav>
                      </div>

                      {/* Profile Card Bottom */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                          AV
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-[10px] font-medium leading-none text-white/95">Alexis Vance</p>
                          <p className="text-[8px] text-white/40 mt-0.5">Principal Dev</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREMIUM UNLOCKED - Glass Premium Card */}
                  {selectedComp === 'glass-premium-card' && (
                    <div 
                      style={glassStyle}
                      className="w-96 h-56 rounded-2xl p-6 relative flex flex-col justify-between transition-all border border-white/20"
                    >
                      {/* Holographic metallic background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center">
                            <Sparkles className="w-2.5 h-2.5 mr-1 fill-yellow-400 text-yellow-400" />
                            <span>Vault Premium</span>
                          </span>
                          <span className="text-xs font-semibold text-white">Hyperion Black Card</span>
                        </div>
                        <div className="w-10 h-7 bg-gradient-to-tr from-yellow-500 via-yellow-300 to-yellow-500 border border-yellow-400/50 rounded-md shadow-inner flex items-center justify-center text-[7px] text-black font-bold uppercase tracking-widest">
                          GOLD
                        </div>
                      </div>

                      <div className="text-xl font-mono tracking-widest text-white/95 my-3 z-10 drop-shadow-md">
                        4012  9821  6604  9922
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono uppercase tracking-wider text-white/45 block">Elite Member</span>
                          <span className="text-xs font-medium text-white/90 uppercase">Dr. Evelyn Sterling</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-mono uppercase tracking-wider text-white/45 block">Valid Thru</span>
                          <span className="text-xs font-medium text-white/90 font-mono">12/32</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREMIUM UNLOCKED - Glass Premium Widget */}
                  {selectedComp === 'glass-premium-modal' && (
                    <div 
                      style={glassStyle}
                      className="w-80 rounded-3xl p-6 flex flex-col space-y-4 transition-all"
                    >
                      {/* Dashboard widget contents */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Analytics Dashboard</span>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Live
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-white/50">Monthly CPU Utilization</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold tracking-tight">88.42%</span>
                          <span className="text-xs text-emerald-400 font-medium">↑ 12.3%</span>
                        </div>
                      </div>

                      {/* Custom visual SVG chart (sparkline) */}
                      <div className="w-full h-16 bg-white/5 border border-white/10 rounded-xl p-2 flex items-end relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent"></div>
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d="M 0 25 Q 15 5, 30 20 T 60 10 T 90 5 L 100 8"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Footer Details */}
                      <div className="flex justify-between text-[9px] text-white/50 border-t border-white/10 pt-3">
                        <span>Database Hits</span>
                        <span className="font-mono text-white/70">1.2B requests</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom Code Exporter Panel */}
          <div className="bg-[#090909] p-6 flex flex-col h-[280px] max-h-[280px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              {/* Syntax selection tabs */}
              <div className="flex space-x-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
                {(['css', 'tailwind', 'styled'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExportTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-all ${
                      exportTab === tab
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {tab === 'css' ? 'CSS' : tab === 'tailwind' ? 'Tailwind' : 'Styled-Components'}
                  </button>
                ))}
              </div>

              {/* Copy action */}
              <button
                onClick={handleCopy}
                disabled={isPremiumLocked(selectedComp)}
                className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/20 text-white/80 hover:text-white py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border border-white/5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Wrapper */}
            <div className="flex-1 overflow-auto bg-black/50 border border-white/5 rounded-lg p-4 font-mono text-xs text-white/80 relative select-text">
              {isPremiumLocked(selectedComp) ? (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                  <LockIcon className="w-6 h-6 text-yellow-400 mb-2" />
                  <p className="text-xs text-white font-medium">Export Code Block Locked</p>
                  <p className="text-[10px] text-white/40 mt-0.5 max-w-[280px]">
                    This premium CSS string is protected and is delivered only after a verified purchase.
                  </p>
                </div>
              ) : null}
              <pre className="whitespace-pre-wrap word-break-all leading-relaxed">
                {getActiveCodeString()}
              </pre>
            </div>
          </div>
        </section>
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
