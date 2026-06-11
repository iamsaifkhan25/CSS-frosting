'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Paintbrush, LayoutGrid, Sparkles, Code, Zap, ChevronRight } from 'lucide-react'

export default function Home() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Calculate relative mouse position (from center of the card)
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Normalize coordinates (values between -1 and 1)
    const normalizedX = x / (rect.width / 2)
    const normalizedY = y / (rect.height / 2)

    setCoords({ x: normalizedX, y: normalizedY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCoords({ x: 0, y: 0 })
  }

  // Calculate tilt transform
  const rotateX = isHovered ? -coords.y * 20 : 0
  const rotateY = isHovered ? coords.x * 20 : 0
  const glowX = isHovered ? (coords.x + 1) * 50 : 50
  const glowY = isHovered ? (coords.y + 1) * 50 : 50

  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col items-center justify-between select-none">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-600/15 to-pink-500/15 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/15 to-blue-500/15 blur-[150px] animation-delay-2000 animate-pulse"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30vw] h-[30vw] rounded-full bg-yellow-500/5 blur-[100px]"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl px-6 pt-20 pb-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold text-white/80 w-fit backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Modern Web Styling Engine</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Create Premium <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.15)]">
              Glassmorphic
            </span> UI
          </h2>

          <p className="text-sm md:text-base text-white/55 leading-relaxed max-w-xl">
            Designing translucent, frosted-glass components shouldn't require guess work. Adjust parameters in real-time, inspect layouts, and export CSS or Tailwind codes instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/generator"
              className="bg-white hover:bg-white/90 text-black font-bold px-7 py-3.5 rounded-full text-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.3)] active:scale-95"
            >
              <Paintbrush className="w-4 h-4" />
              <span>Launch Frosting Canvas</span>
            </Link>

            <Link
              href="/presets"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-xs transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-md active:scale-95"
            >
              <LayoutGrid className="w-4 h-4 text-white/80" />
              <span>Explore Premium Layouts</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5 max-w-md">
            <div>
              <p className="text-xl md:text-2xl font-bold text-white">100%</p>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Dynamic CSS</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-white">CSS / TW</p>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Dual Export</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-white">4+</p>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Presets</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Tilt Card Demo */}
        <div className="lg:col-span-5 flex items-center justify-center perspective-[1000px]">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className="w-80 md:w-96 aspect-[1.6] rounded-2xl relative p-6 cursor-pointer border shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 flex flex-col justify-between"
          >
            {/* Real-time Glass Styling applied to Card */}
            <div 
              className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-[16px] border border-white/15 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
              }}
            ></div>

            {/* Glowing Mouse Tracker Overlay inside the glass */}
            <div
              style={{
                background: `radial-gradient(120px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.18), transparent 80%)`,
                transition: isHovered ? 'none' : 'background 0.5s ease',
              }}
              className="absolute inset-0 pointer-events-none rounded-2xl z-0"
            ></div>

            {/* Card Content Header */}
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/45 font-semibold">CSS Frosting</span>
                <span className="text-xs font-semibold text-white/80">Interactive Demo Card</span>
              </div>
              <div className="w-9 h-6 bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 rounded-md shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Card Content Middle (Hover Notice) */}
            <div className="my-2 z-10">
              <p className="text-xs font-mono tracking-wider text-white/50">MOVE MOUSE TO TILT ME</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  X: {coords.x.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Y: {coords.y.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Card Content Footer */}
            <div className="flex justify-between items-end z-10">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-white/35 block">User Interface</span>
                <span className="text-[11px] font-medium text-white/70 uppercase">Interactive Glass</span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[8px] font-mono uppercase tracking-wider text-white/35 block">Format</span>
                <span className="text-[11px] font-medium text-white/70 font-mono">3D RENDERED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix Section */}
      <section className="w-full bg-[#080808] border-t border-white/10 relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Built for Visual Excellence
            </h3>
            <p className="text-xs md:text-sm text-white/50 max-w-xl mx-auto">
              Everything you need to customize, test, and extract professional glassmorphic UI components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300">
              <div className="bg-purple-500/10 border border-purple-500/25 text-purple-400 p-3 rounded-xl w-fit">
                <Paintbrush className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Adjustable Canvas Controls</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Tune backdrop blur, tint opacity, border widths, shadow ranges, and solid tones. Modify precise slider values or type exact settings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300">
              <div className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 p-3 rounded-xl w-fit">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">CSS, Tailwind & Styled Dual Exports</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Export clean static CSS declarations, inline React stylings, Tailwind custom style definitions, or Styled-Components. One-click copy utility.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300">
              <div className="bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 p-3 rounded-xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Premium Preset Store</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Unlock advanced layouts incorporating multi-glow details, gradient masking, custom charts, and wallet authentication presets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-[10px] text-white/30 tracking-wider font-semibold uppercase relative z-10 px-6">
        <span>© 2026 CSS Frosting. Created by Advanced AI Pair Programmers.</span>
      </footer>
    </div>
  )
}
