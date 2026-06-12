'use client'

import { ArrowUpRight, Sparkles, BookOpen, Layers, Lock, ShieldCheck, Cpu, Download } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ProjectsClient() {
  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center">
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-600/10 to-pink-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-500/10 blur-[150px] animation-delay-2000 animate-pulse"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md shadow-sm">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer Network Products</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Other Projects
          </h2>
          <p className="text-sm md:text-base text-white/55 leading-relaxed">
            Discover other high-performance visual studios built by our development team. We create tools designed to run directly in the client, keeping you in charge of your workspace.
          </p>
        </div>

        {/* Project Showcase Container */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* PROJECT CARD: OPEN STUDY DECK */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all duration-500">
            {/* Left Side: Product Branding & CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider font-mono">
                  <span>Privacy-First Study Studio</span>
                </div>
                <h3 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
                  Open Study Deck
                </h3>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  A client-side study card workspace designed for university students, researchers, and self-learners dealing with high study volumes. It lets you bypass SaaS subscriptions by using your own Google Gemini API key.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://openstudydeck.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-white/90 text-black font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
                >
                  <span>Launch Workstation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Side: Features List Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature 1: Image Flashcards */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Flashcards from Image</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Drag & drop visual slides or textbook screenshots to instantly convert picture notes into active-recall study decks.
                </p>
              </div>

              {/* Feature 2: Screenshot Summarizer */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-pink-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Textbook Summarizer AI</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Extract outline summaries, bullet notes, or simplified explanations (ELI5) from complex paragraphs.
                </p>
              </div>

              {/* Feature 3: BYOK Architecture */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bring Your Own Key</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Avoid subscription caps. Connect a free Google Gemini key directly to run client-side AI instructions.
                </p>
              </div>

              {/* Feature 4: Local sovereignty */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Analytical Databases</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  No login credentials, trackers, or centralized database uploads. All notes stay strictly cached in local storage.
                </p>
              </div>
            </div>
          </div>

          {/* PROJECT CARD: CSS FROSTING (Context wrapper) */}
          <div className="bg-white/5 border border-white/15 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-75">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>CSS Frosting</span>
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                You are currently browsing our flagship styling builder. It provides developers with high-performance frosted glass rendering coordinates, multi-variant design toggle templates, and utility styling generation.
              </p>
            </div>
            <Link
              href="/"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-colors duration-200 shrink-0"
            >
              Return to Canvas
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
