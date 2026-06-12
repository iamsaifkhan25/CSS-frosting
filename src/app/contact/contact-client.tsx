'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle2, MessageSquare, Bug, LifeBuoy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ContactClient() {
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
          pageSource: 'Contact Us Page',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message. Please try again.')
      }

      setSubmitStatus({
        type: 'success',
        message: data.message || 'Message sent successfully! It has been forwarded to your inbox.',
      })
      setFormData({ name: '', email: '', message: '' })
    } catch (err: any) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center">
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-600/10 to-pink-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/10 to-blue-500/10 blur-[150px] animation-delay-2000 animate-pulse"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col space-y-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-white/50 hover:text-white transition-colors duration-200 w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-white/55 max-w-xl">
            Have questions about CSS Frosting custom components, need help with Open Study Deck integrations, or want to report a rendering bug? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left Side: Contact Form Card */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span>Send Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-white/50">Message Body</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Describe your inquiry, bug details, or suggestion..."
                  className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-purple-400/50 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none transition-all duration-300 resize-none"
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
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Channels Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <MessageSquare className="w-4.5 h-4.5 text-purple-400" />
                <span>Primary Channel</span>
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                For prompt replies, email our primary inbox directly. We check messages on a daily basis and offer layout integration help.
              </p>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-xs">
                <span className="text-white/40 block font-mono text-[9px] uppercase tracking-wider mb-0.5">Zoho Mail Inbox</span>
                <a href="mailto:harukiwaves@zohomail.in" className="text-purple-400 hover:text-purple-300 font-semibold underline break-all">
                  harukiwaves@zohomail.in
                </a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Bug className="w-4.5 h-4.5 text-pink-400" />
                <span>Bug & Feature Reports</span>
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                If you encounter visual styling failures in specific browser compositions (such as older Safari, Mobile WebKit, or Firefox flags), please specify:
              </p>
              <ul className="list-disc pl-4 text-xs text-white/55 space-y-1">
                <li>Your browser version and OS platform.</li>
                <li>The exact CSS configuration attributes or preset name.</li>
                <li>A screenshot or description of the layout displacement.</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <LifeBuoy className="w-4.5 h-4.5 text-cyan-400" />
                <span>Open Study Deck Support</span>
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                If you require assistance configuring your local Gemini API key, parsing handwritten notes, or exporting PNG flashcards, our support covers Open Study Deck services as well.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
