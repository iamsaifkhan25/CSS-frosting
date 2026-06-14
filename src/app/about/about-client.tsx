'use client'

import { useState } from 'react'
import { Sparkles, Mail, Send, CheckCircle2, ShieldCheck, HelpCircle, Layers, Paintbrush, Code } from 'lucide-react'
import Footer from '@/components/Footer'

export default function AboutClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pageSource: 'About Us Page (CSS Frosting Focus)',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback. Please try again.')
      }

      setSubmitStatus({
        type: 'success',
        message: data.message || 'Feedback submitted successfully! It has been routed to your inbox.',
      })
      setFormData({ name: '', email: '', message: '' })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setSubmitStatus({
        type: 'error',
        message: errMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-600/10 to-pink-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-500/10 blur-[150px] animation-delay-2000 animate-pulse"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span>Visual Design Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">CSS Frosting</span>
          </h2>
          <p className="text-sm md:text-base text-white/55 leading-relaxed">
            Developing premium visual interfaces shouldn&apos;t require manual CSS calculations. We build clean, high-conversion visual editors to put design control back in your hands.
          </p>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: The Story */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mission Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>The Mission: High-Fidelity UI Styling</span>
              </h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                Most web styling generators are extremely basic. They restrict your preview canvas to a single static rectangle, forcing you to guess how a style will render on real components. They lack support for multi-layer shadows, sub-pixel lighting borders, and modern utility frameworks.
              </p>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                We built <strong>CSS Frosting</strong> to bridge the gap between simple style sandboxes and production-ready code. Our workspace features an interactive multi-component design playground. Developers can instantly test frosted glass looks on mock application windows, pricing grids, credit cards, and navigation bars.
              </p>
            </div>

            {/* Core Values Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-pink-400" />
                <span>Local-First & Data Sovereign</span>
              </h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                We believe that utility web applications should act strictly as local calculators. Your visual coordinates, color palettes, shadow offsets, and canvas presets remain on your local system. 
              </p>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                There are no invasive analytics trackers, no account walls for core features, and no database synchronization loops unless you choose to create a secure account. When you connect, your presets are saved securely using Supabase client authorization, putting you in absolute control of your digital workspace assets.
              </p>
            </div>

            {/* Key Engine Features */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Key Platform Capabilities</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                  <Paintbrush className="w-5 h-5 text-purple-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Interactive Canvas</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Adjust backdrop filters, saturation scales, border specs, and multiple shadow layers concurrently.
                  </p>
                </div>
                <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                  <Code className="w-5 h-5 text-pink-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Dual Code Exporter</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Export clean vanilla CSS rules or copy responsive Tailwind CSS v4 custom class utility combinations.
                  </p>
                </div>
                <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                  <Sparkles className="w-5 h-5 text-cyan-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Premium Layouts</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Unlock responsive, hand-crafted preset layouts designed specifically for modern full-stack dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Contact / Feedback Form */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sticky top-24">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>Send Us Feedback</span>
                </h3>
                <p className="text-xs text-white/55 leading-relaxed">
                  Have ideas, custom preset requests, or engine feedback? Fill out the form below. Your message will be delivered directly to the developers at <span className="text-purple-400 font-semibold">harukiwaves@zohomail.in</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Your Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Share your thoughts, suggestions, or issues..."
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`flex items-start space-x-2 p-3.5 rounded-xl border text-xs leading-relaxed ${
                      submitStatus.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                    }`}
                  >
                    {submitStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-white/90 text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>

              <div className="border-t border-white/10 pt-4 text-center">
                <span className="text-[10px] text-white/40">
                  Direct contact: <a href="mailto:harukiwaves@zohomail.in" className="text-white/60 hover:text-white underline">harukiwaves@zohomail.in</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
