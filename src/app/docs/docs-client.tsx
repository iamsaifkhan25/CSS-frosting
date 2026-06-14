'use client'

import { useState } from 'react'
import { Sparkles, Info, AlertTriangle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Docs() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyCode = (sectionId: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSection(sectionId)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const cssTemplate = `.glass-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}`

  const tailwindTemplate = `// Custom Tailwind v4 Glass utility definition
<div className="bg-white/15 backdrop-blur-md backdrop-saturate-120 border border-white/20 shadow-2xl rounded-xl">
  ...
</div>`

  const styledComponentsTemplate = `import styled from 'styled-components';

export const GlassBox = styled.div\`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border-radius: 12px;
\`;`

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "What makes this glassmorphism generator different from basic alternatives like CSS.glass?",
      a: "Unlike basic platforms such as CSS.glass which restrict your preview canvas to a single static rectangle, our workspace features an interactive multi-component design playground. Developers can instantly toggle their layouts to preview how frosted styling renders on dynamic dashboard sidebars, layered credit card grids, mock application windows, and responsive checkout components. Additionally, this utility lets you inspect multi-layer lighting variables and border highlight specular maps in real-time. By supporting dynamic DOM injection and multi-variant component canvas views, it bridges the gap between basic visual sandboxes and complex production-ready interfaces."
    },
    {
      q: "Why is my backdrop-filter blur effect not rendering properly in Mozilla Firefox or older mobile browsers?",
      a: "The backdrop-filter property is dependent on modern GPU rendering pipelines, which are disabled by default in certain browsers. In Mozilla Firefox, you must manually enable the feature flag by navigating to about:config and toggling layout.css.backdrop-filter.enabled to true. Furthermore, older WebKit-based browsers like Safari and iOS Chrome require the legacy -webkit-backdrop-filter vendor prefix to trigger composition layering. To guarantee a high-quality user experience across all devices, we recommend implementing a solid or semi-transparent fallback background-color style ruleset inside a feature query block using CSS @supports declarations."
    },
    {
      q: "Can I export these translucent styling layouts directly into modern utility frameworks like Tailwind CSS, React, or Styled-Components?",
      a: "Yes, our translucent element code exporter provides complete multi-framework export compatibility. With a single click, you can extract clean vanilla CSS sheets, inline React style objects, modular Styled-Components wrapper templates, or Tailwind CSS v4 custom class utility combinations. The generator automatically resolves alpha color variables and formats standard shadows into framework-compliant syntax. This ensures frontend developers can drop the exported properties directly into production configurations without requiring manual syntax translation or style refactoring."
    },
    {
      q: "How does the glassmorphic rendering engine affect web application performance and page rendering speeds?",
      a: "Using the CSS backdrop-filter property forces the browser to create a new graphics composition layer, offloading filter calculations to the hardware-accelerated GPU. While this provides exceptionally smooth rendering, applying large blurs to multiple overlapping DOM elements can degrade layout performance and cause frame rate drops, especially on mobile devices. To optimize rendering efficiency, we recommend limiting the number of active blurred panels on a single viewport and applying will-change: transform to promote elements to their own compositing layers. This approach minimizes paint operations and prevents sluggish page scrolls."
    },
    {
      q: "How safe and secure is the payment gateway for upgrading to premium preset templates?",
      a: "Our payment processing infrastructure is built to guarantee the highest level of security for transactions. We integrate directly with industry-leading, PCI-DSS Level 1 compliant payment gateways, including Stripe and Razorpay, to process all premium upgrades. Your credit card credentials and sensitive payment data are encrypted on the client-side and never touch or store on our application servers. All checkout sessions employ 3D Secure verification protocols and end-to-end tokenization to prevent unauthorized transactions. This architecture ensures developers and companies can purchase premium assets with complete trust and security."
    },
    {
      q: "Are the premium UI component templates purchased from this platform covered under a commercial usage license?",
      a: "Yes, all UI component presets and layouts exported from our platform include a comprehensive commercial usage license. This lifetime, royalty-free license grants you full permission to utilize, modify, and distribute the styling codes in personal, freelance, and corporate client production environments. There are no restrictions on the number of client sites you can deploy or the commercial revenue generated by apps using these elements. However, reselling our templates as standalone visual assets or repackaging them in competing UI libraries is strictly prohibited."
    },
    {
      q: "Do I need to create an account or sign in to use the core configuration utilities?",
      a: "Creating an account is entirely optional, as the core configuration sliders and vanilla CSS code exporters are 100% free and open to all visitors without any registration wall. We prioritize friction-free developer onboarding, allowing you to design and export standard CSS classes without sharing any personal information. Registration is required exclusively for saving customized preset dashboards, tracking transaction histories, and syncing unlocked premium layout components across multiple machines. Authenticating with your credentials simply links your settings to a secure backend cloud profile for cross-device persistence."
    },
    {
      q: "What is the Glassmorphism Code Analyzer and how does it evaluate custom styles?",
      a: "The Glassmorphism Code Analyzer is a diagnostic tool that parses your custom CSS rules, Tailwind utility classes, or styled-components layouts. It analyzes the style parameters for key features of glassmorphism—specifically looking for background transparency values (between 0.05 and 0.40 opacity), active backdrop-filter blur definitions, high-specular subtle border overlays, and elevation shadows. It awards a percentage score based on compliance, outlines missing attributes, and displays a live preview render of your code in action."
    },
    {
      q: "What are the pricing options for the Glass Analyzer and the Ultimate Mega Bundle?",
      a: "To support ongoing development, the Glass Analyzer is free for a limited-time 180-day trial. Once the trial expires, you can unlock lifetime unlimited usage of the Analyzer for a standalone fee of $9.99 USD. Alternatively, you can purchase the Ultimate Mega Bundle for $71.99 USD (saving 10% over buying individual packages), which unlocks lifetime access to both the premium presets bundle ($69.99 value) and the Glass Analyzer pass."
    }
  ]

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col relative">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10 w-full flex-1 flex flex-col space-y-12">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Documentation</h2>
          <p className="text-sm text-white/55 leading-relaxed">
            Understand the fundamentals of CSS Glassmorphism, integration configurations, and browser compatibility rules.
          </p>
        </div>

        {/* Section: Quick Installation Commands */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Quick Installation</span>
          </h3>
          <p className="text-xs md:text-sm text-white/60">
            Click on any package manager command box below to copy it instantly and install support libraries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => copyCode('install-lucide', 'npm install lucide-react')}
              className="bg-white/[0.02] border border-white/10 hover:border-purple-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all duration-200"
              title="Click to copy command"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-semibold uppercase text-purple-400 tracking-wider">Install Lucide Icons</span>
                <code className="text-xs font-mono text-white/80 block select-all">npm install lucide-react</code>
              </div>
              <div className="text-white/40 group-hover:text-white transition-colors">
                {copiedSection === 'install-lucide' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>

            <div 
              onClick={() => copyCode('install-styled', 'npm install styled-components')}
              className="bg-white/[0.02] border border-white/10 hover:border-purple-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all duration-200"
              title="Click to copy command"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-semibold uppercase text-purple-400 tracking-wider">Install Styled Components</span>
                <code className="text-xs font-mono text-white/80 block select-all">npm install styled-components</code>
              </div>
              <div className="text-white/40 group-hover:text-white transition-colors">
                {copiedSection === 'install-styled' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Anatomy */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>The Anatomy of Glassmorphism</span>
          </h3>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            Glassmorphism is a popular design style that relies on translucent overlays, light reflections, and multi-layered shadows to give elements a physical, frosted glass appearance. To achieve a realistic look, you need four core styling variables:
          </p>

          {/* Table */}
          <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/30 backdrop-blur-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-bold text-white/80">
                  <th className="p-3">CSS Property</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Standard Syntax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/60">
                <tr>
                  <td className="p-3 font-mono text-purple-400">background</td>
                  <td className="p-3">Semi-transparent solid color or light linear gradient.</td>
                  <td className="p-3 font-mono">rgba(255, 255, 255, 0.15)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-purple-400">backdrop-filter</td>
                  <td className="p-3">Blurs and saturates the elements directly underneath.</td>
                  <td className="p-3 font-mono">blur(16px) saturate(120%)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-purple-400">border</td>
                  <td className="p-3">Simulates glass thickness and light specular reflections.</td>
                  <td className="p-3 font-mono">1px solid rgba(255, 255, 255, 0.2)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-purple-400">box-shadow</td>
                  <td className="p-3">Separates the glass element from the surrounding context.</td>
                  <td className="p-3 font-mono">0 8px 32px 0 rgba(0, 0, 0, 0.3)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Safari Compatibility */}
        <section className="bg-amber-950/20 border border-amber-500/25 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Safari & iOS Compatibility Alert</span>
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            Safari and iOS browsers require the legacy prefix <code className="font-mono text-purple-300 bg-white/5 px-1 py-0.5 rounded">-webkit-backdrop-filter</code> to render backdrop blurs. Always include both versions in your CSS stylesheet to guarantee cross-device functionality.
          </p>
        </section>

        {/* Section: Integration */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-white">Framework Implementations</h3>
          <p className="text-xs md:text-sm text-white/60">
            Copy the compiled configurations below to get started inside your favorite styling framework:
          </p>

          <div className="space-y-6">
            {/* CSS */}
            <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 border-b border-white/5">
                <span className="text-xs font-bold text-white/80">Vanilla CSS</span>
                <button
                  onClick={() => copyCode('css', cssTemplate)}
                  className="text-white/60 hover:text-white flex items-center space-x-1 text-xs"
                >
                  {copiedSection === 'css' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-white/70 bg-black/20 select-text leading-relaxed">
                {cssTemplate}
              </pre>
            </div>

            {/* Tailwind */}
            <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 border-b border-white/5">
                <span className="text-xs font-bold text-white/80">Tailwind CSS (Inline Utility)</span>
                <button
                  onClick={() => copyCode('tw', tailwindTemplate)}
                  className="text-white/60 hover:text-white flex items-center space-x-1 text-xs"
                >
                  {copiedSection === 'tw' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-white/70 bg-black/20 select-text leading-relaxed">
                {tailwindTemplate}
              </pre>
            </div>

            {/* Styled-Components */}
            <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 border-b border-white/5">
                <span className="text-xs font-bold text-white/80">Styled-Components (React)</span>
                <button
                  onClick={() => copyCode('styled', styledComponentsTemplate)}
                  className="text-white/60 hover:text-white flex items-center space-x-1 text-xs"
                >
                  {copiedSection === 'styled' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-white/70 bg-black/20 select-text leading-relaxed">
                {styledComponentsTemplate}
              </pre>
            </div>
          </div>
        </section>

        {/* Section: Hydration Warning Tip */}
        <section className="bg-blue-950/20 border border-blue-500/25 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-blue-400 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>SSR / Hydration Warning Best Practice</span>
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            In React framework applications (such as Next.js or Remix) that use Server-Side Rendering, browser extensions like password managers or spellcheckers may inject custom attributes into the <code className="font-mono text-blue-300">html</code> or <code className="font-mono text-blue-300">body</code> elements on load. To prevent hydration warnings:
          </p>
          <ul className="list-disc pl-5 text-xs text-white/60 space-y-1">
            <li>Add <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-blue-300">suppressHydrationWarning</code> on your root HTML tag.</li>
            <li>Initialize any dynamic parameters that rely on client measurements (like <code className="font-mono text-blue-300">window.innerWidth</code>) inside a <code className="font-mono text-blue-300">useEffect</code> block, and set them to states instead of rendering them directly in the markup.</li>
          </ul>
        </section>

        {/* Section: Glassmorphism Code Analyzer */}
        <section className="space-y-4 border-t border-white/5 pt-12">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Glassmorphism Code Analyzer & Verifier</span>
          </h3>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            The <strong>Glass Analyzer</strong> is a diagnostic tool that scans and validates custom code inputs (CSS rules, Tailwind utility classes, or styled-components templates) to assess their compliance with glassmorphism design principles. It parses the styling properties and runs them against key architectural rules:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">1. Alpha Transparency Check</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Verifies if a semi-transparent background color (such as <code className="text-[10px] font-mono text-purple-300">rgba()</code> or <code className="text-[10px] font-mono text-purple-300">hsla()</code>) is declared. Glass layers require moderate opacity values between <code className="text-[10px] font-mono text-white/80">0.05</code> and <code className="text-[10px] font-mono text-white/80">0.40</code> to blend with background visuals.
              </p>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">2. Backdrop Blur Check</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Scans for active <code className="text-[10px] font-mono text-purple-300">backdrop-filter: blur(...)</code> properties. Blurs are essential to create depth and readability by diffusing colors of the background layer.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">3. Refraction Border Check</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Inspects border style declarations. Real glass panels have highlighted outer borders simulating light refraction. The analyzer checks for low-opacity border strokes (typically <code className="text-[10px] font-mono text-purple-300">rgba(255,255,255,0.1)</code> to <code className="text-[10px] font-mono text-purple-300">0.3</code>).
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">4. Contrast Shadow Check</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Examines drop shadow and elevation declarations. Specifying outer shadows (<code className="text-[10px] font-mono text-purple-300">box-shadow</code>) helps elevate glass panels from their backgrounds, creating clear separation.
              </p>
            </div>
          </div>

          <div className="bg-purple-950/20 border border-purple-500/25 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-purple-400 flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Free Beta Trial & All-Access Upgrade</span>
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              The Glassmorphism Code Analyzer includes a <strong>Free 180-day Beta Trial</strong>. After the trial period expires, full analysis capabilities require upgrading to either the standalone <strong>Glass Analyzer Pass ($9.99 USD)</strong> or the discounted <strong>Ultimate Mega Bundle ($71.99 USD)</strong>. Unlocked accounts can analyze unlimited blocks of code, utilize real-time render preview components, and copy optimized translations instantly.
            </p>
          </div>
        </section>

        {/* Section: FAQ */}
        <section className="space-y-6 border-t border-white/5 pt-12">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-white/55">
              Get detailed technical answers to frontend rendering, performance, and usage licensing questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div 
                  key={index}
                  className="border border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-white/90 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-white/5 text-xs md:text-sm text-white/60 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200 select-text">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
