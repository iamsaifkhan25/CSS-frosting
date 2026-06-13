'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#080808]/40 backdrop-blur-xl relative z-10 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-3 group w-fit">
            <div className="relative flex items-center justify-center bg-white/5 group-hover:bg-white/10 w-9 h-9 rounded-lg border border-white/15 group-hover:border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
              <Layers className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wider text-white uppercase flex items-center">
                CSS Frosting
                <span className="mx-2 text-white/30 font-normal">|</span>
                <span className="text-white/60 font-medium lowercase text-xs tracking-normal">v2.0</span>
              </h2>
            </div>
          </Link>
          <p className="text-xs text-white/45 max-w-sm leading-relaxed">
            Create premium, GPU-accelerated glassmorphic layouts and CSS opacity compositions natively. Built for frontend engineers and design system teams.
          </p>
        </div>

        {/* Links Column - Product */}
        <div className="md:col-span-3 flex flex-col space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">Workspace</h3>
          <nav className="flex flex-col space-y-2 text-xs">
            <Link href="/generator" className="text-white/60 hover:text-white transition-colors duration-200">
              Frosting Canvas
            </Link>
            <Link href="/presets" className="text-white/60 hover:text-white transition-colors duration-200">
              Premium Presets
            </Link>
            <Link href="/analyzer" className="text-white/60 hover:text-white transition-colors duration-200">
              Glass Analyzer
            </Link>
            <Link href="/docs" className="text-white/60 hover:text-white transition-colors duration-200">
              Developer Docs
            </Link>
          </nav>
        </div>

        {/* Links Column - Support & Mission */}
        <div className="md:col-span-2 flex flex-col space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">Company</h3>
          <nav className="flex flex-col space-y-2 text-xs">
            <Link href="/about" className="text-white/60 hover:text-white transition-colors duration-200">
              About Us
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors duration-200">
              Contact Us
            </Link>
            <Link href="/projects" className="text-white/60 hover:text-white transition-colors duration-200">
              Other Projects
            </Link>
          </nav>
        </div>

        {/* Links Column - Legal */}
        <div className="md:col-span-2 flex flex-col space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">Legal</h3>
          <nav className="flex flex-col space-y-2 text-xs">
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-200">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-white/30 tracking-wider font-semibold uppercase">
          © {new Date().getFullYear()} CSS Frosting • Built for visual builders
        </span>
        <span className="text-[10px] text-white/20 font-medium">
          Feedback routed to <a href="mailto:harukiwaves@zohomail.in" className="hover:text-white/40 transition-colors underline">harukiwaves@zohomail.in</a>
        </span>
      </div>
    </footer>
  )
}
