import type { Metadata } from 'next'
import { FileText, Award, AlertTriangle, ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Terms & Conditions | CSS Frosting Terms of Service",
  description: "Read the Terms & Conditions of CSS Frosting. Understand the license for generated styling outputs, payment policies, and developer agreements.",
  alternates: {
    canonical: 'https://cssfrosting.com/terms',
  },
}

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Royalty-Free Output</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              All styles, code snippets, and custom variables generated are 100% royalty-free for personal or commercial code projects.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <AlertTriangle className="w-6 h-6 text-pink-400" />
            <h3 className="text-sm font-bold text-white">Disclaimer of Warranty</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              The layout and css styling editor is provided "as is", without warranty of any kind, express or implied.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">BYOK Responsibility</h3>
            <p className="text-[11px] text-white/55 leading-relaxed">
              When using the Bring-Your-Own-Key tools (like Open Study Deck), you are fully responsible for your own Gemini API keys.
            </p>
          </div>
        </div>

        {/* Terms Document */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 space-y-8 text-xs md:text-sm text-white/70 leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Service Scope and Acceptance</h2>
            <p>
              By accessing and utilizing the visual styling engine at CSS Frosting or the visual study tools at Open Study Deck, you accept and agree to comply with these Terms and Conditions. Our platform is a developer-centric layout workspace that formats custom style classes (vanilla CSS, Tailwind CSS, or Styled-Components) in real time. If you do not agree, you must terminate usage immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Code Generation License</h2>
            <p>
              We grant you a non-exclusive, worldwide, royalty-free, perpetual license to copy, edit, distribute, and compile any CSS rules, Tailwind utility strings, or SVG code structures produced by our styling editor. You are free to drop this generated code directly into production projects, proprietary software applications, open-source packages, or commercial websites. No attribution to CSS Frosting is required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. API Integration and Key Compliance (BYOK)</h2>
            <p>
              If you utilize our partner study workspace (Open Study Deck) using your own Google Gemini API keys:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You agree that the API key belongs to you and complies with Google's Developer Terms.</li>
              <li>You are solely responsible for all API quotas, rate limiting, and pricing structures incurred directly with Google Cloud.</li>
              <li>We hold no liability for API keys that are deprecated, throttled, or disabled by the model provider.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Payment Policy and Presets Upgrades</h2>
            <p>
              Access to standard features of the generator, default card presets, and custom CSS exports is completely free. We offer premium preset bundles for a one-time purchase fee, processed through Stripe or Razorpay. These purchases grant you permanent access to high-fidelity dashboard blocks, pricing grids, and visual cards. Because of the immediate delivery of digital assets, all upgrade sales are final and non-refundable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
            <p>
              In no event shall the developers, contributors, or open-source maintainers of CSS Frosting or Open Study Deck be liable for any direct, indirect, incidental, or consequential damages (including, but not limited to, browser layout failure, data leakage, API rate suspensions, or payment discrepancies) arising in any way out of the use of this software, even if advised of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Updates and Contact</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the site after changes are posted constitutes acceptance of the new terms. For clarifications regarding licensing, commercial distribution, or platform terms, contact us at <a href="mailto:harukiwaves@zohomail.in" className="text-purple-400 hover:text-purple-300 font-semibold underline">harukiwaves@zohomail.in</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
