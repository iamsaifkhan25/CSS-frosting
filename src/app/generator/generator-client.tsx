'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import AuthModal from '@/components/AuthModal'
import { 
  Copy, Check, User, LogOut, Lock as LockIcon, Sparkles, 
  CreditCard, Smartphone, LayoutGrid, Info, CheckCircle, 
  RefreshCw, Layers, ShieldCheck, ChevronRight, Shuffle, Maximize2, Minimize2, Move
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

export default function Generator() {
  // Supabase Auth & Purchase state
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<string[]>([])
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  // Canvas background selections
  const [bgStyle, setBgStyle] = useState<'aurora' | 'sunset' | 'ocean' | 'cyberpunk'>('aurora')

  // Sliders/Controls state
  const [tintColor, setTintColor] = useState('#ffffff')
  const [bgOpacity, setBgOpacity] = useState(0.15)
  const [blurRadius, setBlurRadius] = useState(16)
  const [saturate, setSaturate] = useState(120) // Backdrop saturation
  const [borderOpacity, setBorderOpacity] = useState(0.2)
  const [borderWidth, setBorderWidth] = useState(1)
  const [borderRadius, setBorderRadius] = useState(16)
  const [shadowOpacity, setShadowOpacity] = useState(20)
  const [shadowColor, setShadowColor] = useState('#000000')
  const [noiseOpacity, setNoiseOpacity] = useState(4) // Frosted noise

  // Refs for custom color pickers
  const tintColorInputRef = useRef<HTMLInputElement>(null)
  const shadowColorInputRef = useRef<HTMLInputElement>(null)

  // Selected component
  const [selectedComp, setSelectedComp] = useState<string>('credit-card')
  const [premiumCss, setPremiumCss] = useState<string | null>(null)
  const [loadingPremium, setLoadingPremium] = useState(false)

  // Layout Adjustment States
  const [controlsPosition, setControlsPosition] = useState<'left' | 'right' | 'presentation'>('left')
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop' | 'free'>('free')
  const [freeWidth, setFreeWidth] = useState(420)
  const [freeHeight, setFreeHeight] = useState(280)

  // Template editable texts
  const [cardHolder, setCardHolder] = useState('Alexis Vance')
  const [cardNumber, setCardNumber] = useState('••••  ••••  ••••  8092')
  const [cardExpiry, setCardExpiry] = useState('06/29')
  const [loginTitle, setLoginTitle] = useState('Vault Access')
  const [loginDesc, setLoginDesc] = useState('Enter master keys to decrypt database')

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

    // Handle query params on mount
    const query = new URLSearchParams(window.location.search)
    const compParam = query.get('comp')
    if (compParam) {
      setSelectedComp(compParam)
    }

    const checkoutStatus = query.get('checkout')
    if (checkoutStatus === 'success') {
      setNotification({
        type: 'success',
        message: `Payment successful! Premium template has been permanently unlocked.`,
      })
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
        backdropFilter: `blur(${blurRadius}px) saturate(${saturate}%)`,
        WebkitBackdropFilter: `blur(${blurRadius}px) saturate(${saturate}%)`,
        border: `${borderWidth}px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
        boxShadow: `0 8px 32px 0 rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${shadowOpacity / 100})`,
        borderRadius: `${borderRadius}px`,
      }

  // Create text representations
  const cssCodeString = premiumCss || `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity});
backdrop-filter: blur(${blurRadius}px) saturate(${saturate}%);
-webkit-backdrop-filter: blur(${blurRadius}px) saturate(${saturate}%);
border: ${borderWidth}px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${shadowOpacity / 100});
border-radius: ${borderRadius}px;`

  const tailwindCodeString = premiumCss 
    ? `/* Customized premium layout classes */` 
    : `bg-[rgba(${rgb.r},${rgb.g},${rgb.b},${bgOpacity})] backdrop-blur-[${blurRadius}px] backdrop-saturate-[${saturate}%] border-[${borderWidth}px] border-[rgba(${rgb.r},${rgb.g},${rgb.b},${borderOpacity})] shadow-[0_8px_32px_0_rgba(${shadowRgb.r},${shadowRgb.g},${shadowRgb.b},${shadowOpacity/100})] rounded-[${borderRadius}px]`

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
    if (purchases.includes('glass-premium-all-access')) return false
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

  // Randomize values for a fresh look
  const handleRandomize = () => {
    const colors = ['#ffffff', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
    const randColor = colors[Math.floor(Math.random() * colors.length)]
    setTintColor(randColor)
    setBgOpacity(Number((Math.random() * 0.35 + 0.05).toFixed(2)))
    setBlurRadius(Math.floor(Math.random() * 25 + 5))
    setSaturate(Math.floor(Math.random() * 150 + 80))
    setBorderOpacity(Number((Math.random() * 0.3 + 0.1).toFixed(2)))
    setBorderWidth(Number((Math.random() * 2 + 0.5).toFixed(1)))
    setBorderRadius(Math.floor(Math.random() * 20 + 8))
    setShadowOpacity(Math.floor(Math.random() * 40 + 10))
    setNoiseOpacity(Math.floor(Math.random() * 10))
  }

  // Dimensions of preview box depending on aspect ratio selection
  const getPreviewDimensions = () => {
    if (previewSize === 'mobile') return { width: 340, height: 500 }
    if (previewSize === 'tablet') return { width: 580, height: 400 }
    if (previewSize === 'desktop') return { width: 720, height: 420 }
    return { width: freeWidth, height: freeHeight }
  }

  const currentDimensions = getPreviewDimensions()

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col font-sans select-none antialiased relative">
      
      {/* Main Workspace Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[calc(100vh-4rem)]">
        
        {/* Left Side: Parameters Control Panel */}
        {controlsPosition === 'left' && (
          <section className="lg:col-span-4 bg-[#080808] border-r border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <ControlPanel />
          </section>
        )}

        {/* Center Canvas Preview Area */}
        <section className={`flex flex-col overflow-hidden ${
          controlsPosition === 'presentation' ? 'lg:col-span-12' : 'lg:col-span-8'
        }`}>
          {/* Canvas Sub-Header Controls */}
          <div className="bg-[#0c0c0c] border-b border-white/10 px-6 py-3 flex items-center justify-between flex-wrap gap-4 z-10">
            {/* Aspect Preset Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Viewport:</span>
              <div className="flex bg-black/45 border border-white/10 rounded-lg p-0.5 text-[10px]">
                {(['free', 'mobile', 'tablet', 'desktop'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreviewSize(size)}
                    className={`px-2.5 py-1 rounded-md font-bold uppercase transition-all ${
                      previewSize === size
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Freeform Resizer (only if free viewport is selected) */}
            {previewSize === 'free' && (
              <div className="flex items-center space-x-3 bg-black/45 border border-white/10 rounded-lg px-2.5 py-1 text-[10px]">
                <div className="flex items-center space-x-1">
                  <span className="text-white/40 font-mono">W:</span>
                  <input
                    type="range"
                    min="280"
                    max="800"
                    value={freeWidth}
                    onChange={(e) => setFreeWidth(Number(e.target.value))}
                    className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <input
                    type="number"
                    value={freeWidth}
                    onChange={(e) => setFreeWidth(Math.max(280, Math.min(800, Number(e.target.value))))}
                    className="w-10 bg-white/5 border border-white/10 rounded px-1 text-center font-mono text-[9px] focus:outline-none"
                  />
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center space-x-1">
                  <span className="text-white/40 font-mono">H:</span>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    value={freeHeight}
                    onChange={(e) => setFreeHeight(Number(e.target.value))}
                    className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <input
                    type="number"
                    value={freeHeight}
                    onChange={(e) => setFreeHeight(Math.max(200, Math.min(600, Number(e.target.value))))}
                    className="w-10 bg-white/5 border border-white/10 rounded px-1 text-center font-mono text-[9px] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Canvas Theme Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Theme:</span>
              <div className="flex bg-black/45 border border-white/10 rounded-lg p-0.5 text-[10px]">
                {(['aurora', 'sunset', 'ocean', 'cyberpunk'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setBgStyle(style)}
                    className={`px-2.5 py-1 rounded-md font-bold uppercase transition-all ${
                      bgStyle === style
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Dock Positioner */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Dock Panel:</span>
                <div className="flex bg-black/45 border border-white/10 rounded-lg p-0.5 text-[10px]">
                  {(['left', 'right', 'presentation'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setControlsPosition(pos)}
                      className={`px-2.5 py-1 rounded-md font-bold uppercase transition-all ${
                        controlsPosition === pos
                          ? 'bg-white/10 text-white'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {pos === 'presentation' ? 'Fullscreen' : pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Randomizer */}
              <button
                onClick={handleRandomize}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-2 rounded-lg text-white/70 hover:text-white transition-all flex items-center justify-center"
                title="Randomize Parameters"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas visual zone */}
          <div className="flex-1 bg-[#121212] relative overflow-hidden flex flex-col items-center justify-center p-8 border-b border-white/10 select-none">

            {/* Vibrant Background Canvas layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {bgStyle === 'aurora' && (
                <div className="w-full h-full bg-[#0a0a0c] relative overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-full blur-[120px] animation-delay-2000 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-yellow-500/15 rounded-full blur-[90px]"></div>
                </div>
              )}
              {bgStyle === 'sunset' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#521c00] via-[#1a0800] to-black">
                  <div className="absolute top-1/3 left-1/3 w-[30rem] h-[30rem] bg-orange-500/20 rounded-full blur-[110px]"></div>
                </div>
              )}
              {bgStyle === 'ocean' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#002f52] via-[#000e1a] to-black">
                  <div className="absolute top-1/2 left-2/3 w-[25rem] h-[25rem] bg-teal-500/15 rounded-full blur-[100px]"></div>
                </div>
              )}
              {bgStyle === 'cyberpunk' && (
                <div className="w-full h-full bg-gradient-to-tr from-[#3a084c] via-[#0d0012] to-black">
                  <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse"></div>
                  <div className="absolute top-1/4 right-1/4 w-[25rem] h-[25rem] bg-cyan-500/15 rounded-full blur-[100px]"></div>
                </div>
              )}
            </div>

            {/* Adjustable Box Wrapper */}
            <div 
              style={{
                width: `${currentDimensions.width}px`,
                height: `${currentDimensions.height}px`,
                transition: previewSize === 'free' ? 'none' : 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1), height 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'width, height',
                transform: 'translate3d(0, 0, 0)'
              }}
              className="z-10 border border-dashed border-white/20 rounded-2xl relative flex items-center justify-center p-6 bg-black/10 shadow-[0_0_50px_rgba(0,0,0,0.4)]"
            >
              {/* Rulers / Dimensions Info Overlay */}
              <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-[10px] font-mono text-white/40 px-1 pointer-events-none">
                <span>{currentDimensions.width}px wide</span>
                <span>{currentDimensions.height}px tall</span>
              </div>

              {/* Editable interactive glass panel inside */}
              {isPremiumLocked(selectedComp) ? (
                /* Premium Lock state */
                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/75 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center space-y-4">
                  <div className="bg-yellow-500/10 p-2.5 rounded-full border border-yellow-500/20 text-yellow-400">
                    <LockIcon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Unlock Preset Design</h4>
                    <p className="text-[10px] text-white/50 max-w-[220px] mx-auto mt-1 leading-relaxed">
                      To load, copy, and modify this premium template, unlock it via card payment.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePurchase(selectedComp)}
                    disabled={purchasingId !== null}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95"
                  >
                    {purchasingId === selectedComp ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Purchase & Unlock</span>
                      </>
                    )}
                  </button>
                </div>
              ) : loadingPremium ? (
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-white/60" />
                  <span className="text-[10px] text-white/40 font-mono">Loading styling rules...</span>
                </div>
              ) : (
                /* Actual interactive template */
                <div className="w-full h-full flex items-center justify-center relative">
                  
                  {/* Frosted noise overlay texture */}
                  <div 
                    style={{
                      opacity: noiseOpacity / 100,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                      borderRadius: `${borderRadius}px`
                    }}
                    className="absolute inset-0 pointer-events-none z-10"
                  ></div>

                  {/* Template selector */}
                  {selectedComp === 'credit-card' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-sm aspect-[1.6] p-6 relative flex flex-col justify-between transition-[background-color,border-color,box-shadow] duration-300 border select-text z-0"
                    >
                      {/* Top section */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 font-bold">Project Vault</span>
                          <span className="text-[10px] font-semibold text-white/80">Premium Card</span>
                        </div>
                        <div className="w-9 h-6 bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-600 border border-yellow-700/30 rounded-md shadow-inner"></div>
                      </div>
                      
                      {/* Middle section (Card Number) */}
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none text-base font-mono tracking-widest text-white/90 my-2 w-full text-center"
                        title="Click to Edit Card Number"
                      />

                      {/* Bottom section */}
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <span className="text-[7px] font-mono uppercase tracking-wider text-white/40 block">Card Holder</span>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none text-[10px] font-medium text-white/80 uppercase w-32"
                            title="Click to Edit Card Holder"
                          />
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="text-[7px] font-mono uppercase tracking-wider text-white/40 block">Expires</span>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none text-[10px] font-mono text-white/80 w-12 text-right"
                            title="Click to Edit Expiry"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'login-modal' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[280px] p-5 flex flex-col space-y-4 transition-[background-color,border-color,box-shadow] duration-300 border select-text z-0"
                    >
                      <div className="space-y-1 text-center">
                        <input
                          type="text"
                          value={loginTitle}
                          onChange={(e) => setLoginTitle(e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none text-xs font-bold text-center w-full"
                          title="Click to Edit Title"
                        />
                        <input
                          type="text"
                          value={loginDesc}
                          onChange={(e) => setLoginDesc(e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none text-[8px] text-white/45 text-center w-full"
                          title="Click to Edit Description"
                        />
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-white/60 font-semibold uppercase">Email Address</label>
                          <input 
                            disabled
                            type="text" 
                            placeholder="user@vault.io" 
                            className="w-full bg-white/5 border border-white/10 rounded-md py-1 px-3 text-[10px] text-white/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-white/60 font-semibold uppercase">Password</label>
                          <input 
                            disabled
                            type="password" 
                            placeholder="••••••••••••" 
                            className="w-full bg-white/5 border border-white/10 rounded-md py-1 px-3 text-[10px] text-white/40 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <button 
                        disabled 
                        className="w-full bg-white text-black py-1.5 rounded-lg text-[10px] font-bold mt-2 cursor-not-allowed opacity-80"
                      >
                        Authenticate
                      </button>
                    </div>
                  )}

                  {selectedComp === 'dashboard-sidebar' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[220px] h-[260px] p-4 flex flex-col justify-between transition-[background-color,border-color,box-shadow] duration-300 border select-text z-0"
                    >
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2 px-1">
                          <div className="w-4 h-4 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-[10px] font-bold tracking-wide uppercase text-white/80">Vault Engine</span>
                        </div>

                        <nav className="space-y-1">
                          {['Dashboard', 'Analytics', 'Access Control', 'Settings'].map((item, idx) => (
                            <div 
                              key={item}
                              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[9px] transition-colors cursor-pointer ${
                                idx === 0 
                                  ? 'bg-white/10 text-white font-semibold border-l-2 border-white' 
                                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                              }`}
                            >
                              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </nav>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                          AV
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-[9px] font-bold leading-none text-white/95">Alexis Vance</p>
                          <p className="text-[7px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Dev Principal</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Premium templates */}
                  {selectedComp === 'glass-premium-card' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-sm aspect-[1.6] p-6 relative flex flex-col justify-between transition-[background-color,border-color,box-shadow] duration-300 border border-white/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center">
                            <Sparkles className="w-2.5 h-2.5 mr-1 fill-yellow-400 text-yellow-400" />
                            <span>Vault Premium</span>
                          </span>
                          <span className="text-[10px] font-bold text-white uppercase">Hyperion Elite Card</span>
                        </div>
                        <div className="w-9 h-6 bg-gradient-to-tr from-yellow-500 via-yellow-300 to-yellow-500 border border-yellow-400/50 rounded-md shadow-inner flex items-center justify-center text-[6px] text-black font-bold uppercase tracking-widest">
                          GOLD
                        </div>
                      </div>

                      <div className="text-base font-mono tracking-widest text-white/95 my-3 z-10 drop-shadow-md text-center">
                        4012  9821  6604  9922
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div className="space-y-0.5">
                          <span className="text-[7px] font-mono uppercase tracking-wider text-white/45 block">Elite Member</span>
                          <span className="text-[10px] font-semibold text-white/90 uppercase">Dr. Evelyn Sterling</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] font-mono uppercase tracking-wider text-white/45 block">Valid Thru</span>
                          <span className="text-[10px] font-semibold text-white/90 font-mono">12/32</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-premium-modal' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[260px] p-5 flex flex-col space-y-3.5 transition-[background-color,border-color,box-shadow] duration-300 border"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Server Status</span>
                        </div>
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          ONLINE
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8px] text-white/50 font-bold uppercase">CPU Core Load</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold tracking-tight">88.42%</span>
                          <span className="text-[10px] text-emerald-400 font-bold">↑ 12%</span>
                        </div>
                      </div>

                      {/* Custom visual SVG chart (sparkline) */}
                      <div className="w-full h-12 bg-white/5 border border-white/10 rounded-lg p-1 flex items-end relative overflow-hidden">
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

                      <div className="flex justify-between text-[8px] text-white/50 border-t border-white/10 pt-2.5 font-bold uppercase">
                        <span>Cluster Hits</span>
                        <span className="font-mono text-white/70">1.2B reqs</span>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-button-group' && (
                    <div 
                      style={glassStyle}
                      className="p-6 transition-[background-color,border-color,box-shadow] duration-300 border flex flex-col space-y-4 items-center justify-center rounded-2xl"
                    >
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/45 font-bold">Button & Tag Presets</span>
                      <div className="flex flex-wrap gap-3 justify-center items-center">
                        <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold text-white transition-all cursor-pointer">
                          Primary Action
                        </button>
                        <button className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-white/80 transition-all cursor-pointer">
                          Secondary
                        </button>
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/25 text-[9px] font-mono text-purple-400">
                          Active Tag
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-navbar' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-sm p-4 transition-[background-color,border-color,box-shadow] duration-300 border flex items-center justify-between rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-white/20 rounded-md"></div>
                        <span className="text-xs font-bold tracking-wide">Brand.io</span>
                      </div>
                      <div className="flex space-x-3 text-[10px] font-semibold text-white/60">
                        <span>Home</span>
                        <span>Docs</span>
                        <span>Blog</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px]">
                        U
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-tooltip' && (
                    <div 
                      style={glassStyle}
                      className="max-w-[200px] p-4 transition-[background-color,border-color,box-shadow] duration-300 border flex flex-col space-y-2 rounded-xl"
                    >
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-white/95">Pro Hint</span>
                      </div>
                      <p className="text-[9px] text-white/60 leading-relaxed">
                        Backdrop-blur values over 20px create a very dense, frosted glass pane effect.
                      </p>
                    </div>
                  )}

                  {selectedComp === 'glass-premium-pricing' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[240px] p-5 flex flex-col space-y-4 transition-[background-color,border-color,box-shadow] duration-300 border rounded-2xl"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Enterprise
                        </span>
                        <h4 className="text-2xl font-bold tracking-tight text-white mt-1">$99<span className="text-xs text-white/40 font-normal">/mo</span></h4>
                      </div>
                      <div className="space-y-1.5 border-t border-white/5 pt-3">
                        {['Unlimited Assets', 'Real-time Sync', '24/7 Priority Support'].map((feat) => (
                          <div key={feat} className="flex items-center space-x-2 text-[9px] text-white/60">
                            <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full bg-white text-black py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  {selectedComp === 'glass-premium-player' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[260px] p-5 flex flex-col space-y-3 transition-[background-color,border-color,box-shadow] duration-300 border rounded-2xl"
                    >
                      <div className="flex space-x-3 items-center">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate text-left">Neon Nights</p>
                          <p className="text-[9px] text-white/40 truncate text-left">Lofi Dreamscape</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-pink-500 w-1/3 h-full rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-[7px] text-white/30 font-mono">
                        <span>0:45</span>
                        <span>2:15</span>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-premium-wallet' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[280px] p-5 flex flex-col space-y-4 transition-[background-color,border-color,box-shadow] duration-300 border rounded-2xl"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[7px] font-mono text-white/45 uppercase tracking-wider block">Wallet Balance</span>
                          <span className="text-xl font-bold tracking-tight text-white">$14,204.88</span>
                        </div>
                        <span className="text-[8px] bg-white/10 border border-white/15 text-white/70 px-2 py-0.5 rounded font-mono">
                          0x4e...9f
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>Ethereum (ETH)</span>
                          <span className="font-bold">3.24 ETH</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>USD Coin (USDC)</span>
                          <span className="font-bold">4,120.00 USDC</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedComp === 'glass-premium-analytics' && (
                    <div 
                      style={glassStyle}
                      className="w-full max-w-[260px] p-5 flex flex-col space-y-3.5 transition-[background-color,border-color,box-shadow] duration-300 border rounded-2xl"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide">Live Data Engine</span>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-left">
                          <p className="text-[7px] text-white/40 uppercase font-semibold">Active Nodes</p>
                          <p className="text-sm font-bold text-white mt-0.5">48 / 50</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-left">
                          <p className="text-[7px] text-white/40 uppercase font-semibold">Bandwidth</p>
                          <p className="text-sm font-bold text-white mt-0.5">1.2 Gbps</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Viewport size controls relocated to sub-header */}
          </div>

          {/* Bottom Code Exporter Panel */}
          <div className="bg-[#090909] p-6 flex flex-col h-[260px] max-h-[260px] relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              {/* Syntax selection tabs */}
              <div className="flex space-x-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
                {(['css', 'tailwind', 'styled'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExportTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-all ${
                      exportTab === tab
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {tab === 'css' ? 'CSS' : tab === 'tailwind' ? 'Tailwind' : 'Styled'}
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
                  <LockIcon className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xs text-white font-medium">Export Code Block Locked</p>
                  <p className="text-[10px] text-white/40 mt-0.5 max-w-[280px]">
                    This premium styling is encrypted and will unlock upon verifying payment.
                  </p>
                </div>
              ) : null}
              <pre className="whitespace-pre-wrap word-break-all leading-relaxed">
                {getActiveCodeString()}
              </pre>
            </div>
          </div>
        </section>

        {/* Right Side: Parameters Control Panel (if positioned right) */}
        {controlsPosition === 'right' && (
          <section className="lg:col-span-4 bg-[#080808] border-l border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <ControlPanel />
          </section>
        )}

      </main>

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={fetchUserAndPurchases}
      />
    </div>
  )

  // Reusable Control Panel Component
  function ControlPanel() {
    return (
      <>
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
              className="text-white/40 hover:text-white ml-auto font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Component Preset Tabs */}
        <div>
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5">
            1. Select Component Preset
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'credit-card', name: 'Card', icon: CreditCard },
              { id: 'login-modal', name: 'Modal', icon: Smartphone },
              { id: 'dashboard-sidebar', name: 'Sidebar', icon: LayoutGrid },
              { id: 'glass-button-group', name: 'Buttons', icon: Sparkles },
              { id: 'glass-navbar', name: 'Navbar', icon: LayoutGrid },
              { id: 'glass-tooltip', name: 'Tooltip', icon: Smartphone }
            ].map((comp) => {
              const Icon = comp.icon
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp.id)}
                  className={`py-2 px-1 text-xs rounded-lg border font-semibold transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                    selectedComp === comp.id
                      ? 'bg-white/10 border-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                      : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{comp.name}</span>
                </button>
              )
            })}
          </div>

          {/* Premium preset selection */}
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-3 h-3 mr-0.5 fill-yellow-400 text-yellow-400" />
                <span>Premium Layouts</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'glass-premium-card', name: 'Elite Card' },
                { id: 'glass-premium-modal', name: 'Live Status' },
                { id: 'glass-premium-pricing', name: 'Pricing Table' },
                { id: 'glass-premium-player', name: 'Music HUD' },
                { id: 'glass-premium-wallet', name: 'DeFi Wallet' },
                { id: 'glass-premium-analytics', name: 'Analytics Hub' }
              ].map((pComp) => (
                <button
                  key={pComp.id}
                  onClick={() => setSelectedComp(pComp.id)}
                  className={`py-2 px-2 text-xs rounded-lg border font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    selectedComp === pComp.id
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[inset_0_1px_1px_rgba(234,179,8,0.1)]'
                      : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{pComp.name}</span>
                  {isPremiumLocked(pComp.id) ? (
                    <LockIcon className="w-3 h-3 text-white/40 shrink-0 ml-1" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliders Control Engine */}
        <div className={`space-y-5 flex-1 border-t border-white/10 pt-4 ${
          selectedComp.startsWith('glass-premium-') ? 'opacity-40 pointer-events-none' : ''
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              2. Design Engine Variables
            </h3>
            {selectedComp.startsWith('glass-premium-') && (
              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white/60">
                Preset Locked
              </span>
            )}
          </div>

          {/* Tint Color Picker */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white/70">Glass Tint Color</span>
              <span className="text-white/50 font-mono uppercase">{tintColor}</span>
            </div>
            <div className="flex space-x-3 items-center">
              <div 
                className="relative w-9 h-7 rounded border border-white/15 overflow-hidden cursor-pointer flex-shrink-0 shadow-inner"
                style={{ backgroundColor: tintColor }}
                title="Select Custom Tint Color"
              >
                <input
                  type="color"
                  value={tintColor}
                  onChange={(e) => setTintColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                />
              </div>
              <div className="flex-1 flex gap-1.5 items-center overflow-x-auto">
                {['#ffffff', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setTintColor(color)}
                    className={`w-5.5 h-5.5 rounded-full border transition-transform ${
                      tintColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent scale-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Background Opacity */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
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
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
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

          {/* Backdrop Saturation */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white/70">Backdrop Saturation</span>
              <span className="text-white/50 font-mono">{saturate}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              value={saturate}
              onChange={(e) => setSaturate(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Border Width & Opacity */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
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

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
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
          </div>

          {/* Border Corners */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white/70">Border Radius (Rounded)</span>
              <span className="text-white/50 font-mono">{borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Noise Frosted Texture */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white/70">Frosted Noise Texture</span>
              <span className="text-white/50 font-mono">{noiseOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={noiseOpacity}
              onChange={(e) => setNoiseOpacity(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Box Shadow parameters */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white/70">Shadow Opacity</span>
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
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-white/70">Shadow Color</span>
                <span className="text-white/50 font-mono uppercase">{shadowColor}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <div 
                  className="relative w-7 h-7 rounded border border-white/15 overflow-hidden cursor-pointer flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: shadowColor }}
                  title="Select Custom Shadow Color"
                >
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                  />
                </div>
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
        </div>
      </>
    )
  }
}
