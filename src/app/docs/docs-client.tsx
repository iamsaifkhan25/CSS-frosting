'use client'

import { useState } from 'react'
import { Sparkles, Info, AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react'

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

  return (
    <div className="flex-1 bg-[#0a0a0a] text-white flex flex-col relative select-none">
      
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

      </main>
    </div>
  )
}
