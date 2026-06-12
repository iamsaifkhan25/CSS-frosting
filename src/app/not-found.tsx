'use client'

import Link from 'next/link'
import { FileQuestion, Paintbrush, Home, LayoutGrid } from 'lucide-react'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center justify-between min-h-screen">
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-600/10 to-pink-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-500/10 blur-[150px] animation-delay-2000 animate-pulse"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Glass Card Icon */}
        <div className="relative flex items-center justify-center bg-white/5 w-20 h-20 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-xl animate-bounce">
          <FileQuestion className="w-10 h-10 text-purple-400" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            404
          </h1>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Layer Evaporated
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
            The frosted glass panel or component path you are searching for does not exist or has been shifted in our design system.
          </p>
        </div>

        {/* Action Options */}
        <div className="w-full flex flex-col space-y-2 pt-2">
          <Link
            href="/generator"
            className="w-full bg-white hover:bg-white/90 text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95"
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Frosting Canvas</span>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors duration-200"
            >
              <Home className="w-3.5 h-3.5 text-white/60" />
              <span>Home</span>
            </Link>
            <Link
              href="/presets"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors duration-200"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-white/60" />
              <span>Presets</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
