import type { Metadata } from 'next'
import { Shield, Lock, EyeOff, ServerCrash, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Privacy Policy | CSS Frosting Privacy Standards",
  description: "Review the privacy policy for CSS Frosting. Learn how we handle your data, our client-side storage architecture, and our commitment to zero analytical tracking.",
  alternates: {
    canonical: 'https://cssfrosting.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center">
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-purple-600/5 to-pink-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-cyan-600/5 to-blue-500/5 blur-[150px]"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col space-y-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-white/50 hover:text-white transition-colors duration-200 w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <Lock className="w-6 h-6 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Local-First Storage</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              All gradient, blur, and opacity styling inputs are processed natively on your device. We do not inspect your client state.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <EyeOff className="w-6 h-6 text-pink-400" />
            <h3 className="text-sm font-bold text-white">Zero Trackers</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              We do not inject third-party ad networks, marketing cookies, or tracking beacons that profile your web activities.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Secure Preset Syncing</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              Preset libraries are synced using encrypted database structures via Supabase authentication. You control your stored history.
            </p>
          </div>
        </div>

        {/* Detailed Document */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 space-y-8 text-xs md:text-sm text-white/70 leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Principles of Data Handling</h2>
            <p>
              CSS Frosting operates under a strict principle of minimal data ingestion. We believe that developer utilities should behave as pure calculations. When you adjust sliders, color pickers, shadows, and backdrop-filters, the processing occurs 100% inside your web browser. The configurations are stored temporarily in your local browser storage memory (`localStorage`) so that you do not lose progress if your page refreshes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Authentication and Saved Presets</h2>
            <p>
              To offer modular preset saving and account synchronization, we leverage Supabase authentication. If you choose to connect your account or sign in:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We request and store only basic email metadata provided by your connection method.</li>
              <li>Your saved glassmorphism presets, color layouts, and CSS configuration trees are saved in a secure, encrypted relational database row owned by your verified account.</li>
              <li>No analytical analysis is performed on your configurations. You can delete individual presets or your entire account records at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Third-Party Integrations</h2>
            <p>
              We integrate third-party developer APIs strictly to provide standard transaction layers and database services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase:</strong> For identity verification, session persistence, and secure remote database storage.</li>
              <li><strong>Stripe & Razorpay:</strong> For premium layout access upgrades. All transaction cards, billing numbers, and tokens are encrypted on the client side and sent directly to these payment gateways. We never view, transmit, or store your payment details on our servers.</li>
              <li><strong>Open Study Deck Integration:</strong> If you navigate to our partner app, Open Study Deck, the tool operates under a Bring Your Own Key (BYOK) model. Your Google Gemini API keys are kept locally in your browser storage and are never uploaded to any remote system.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Cookies and Analytical Tracking</h2>
            <p>
              We do not set cookies for advertising, marketing, or behavior analysis. We use basic local cookies strictly necessary to maintain your login session. This ensures that you can adjust canvas variables in complete privacy, without our system building search or usage profiles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
            <p>
              If you have any questions about this privacy statement, data erasure requests, or security protocols, you can reach the engineering team at <a href="mailto:harukiwaves@zohomail.in" className="text-purple-400 hover:text-purple-300 font-semibold underline">harukiwaves@zohomail.in</a>. All requests are processed within 48 business hours.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
