'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { createClient } from '@/lib/supabase-client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, Copy, Check, 
  Code, Sliders, ShieldCheck, ArrowRight, RotateCw, Eye, Lock
} from 'lucide-react'

// Examples of code to let the user try the analyzer easily
const CODE_EXAMPLES = {
  cssPremium: {
    name: 'Premium Glass Card (CSS)',
    mode: 'css',
    code: `background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
backdrop-filter: blur(20px) saturate(160%);
-webkit-backdrop-filter: blur(20px) saturate(160%);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.25);
border-radius: 20px;`
  },
  tailwindNeon: {
    name: 'Neon Cyan Panel (Tailwind)',
    mode: 'tailwind',
    code: `bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 shadow-[0_16px_45px_0_rgba(6,182,212,0.15)] rounded-3xl`
  },
  styledDefi: {
    name: 'DeFi Glass Panel (Styled)',
    mode: 'styled',
    code: `const DeFiCard = styled.div\`
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.01));
  backdrop-filter: blur(30px) saturate(120%);
  -webkit-backdrop-filter: blur(30px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.4);
  border-radius: 28px;
\`;`
  },
  nonGlass: {
    name: 'Standard Dark Card (CSS - Non-Glass)',
    mode: 'css',
    code: `background-color: #121212;
border: 1px solid #222222;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
border-radius: 12px;`
  }
}

interface AnalysisResult {
  score: number;
  rating: 'pure' | 'standard' | 'partial' | 'none';
  hasBackground: boolean;
  backgroundScore: number;
  hasBlur: boolean;
  blurScore: number;
  hasBorder: boolean;
  borderScore: number;
  hasShadow: boolean;
  shadowScore: number;
  suggestions: string[];
}

// Countdown clock setup (Module-level constants)
const LAUNCH_DATE = new Date('2026-06-14T00:00:00Z')
const LOCK_DATE = new Date(LAUNCH_DATE.getTime() + 180 * 24 * 60 * 60 * 1000) // 180 days trial period

export default function AnalyzerClient() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [purchases, setPurchases] = useState<string[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [inputMode, setInputMode] = useState<'css' | 'tailwind' | 'styled'>('css')
  const [code, setCode] = useState(CODE_EXAMPLES.cssPremium.code)
  const [canvasBg, setCanvasBg] = useState<'aurora' | 'sunset' | 'ocean' | 'cyberpunk'>('aurora')
  const [copied, setCopied] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isFreePeriodActive, setIsFreePeriodActive] = useState(true)

  const supabase = createClient()

  // Countdown timer hook
  useEffect(() => {
    const updateTimer = () => {
      const diff = LOCK_DATE.getTime() - new Date().getTime()
      if (diff <= 0) {
        setIsFreePeriodActive(false)
      } else {
        setIsFreePeriodActive(true)
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

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
        setPurchases(userPurchases.map((p: { product_id: string }) => p.product_id))
      }
    } else {
      setUser(null)
      setPurchases([])
    }
    setLoadingUser(false)
  }

  // Load Razorpay Script and fetch User + Purchases
  useEffect(() => {
    let active = true
    
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (active) {
        if (session?.user) {
          setUser(session.user)
          const { data: userPurchases, error } = await supabase
            .from('purchases')
            .select('product_id')
            .eq('user_id', session.user.id)
            .eq('status', 'completed')
          
          if (!error && userPurchases) {
            setPurchases(userPurchases.map((p: { product_id: string }) => p.product_id))
          }
        } else {
          setUser(null)
          setPurchases([])
        }
        setLoadingUser(false)
      }
    }
    init()
    
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

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
            setPurchases(userPurchases.map((p: { product_id: string }) => p.product_id))
          }
        } else {
          setUser(null)
          setPurchases([])
        }
        if (active) {
          setLoadingUser(false)
        }
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [supabase])



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
          description: productId === 'glass-analyzer' ? 'Unlock UI Verifier' : 'Unlock Ultimate Mega Bundle',
          order_id: data.orderId,
          handler: async function (response: {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
          }) {
            setPurchasingId(productId)
            try {
              const verifyRes = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  productId,
                }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success) {
                setNotification({
                  type: 'success',
                  message: productId === 'glass-analyzer' 
                    ? 'Glassmorphism Analyzer permanently unlocked!' 
                    : 'Ultimate Mega Bundle permanently unlocked!',
                })
                fetchUserAndPurchases()
              } else {
                setNotification({
                  type: 'error',
                  message: verifyData.error || 'Verification failed.',
                })
              }
            } catch (err: unknown) {
              const errMsg = err instanceof Error ? err.message : 'An error occurred during verification.'
              setNotification({
                type: 'error',
                message: errMsg
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

        const win = window as unknown as {
          Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
        }
        if (win.Razorpay) {
          const rzp = new win.Razorpay(options as Record<string, unknown>)
          rzp.open()
        } else {
          alert('Razorpay failed to load.')
        }
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

  const isUnlocked = isFreePeriodActive || 
                     purchases.includes('glass-analyzer') || 
                     purchases.includes('glass-premium-all-access') || 
                     purchases.includes('glass-mega-bundle')

  const loadExample = (exampleKey: keyof typeof CODE_EXAMPLES) => {
    const ex = CODE_EXAMPLES[exampleKey]
    setInputMode(ex.mode as 'css' | 'tailwind' | 'styled')
    setCode(ex.code)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Parse CSS declarations into React inline styles
  const parseCssStringToStyles = (cssString: string): React.CSSProperties => {
    const styles: Record<string, string> = {}
    cssString.split('\n').forEach((line) => {
      const cleanLine = line.trim()
      if (!cleanLine || cleanLine.startsWith('/*') || cleanLine.startsWith('//')) return
      const delimiterIndex = cleanLine.indexOf(':')
      if (delimiterIndex === -1) return
      const property = cleanLine.substring(0, delimiterIndex).trim()
      const value = cleanLine.substring(delimiterIndex + 1).replace(';', '').trim()
      
      // Map properties to React equivalent camelCase names
      if (property === 'background') styles.background = value
      else if (property === 'background-color') styles.backgroundColor = value
      else if (property === 'backdrop-filter') styles.backdropFilter = value
      else if (property === '-webkit-backdrop-filter') styles.WebkitBackdropFilter = value
      else if (property === 'border') styles.border = value
      else if (property === 'border-width') styles.borderWidth = value
      else if (property === 'border-color') styles.borderColor = value
      else if (property === 'border-style') styles.borderStyle = value
      else if (property === 'border-bottom') styles.borderBottom = value
      else if (property === 'box-shadow') styles.boxShadow = value
      else if (property === 'border-radius') styles.borderRadius = value
      else if (property === 'background-image') styles.backgroundImage = value
    })
    return styles as React.CSSProperties
  }

  // Parse Styled-Components style blocks
  const parseStyledStringToStyles = (styledString: string): React.CSSProperties => {
    const match = styledString.match(/`([\s\S]*?)`/);
    if (!match || !match[1]) return parseCssStringToStyles(styledString)
    return parseCssStringToStyles(match[1])
  }

  const runAnalysis = useCallback(() => {
    let hasBackground = false
    let hasBlur = false
    let hasBorder = false
    let hasShadow = false
    const suggestions: string[] = []

    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').toLowerCase()

    const checkTranslucent = (val: string): boolean => {
      const clean = val.toLowerCase()
      
      // Check rgba/hsla with opacity < 0.85
      const alphaMatch = clean.match(/(?:rgba|hsla)\([^)]*,\s*(0?\.\d+|0|100%|[0-9]+%)\)/)
      if (alphaMatch) {
        const alphaStr = alphaMatch[1]
        const alpha = alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr)
        if (alpha < 0.85) return true
      }
      
      // Check hex with alpha (8-digit hex or 4-digit hex)
      const hex8Match = clean.match(/#([0-9a-f]{6})([0-9a-f]{2})\b/)
      if (hex8Match) {
        const alphaHex = parseInt(hex8Match[2], 16)
        if (alphaHex < 220) return true // < 86% opacity
      }
      
      const hex4Match = clean.match(/#([0-9a-f]{3})([0-9a-f])\b/)
      if (hex4Match) {
        const alphaHex = parseInt(hex4Match[2], 16)
        if (alphaHex < 14) return true // < 87.5% opacity
      }
      
      if (clean.includes('transparent')) return true
      
      // Check if it has a gradient that contains translucent colors
      if (clean.includes('gradient')) {
        return /(?:rgba|hsla)\([^)]*,\s*(0?\.\d+|0|100%|[0-9]+%)\)/.test(clean) ||
               /transparent/.test(clean) ||
               /#([0-9a-f]{6})([0-9a-f]{2})\b/.test(clean) ||
               /#([0-9a-f]{3})([0-9a-f])\b/.test(clean)
      }
      
      return false
    }

    if (inputMode === 'css' || inputMode === 'styled') {
      // Background Check
      let hasBgProp = false
      let isTranslucent = false
      const bgMatches = cleanCode.match(/(?:background|background-color|background-image)\s*:\s*([^;]+)/gi)
      if (bgMatches) {
        hasBgProp = true
        isTranslucent = bgMatches.some(declaration => {
          const val = declaration.split(':')[1]
          if (!val) return false
          return checkTranslucent(val)
        })
      }
      hasBackground = hasBgProp && isTranslucent

      // Blur Check
      hasBlur = /backdrop-filter\s*:\s*[^;]*blur\s*\(/i.test(cleanCode) ||
                /-webkit-backdrop-filter\s*:\s*[^;]*blur\s*\(/i.test(cleanCode)

      // Border Check
      let hasBorderProp = false
      let isBorderTranslucent = false
      const borderMatches = cleanCode.match(/(?:border|border-color|border-top|border-bottom|border-left|border-right)\s*:\s*([^;]+)/gi)
      if (borderMatches) {
        hasBorderProp = true
        isBorderTranslucent = borderMatches.some(declaration => {
          const val = declaration.split(':')[1]
          if (!val) return false
          if (val.includes('none') || val.trim() === '0') return false
          return checkTranslucent(val)
        })
      }
      // If border is set via border-width and border-color separately
      const hasBorderWidth = /border-width\s*:\s*([^;]+)/gi.test(cleanCode)
      const hasBorderColor = /border-color\s*:\s*([^;]+)/gi.test(cleanCode)
      if (hasBorderWidth && hasBorderColor) {
        hasBorderProp = true
        const colorMatches = cleanCode.match(/border-color\s*:\s*([^;]+)/gi)
        if (colorMatches) {
          isBorderTranslucent = colorMatches.some(declaration => {
            const val = declaration.split(':')[1]
            if (!val) return false
            return checkTranslucent(val)
          })
        }
      }
      hasBorder = hasBorderProp && isBorderTranslucent

      // Shadow Check
      let hasShadowProp = false
      const shadowMatches = cleanCode.match(/box-shadow\s*:\s*([^;]+)/gi)
      if (shadowMatches) {
        hasShadowProp = shadowMatches.some(declaration => {
          const val = declaration.split(':')[1]?.trim()
          if (!val) return false
          return val !== 'none' && val !== '0' && val !== 'inherit' && val !== 'initial'
        })
      }
      hasShadow = hasShadowProp
    } else {
      const classes = code.split(/\s+/).filter(Boolean)
      
      hasBackground = classes.some(c => {
        if (!c.startsWith('bg-')) return false
        if (c.includes('/')) return true
        if (c.includes('-opacity-') || c.includes('transparent')) return true
        if (c.includes('[rgba') || c.includes('[hsla')) return true
        const hexMatch = c.match(/\[#([0-9a-f]{8})\]/i) || c.match(/\[#([0-9a-f]{4})\]/i)
        if (hexMatch) return true
        return false
      })

      hasBlur = classes.some(c => c.startsWith('backdrop-blur') && c !== 'backdrop-blur-none')

      const hasBorderClass = classes.some(c => c === 'border' || c.startsWith('border-') || c.startsWith('border-['))
      const hasOpaqueBorderColor = classes.some(c => 
        c.startsWith('border-') && 
        !c.includes('/') && 
        !c.includes('transparent') && 
        !c.includes('[rgba') && 
        !c.includes('[hsla') && 
        !/\[#([0-9a-f]{8})\]/i.test(c) && 
        !/\[#([0-9a-f]{4})\]/i.test(c) &&
        !/^(border-(?:[0-9]|t|b|l|r|x|y|s|e|solid|dashed|dotted|double|none|collapse|separate))$/.test(c)
      )
      hasBorder = hasBorderClass && !hasOpaqueBorderColor

      hasShadow = classes.some(c => c.startsWith('shadow') && c !== 'shadow-none')
    }

    let score = 0
    let bgScore = 0
    let blurScore = 0
    let borderScore = 0
    let shadowScore = 0

    if (hasBackground) {
      bgScore = 30
      score += bgScore
    } else {
      suggestions.push(
        inputMode === 'tailwind'
          ? "Apply background opacity to let underlying elements shine through (e.g., bg-white/10 or bg-black/20)."
          : "Add background translucency using rgba, hsla, or gradient overlays (e.g., background: rgba(255, 255, 255, 0.1);)."
      )
    }

    if (hasBlur) {
      blurScore = 40
      score += blurScore
    } else {
      suggestions.push(
        inputMode === 'tailwind'
          ? "Add backdrop blur class to create the frosted-glass effect (e.g., backdrop-blur-md or backdrop-blur-xl)."
          : "Add backdrop-filter blur declarations to create depth (e.g., backdrop-filter: blur(16px);)."
      )
    }

    if (hasBorder) {
      borderScore = 15
      score += borderScore
    } else {
      suggestions.push(
        inputMode === 'tailwind'
          ? "Highlight edges with a light translucent border (e.g., border border-white/10)."
          : "Add a thin semi-transparent border to establish clear card boundaries (e.g., border: 1px solid rgba(255, 255, 255, 0.1);)."
      )
    }

    if (hasShadow) {
      shadowScore = 15
      score += shadowScore
    } else {
      suggestions.push(
        inputMode === 'tailwind'
          ? "Cast a subtle ambient shadow to elevate the layer (e.g., shadow-xl or shadow-2xl)."
          : "Define a soft box-shadow declaration to lift the card visually (e.g., box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);)."
      )
    }

    let rating: 'pure' | 'standard' | 'partial' | 'none' = 'none'
    if (score >= 85) rating = 'pure'
    else if (score >= 70) rating = 'standard'
    else if (score >= 40) rating = 'partial'
    else rating = 'none'

    setTimeout(() => {
      setAnalysis({
        score,
        rating,
        hasBackground,
        backgroundScore: bgScore,
        hasBlur,
        blurScore: blurScore,
        hasBorder,
        borderScore: borderScore,
        hasShadow,
        shadowScore: shadowScore,
        suggestions
      })
    }, 0)
  }, [code, inputMode])

  // Real-time analysis trigger
  useEffect(() => {
    runAnalysis()
  }, [runAnalysis])

  const getPreviewStyle = (): React.CSSProperties => {
    if (inputMode === 'css') {
      return parseCssStringToStyles(code)
    } else if (inputMode === 'styled') {
      return parseStyledStringToStyles(code)
    }
    return {}
  }

  const getRatingDetails = () => {
    if (!analysis) return { label: 'Analyzing', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' }
    switch (analysis.rating) {
      case 'pure':
        return { 
          label: 'Premium Glassmorphism', 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10', 
          border: 'border-yellow-500/30',
          desc: 'Excellent implementation! Meets all frosted glass guidelines.'
        }
      case 'standard':
        return { 
          label: 'Standard Glassmorphism', 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/25',
          desc: 'Good glassmorphic effect. Apply border and shadow improvements for premium aesthetics.' 
        }
      case 'partial':
        return { 
          label: 'Partial Glassmorphism', 
          color: 'text-orange-400', 
          bg: 'bg-orange-500/10', 
          border: 'border-orange-500/25',
          desc: 'Basic transparency or blur is present. Combine blur and transparency together for the effect.' 
        }
      case 'none':
      default:
        return { 
          label: 'No Glassmorphism', 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/25',
          desc: 'Missing key glass elements (backdrop-blur or opacity background).' 
        }
    }
  }

  const ratingObj = getRatingDetails()

  if (loadingUser) {
    return (
      <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // Lockscreen override if trial period is active or user purchased it
  if (!isUnlocked) {
    return (
      <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col relative select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>
        <main className="max-w-4xl mx-auto px-6 py-24 relative z-10 w-full flex-1 flex flex-col items-center justify-center text-center space-y-8">
          
          <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/20 text-purple-400 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-lg">
            <span className="inline-flex items-center space-x-1 bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Trial Period Expired
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">Unlock Glass Analyzer</h2>
            <p className="text-sm text-white/55 leading-relaxed">
              The 180-day free introductory period for the UI Verifier Engine has ended. Purchase lifetime access below to continue testing custom CSS, Tailwind, or styled code templates.
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl pt-4 text-left">
            
            {/* Analyzer Single Unlock */}
            <div className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">Single Feature</span>
                  <h3 className="text-lg font-bold text-white">Glass Analyzer Lifetime</h3>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Get permanent lifetime access to copy, paste, analyze, and test custom CSS, Tailwind, and styled-components inside the verifier.
                </p>
                <div className="text-2xl font-black text-white">$9.99 <span className="text-xs text-white/40 font-normal">USD</span></div>
              </div>
              <button
                onClick={() => handlePurchase('glass-analyzer')}
                disabled={purchasingId !== null}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer mt-6 shadow-[0_4px_15px_rgba(168,85,247,0.2)] font-sans"
              >
                {purchasingId === 'glass-analyzer' ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlock Analyzer</span>
                  </>
                )}
              </button>
            </div>

            {/* Combined Mega Bundle */}
            <div className="bg-gradient-to-b from-purple-950/20 via-black to-black border border-purple-500/25 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 bg-purple-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow font-sans">
                Best Value Bundle
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400">All-Access Pass</span>
                  <h3 className="text-lg font-bold text-white">Ultimate Mega Bundle</h3>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Unlock everything! Access all current & future premium preset layouts, custom customizers, plus the complete Glass Analyzer verifier workspace.
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-white">$71.99</span>
                  <span className="text-xs text-white/30 line-through">$79.98</span>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold font-sans">Save 10%</span>
                </div>
              </div>
              <button
                onClick={() => handlePurchase('glass-mega-bundle')}
                disabled={purchasingId !== null}
                className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/70 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer mt-6 shadow-[0_4px_25px_rgba(255,255,255,0.15)] font-sans"
              >
                {purchasingId === 'glass-mega-bundle' ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>Get Mega Bundle</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {!user && (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs text-white/45 hover:text-white underline transition-colors cursor-pointer"
            >
              Already purchased? Connect wallet or sign in to restore.
            </button>
          )}

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

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col relative select-none">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

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

        {/* Free Introductory countdown header banner */}
        {isFreePeriodActive && (
          <div className="bg-gradient-to-r from-purple-950/40 via-black to-purple-950/40 border border-purple-500/25 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl">
            {/* Background elements */}
            <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex items-center space-x-3.5 z-10 text-left">
              <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5 fill-purple-500/25 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free For A Limited Time (Beta)</h4>
                <p className="text-[11px] text-white/50 leading-relaxed mt-0.5 max-w-lg">
                  The UI Verifier Engine is free to test during our 180-day introductory trial. Upgrade to the Ultimate Mega Bundle at any time to unlock permanent all-access.
                </p>
              </div>
            </div>
            
            {/* Live countdown widget */}
            <div className="flex items-center space-x-2 bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl z-10 font-mono text-xs">
              <span className="text-white/40 uppercase font-semibold text-[9px] tracking-wider mr-2">Trial Ends In:</span>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">{timeLeft.days}</span>
                <span className="text-[7px] text-white/30 uppercase mt-0.5">days</span>
              </div>
              <span className="text-white/30 font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[7px] text-white/30 uppercase mt-0.5">hrs</span>
              </div>
              <span className="text-white/30 font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[7px] text-white/30 uppercase mt-0.5">min</span>
              </div>
              <span className="text-white/30 font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[7px] text-white/30 uppercase mt-0.5">sec</span>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UI Verifier Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Glassmorphism Code Analyzer</h2>
            <p className="text-sm text-white/50 max-w-xl">
              Paste your custom CSS rules, Tailwind utility classes, or styled-components code blocks. Our analysis engine will check compliance and display your layout over dynamic backgrounds.
            </p>
          </div>

          {/* Quick Example Loaders */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button 
              onClick={() => loadExample('cssPremium')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium text-white/80"
            >
              CSS Premium Card
            </button>
            <button 
              onClick={() => loadExample('tailwindNeon')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium text-white/80"
            >
              Tailwind Neon
            </button>
            <button 
              onClick={() => loadExample('styledDefi')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium text-white/80"
            >
              Styled DeFi
            </button>
            <button 
              onClick={() => loadExample('nonGlass')}
              className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium text-red-300"
            >
              Non-Glass Card
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Code Editor */}
          <div className="lg:col-span-6 space-y-6 flex flex-col">
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between bg-black/40 border-b border-white/5 p-4">
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4 text-purple-400 mr-1.5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Code Input Syntax</span>
                </div>
                
                <div className="flex bg-black/50 border border-white/10 rounded-lg p-0.5 text-[10px]">
                  {(['css', 'tailwind', 'styled'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className={`px-3 py-1.5 rounded-md font-bold uppercase transition-all cursor-pointer ${
                        inputMode === mode
                          ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {mode === 'styled' ? 'Styled' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area Input */}
              {/* Text Area Input */}
              <div className="relative border-b border-white/5">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={
                    inputMode === 'css' 
                      ? 'background: rgba(255, 255, 255, 0.2);\nbackdrop-filter: blur(12px);'
                      : inputMode === 'tailwind'
                        ? 'bg-white/10 backdrop-blur-md border border-white/10 shadow-lg'
                        : 'const GlassDiv = styled.div`\n  background: rgba(255, 255, 255, 0.2);\n  backdrop-filter: blur(12px);\n`;'
                  }
                  className="w-full h-[150px] min-h-[100px] max-h-[500px] bg-transparent text-white/90 p-5 font-mono text-xs focus:outline-none resize-y overflow-y-auto leading-relaxed"
                />
              </div>

              {/* Footer controls */}
              <div className="flex items-center justify-between bg-black/40 px-4 py-3">
                <div className="flex items-center space-x-1.5 text-[10px] text-white/40 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Ready for verification</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCode('')}
                    className="px-3 py-1.5 bg-black/60 hover:bg-black/85 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-lg transition-all text-xs flex items-center space-x-1.5 cursor-pointer font-sans"
                    title="Clear editor"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-1.5 bg-white text-black hover:bg-white/90 rounded-lg font-bold transition-all text-xs flex items-center space-x-1.5 cursor-pointer shadow-md font-sans"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live compliance metrics */}
            {analysis && (
              <div className="bg-[#111]/30 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/65 flex items-center">
                  <Sliders className="w-4 h-4 text-purple-400 mr-2" />
                  <span>Compliance Metric Weights</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    analysis.hasBlur ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' : 'bg-red-950/10 border-red-500/10 text-white/40'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wide">Backdrop Blur</span>
                    <span className="text-xl font-bold mt-1.5">{analysis.blurScore} <span className="text-[10px] font-normal text-white/30">/ 40</span></span>
                  </div>

                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    analysis.hasBackground ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' : 'bg-red-950/10 border-red-500/10 text-white/40'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wide">Translucency</span>
                    <span className="text-xl font-bold mt-1.5">{analysis.backgroundScore} <span className="text-[10px] font-normal text-white/30">/ 30</span></span>
                  </div>

                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    analysis.hasBorder ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' : 'bg-red-950/10 border-red-500/10 text-white/40'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wide">Frosted Edge</span>
                    <span className="text-xl font-bold mt-1.5">{analysis.borderScore} <span className="text-[10px] font-normal text-white/30">/ 15</span></span>
                  </div>

                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    analysis.hasShadow ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' : 'bg-red-950/10 border-red-500/10 text-white/40'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wide">Depth Shadow</span>
                    <span className="text-xl font-bold mt-1.5">{analysis.shadowScore} <span className="text-[10px] font-normal text-white/30">/ 15</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Preview & Report */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual Canvas Box */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between bg-black/40 border-b border-white/5 p-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-purple-400 mr-1.5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Interactive Preview Canvas</span>
                </div>
                
                {/* Background Selector */}
                <div className="flex space-x-1.5">
                  {(['aurora', 'sunset', 'ocean', 'cyberpunk'] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setCanvasBg(bg)}
                      className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                        canvasBg === bg ? 'border-white scale-110 shadow-md' : 'border-transparent scale-100 hover:scale-105'
                      } ${
                        bg === 'aurora' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                        bg === 'sunset' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                        bg === 'ocean' ? 'bg-gradient-to-r from-teal-500 to-emerald-500' :
                        'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      title={`Switch to ${bg} background`}
                    />
                  ))}
                </div>
              </div>

              {/* Rendering Canvas area */}
              <div className="aspect-[1.5] relative overflow-hidden bg-[#121212] flex items-center justify-center p-8">
                {/* Glowing background circles based on selected background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {canvasBg === 'aurora' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/35 to-blue-500/35 rounded-full blur-[80px]"></div>
                  )}
                  {canvasBg === 'sunset' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-full blur-[80px]"></div>
                  )}
                  {canvasBg === 'ocean' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/30 to-emerald-500/30 rounded-full blur-[80px]"></div>
                  )}
                  {canvasBg === 'cyberpunk' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-[80px]"></div>
                  )}
                </div>

                {/* Main rendered panel with user classes / styles */}
                <div
                  style={inputMode !== 'tailwind' ? getPreviewStyle() : undefined}
                  className={`w-full max-w-sm aspect-[1.6] p-6 relative flex flex-col justify-between transition-all duration-300 z-10 ${
                    inputMode === 'tailwind' ? code : ''
                  }`}
                >
                  {/* Subtle inner grid lines inside preview to demonstrate transparency */}
                  <div className="absolute inset-0 bg-transparent rounded-2xl pointer-events-none border border-transparent z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[7px] font-mono uppercase tracking-widest text-white/40 font-bold flex items-center">
                        <Sparkles className="w-2.5 h-2.5 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>Analyzer Live</span>
                      </span>
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">Glass Preview</span>
                    </div>
                    <div className="w-9 h-6 bg-gradient-to-tr from-white/10 via-white/25 to-white/5 border border-white/20 rounded-md shadow flex items-center justify-center text-[7px] text-white/70 font-mono">
                      HUD
                    </div>
                  </div>

                  <div className="text-sm font-mono tracking-widest text-white/95 my-3 z-10 drop-shadow-md text-center">
                    YOUR  CUSTOM  STYLE  APPLIED
                  </div>

                  <div className="flex justify-between items-end z-10">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[6px] font-mono uppercase tracking-wider text-white/45 block">Verified</span>
                      <span className="text-[8px] font-semibold text-white/90 uppercase">{ratingObj.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[6px] font-mono uppercase tracking-wider text-white/45 block">Design Score</span>
                      <span className="text-[8px] font-bold text-white/90 font-mono">{analysis?.score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score & Evaluation Report */}
            {analysis && (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-3">
                    {/* Radial score gauge */}
                    <div className="relative w-14 h-14 flex items-center justify-center bg-black/40 border border-white/10 rounded-full">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-white/5"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className={`transition-all duration-500 ${
                            analysis.score >= 85 ? 'stroke-yellow-400' :
                            analysis.score >= 70 ? 'stroke-emerald-400' :
                            analysis.score >= 40 ? 'stroke-orange-400' : 'stroke-red-400'
                          }`}
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - analysis.score / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-black">{analysis.score}%</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${ratingObj.bg} ${ratingObj.border} ${ratingObj.color}`}>
                          {ratingObj.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{ratingObj.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Suggestions / Checklist */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Verification Checklist</h3>
                  <div className="space-y-3">
                    
                    {/* Check item 1: Backdrop blur */}
                    <div className="flex items-start justify-between text-xs p-3 bg-black/30 border border-white/5 rounded-xl">
                      <div className="flex space-x-3 items-start">
                        {analysis.hasBlur ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white/90">Backdrop Blur Diffusion</p>
                          <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                            Backdrop filtering diffuses objects behind the element, separating card layouts visually.
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] font-bold ${analysis.hasBlur ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.hasBlur ? 'PASSED' : 'REQUIRED'}
                      </span>
                    </div>

                    {/* Check item 2: Translucent background */}
                    <div className="flex items-start justify-between text-xs p-3 bg-black/30 border border-white/5 rounded-xl">
                      <div className="flex space-x-3 items-start">
                        {analysis.hasBackground ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white/90">Translucent Fill Opacity</p>
                          <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                            Background transparency levels must reside below 100% to permit visual pass-through.
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] font-bold ${analysis.hasBackground ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.hasBackground ? 'PASSED' : 'REQUIRED'}
                      </span>
                    </div>

                    {/* Check item 3: Highlight border */}
                    <div className="flex items-start justify-between text-xs p-3 bg-black/30 border border-white/5 rounded-xl">
                      <div className="flex space-x-3 items-start">
                        {analysis.hasBorder ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white/90">Frosted Glass Outline Edge</p>
                          <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                            Thin outline mimics refraction points on glass edges, defining separation.
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] font-bold ${analysis.hasBorder ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {analysis.hasBorder ? 'PASSED' : 'RECOMMENDED'}
                      </span>
                    </div>

                    {/* Check item 4: Box shadow */}
                    <div className="flex items-start justify-between text-xs p-3 bg-black/30 border border-white/5 rounded-xl">
                      <div className="flex space-x-3 items-start">
                        {analysis.hasShadow ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white/90">Visual Depth Shadow</p>
                          <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                            Shadow contours define a 3D layered elevation hierarchy against flat canvases.
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] font-bold ${analysis.hasShadow ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {analysis.hasShadow ? 'PASSED' : 'RECOMMENDED'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Optimizations suggestion list */}
                {analysis.suggestions.length > 0 && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center">
                      <HelpCircle className="w-4 h-4 mr-1.5 shrink-0" />
                      <span>Optimization Suggestions</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {analysis.suggestions.map((sug, idx) => (
                        <li key={idx} className="text-[11px] text-white/70 leading-relaxed flex items-start space-x-2">
                          <span className="text-yellow-400 mt-0.5 shrink-0">▸</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
              </div>
            )}
          </div>

        </div>

        {/* Life-time pass banner promo */}
        <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto w-full text-center relative overflow-hidden mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-bold">Unsure about your glass design?</h3>
            <p className="text-xs text-white/55 leading-relaxed">
              Open any pre-analyzed template in our dynamic engine. Customize dimensions, border opacity, tint channels, and blur levels inside the playground.
            </p>
            <Link 
              href="/generator" 
              className="inline-flex items-center space-x-1 px-5 py-2.5 bg-white hover:bg-white/90 text-black text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              <span>Launch Design Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
      
      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={fetchUserAndPurchases}
      />
    </div>
  )
}
