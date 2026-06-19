'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Paintbrush, LayoutGrid, Sparkles, Code } from 'lucide-react'
import Footer from '@/components/Footer'

export default function HomeClient() {
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
            Designing translucent, frosted-glass components shouldn&apos;t require guess work. Adjust parameters in real-time, inspect layouts, and export CSS or Tailwind codes instantly.
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
              <p className="text-xl md:text-2xl font-bold text-white">10+</p>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider leading-tight">Free & Premium Presets</p>
              <p className="text-[8px] text-white/35 font-medium mt-0.5 normal-case tracking-normal">(More coming in future)</p>
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
            className="w-80 md:w-96 aspect-[1.6] relative cursor-pointer"
          >
            {/* The actual 3D visual card */}
            <div
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="w-full h-full rounded-2xl p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 flex flex-col justify-between pointer-events-none"
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
            <Link
              href="/generator"
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-purple-500/10 border border-purple-500/25 text-purple-400 p-3 rounded-xl w-fit">
                <Paintbrush className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Adjustable Canvas Controls</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Tune backdrop blur, tint opacity, border widths, shadow ranges, and solid tones. Modify precise slider values or type exact settings.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link
              href="/generator"
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 p-3 rounded-xl w-fit">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">CSS, Tailwind & Styled Dual Exports</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Export clean static CSS declarations, inline React stylings, Tailwind custom style definitions, or Styled-Components. One-click copy utility.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link
              href="/presets"
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 p-3 rounded-xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Premium Preset Store</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Unlock advanced layouts incorporating multi-glow details, gradient masking, custom charts, and wallet authentication presets.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Deep-Dive Technical Content Section */}
      <section className="w-full bg-[#050505] border-t border-white/5 relative z-10 py-24 px-6 select-text">
        <div className="max-w-4xl mx-auto flex flex-col space-y-12">
          
          <div className="border-b border-white/5 pb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              CSS Glassmorphic Generator: The Definitive Engine for Modern Frosted Interfaces
            </h1>
            <p className="mt-6 text-sm md:text-base text-white/60 leading-relaxed">
              In the fast-evolving landscape of modern web design, creating sleek, premium user interfaces requires tools that prioritize developer efficiency, cross-device compatibility, and pixel-perfect rendering accuracy. Our next-generation web application introduces an advanced <strong>css glassmorphic generator</strong> designed to streamline your frontend visual workflows. Built specifically for developers who demand high performance and clean output, this dev utility operates as a premier <strong>glassmorphism CSS generator</strong> and all-in-one <strong>css generator</strong> that enables engineers to create, tweak, and implement sophisticated translucent components with ease. By bridging the gap between visual styling and clean output, it ensures your next-generation ui and ux architectures remain lightweight and highly performant.
            </p>
            <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed">
              As user expectations evolve, flat interfaces are increasingly replaced by dimensional environments that feature depth, layering, and physical material behaviors. Glassmorphism—characterized by frosted transparency, multi-layered drop shadows, and delicate, high-contrast borders—has emerged as a cornerstone of modern interfaces (such as Microsoft&apos;s Fluent Design and Apple&apos;s macOS/iOS styling). However, implementing these designs in code has historically been a tedious, iterative process. Developers are forced to manually write complex backdrop-filter settings, calculate appropriate alpha values, and test border highlights. This browser-based editor acts as a real-time UI exporter, eliminating manual calculations and enabling frontend developers to instantly inspect rendering output and export production-ready code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-white/50 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">The Bottlenecks of Legacy Glassmorphism Platforms</h3>
              <p>
                Designing modern translucent components has historically been a friction-filled process. Standard styling solutions frequently fall short, forcing engineers to rely on subpar tools that degrade the overall dev workflow. For instance, the popular tool <code className="text-purple-400">CSS.glass</code> restricts creators by providing a single unyielding box preview, rendering it virtually useless for testing real-world responsive layouts. When designing a complex dashboard interface, a simple preview card does not allow you to understand how backdrop filters behave when text scrolls behind them or when elements stack on top of each other.
              </p>
              <p>
                Other platforms, such as <code className="text-purple-400">UI.glass</code> and <code className="text-purple-400">Hype4 Academy</code>, severely degrade the developer experience. They slow down workflows with sluggish loading times, heavy script payloads, and aggressive course promotion banners that distract from the task at hand. Instead of focusing on copy-paste code exporting, developers are subjected to distracting marketing funnels and loading screens that interrupt the creative process.
              </p>
              <p>
                When your team needs to test how multiple elements stack and react, these legacy environments prove highly inefficient. A developer-centric workspace should be fast, clean, and flexible. It should act as an advanced <strong>translucent element code exporter</strong> that lets you work without distractions, exporting high-fidelity styles directly to your layout files. By incorporating direct visual comparisons and multiple component targets (such as credit cards, sidebars, navigation headers, and modal dialogs), our solution eliminates the guesswork inherent in legacy tooling.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Under the Hood of the Native CSS Glassmorphic Generator</h3>
              <p>
                Our solution takes a fundamentally different engineering path. Instead of relying on heavy canvas re-renders, iframe containers, or third-party web components, this browser-based utility manipulates the browser <strong>dom</strong> natively to update custom <strong>css</strong> variables in real-time. By interacting directly with the Document Object Model, we ensure zero layout lag and perfect rendering accuracy. Sliders directly map to custom styling declarations, allowing you to instantly preview changes on the fly.
              </p>
              <p>
                Achieving a high-fidelity <strong>frosted glass effect CSS</strong> output requires a deep understanding of browser composition. Our engine functions as an advanced <strong>CSS backdrop-filter generator</strong>, calculating the exact mathematical parameters needed for hardware-accelerated blur effects. The math behind realistic glassmorphic styling requires careful layering of background alpha channels, responsive box shadows, and the essential backdrop-filter blur parameters.
              </p>
              <p>
                By utilizing a robust <strong>css glassmorphic generator</strong>, designers can bypass manual calculations. Developers can inspect the live output, customize the color palette, and copy the resulting <strong>frosted glass styling code</strong> instantly, utilizing our built-in <strong>backdrop filter blur tool</strong> engine to ensure smooth rendering. This ensures that the generated values map directly to the visual representation on screen, saving hours of manual styling adjustments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-white/50 leading-relaxed border-t border-white/5 pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">The Structural Physics and Anatomy of Frosted Glass</h3>
              <p>
                Achieving a convincing glass texture is not just about lowering background opacity and adding a blur radius. True physical glass interacts with light in complex ways, producing edge refraction, specular highlights, light diffusion, and internal shadows. To simulate these physics on a 2D digital screen using standard CSS properties, we must coordinate four core styling variables:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Background Tint &amp; Opacity:</strong> The base layer of any glassmorphic component is a semi-transparent background fill, typically defined using <code className="text-purple-400">rgba()</code> or <code className="text-purple-400">hsla()</code> values. The background opacity must be carefully balanced—usually between 0.05 (for a thin, highly transparent look) and 0.40 (for a dense, frosted appearance). If the opacity is too high, the container loses its glass-like quality; if it is too low, text readability is compromised. Applying a subtle gradient using our integrated <strong>gradient css generator</strong> can also simulate light reflecting across the surface.
                </li>
                <li>
                  <strong>Backdrop Filter Blur:</strong> The <code className="text-purple-400">backdrop-filter: blur(...)</code> CSS property is the engine that drives the frosted glass effect. Unlike a standard filter: blur(...) which blurs the element itself, the backdrop-filter blurs the content behind the element. This creates a realistic light diffusion effect, turning the background colors into a soft, blended canvas that enhances foreground contrast and typography readability.
                </li>
                <li>
                  <strong>Refraction Border Highlighting:</strong> To simulate the physical thickness and edge refraction of glass, a thin border is essential. A 1px border styled with a low-opacity white value (like <code className="text-purple-400">rgba(255, 255, 255, 0.2)</code>) mimics the way light catches on a pane&apos;s edge. This specular border is vital for separating the glass container from similarly colored background elements.
                </li>
                <li>
                  <strong>Elevation Shadows:</strong> To establish physical depth and separate the translucent panel from its background context, developers must layer drop shadows. An outer <code className="text-purple-400">box-shadow</code> with a generous blur radius and a low-opacity dark color (such as <code className="text-purple-400">rgba(0, 0, 0, 0.25)</code>) lifts the glassmorphic card off the canvas, establishing a clear visual hierarchy.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Optimizing Glassmorphism for Hardware-Accelerated Performance</h3>
              <p>
                Performance is a major consideration when implementing glassmorphic interfaces on the web. Applying backdrop-filters forces the browser&apos;s layout engine to create a new graphics composition layer. The browser must capture the pixels behind the element, apply a blur filter, overlay the element&apos;s background tint, and render the final composite. On mobile screens and devices with integrated GPUs, applying heavy blurs to multiple overlapping containers can degrade performance, causing layout lag and dropping frame rates during scrolling.
              </p>
              <p>
                Our platform is built from the ground up to solve these performance challenges. The exported CSS code is clean and avoids redundant properties that trigger expensive repaint cycles. To optimize rendering efficiency, we recommend limiting the number of active blurred panels on a single viewport and applying <code className="text-purple-400">will-change: transform</code> to promote elements to their own compositing layers. This approach isolates the element from the main thread paint lifecycle, preventing sluggish scrolls and maintaining a solid 60 FPS user experience.
              </p>
              <p>
                Additionally, specifying a solid fallback background color within a feature query guarantees that older browsers and low-powered hardware do not struggle. Our analyzer tool scans your stylesheets to ensure compatibility tags are set up, ensuring your applications load quickly and run efficiently across all desktop and mobile environments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-white/50 leading-relaxed border-t border-white/5 pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Cross-Browser Compatibility: Safari WebKit &amp; Firefox</h3>
              <p>
                A common issue in modern web styling is ensuring layouts work consistently across different browsers. The backdrop-filter property can render differently depending on the user&apos;s browser engine. For example, Apple&apos;s Safari and iOS Chrome require the legacy vendor prefix <code className="text-purple-400">-webkit-backdrop-filter</code> to enable composition layering. If this prefix is missing, Safari will fail to render the blur, leaving a flat, semi-transparent container that ruins the visual experience. Our code generator automatically adds this prefix alongside standard declarations to ensure your UI looks perfect on iPhone, iPad, and Mac screens.
              </p>
              <p>
                Similarly, Mozilla Firefox handles backdrop filters differently. In older versions, this feature is disabled by default, requiring users to navigate to <code className="text-purple-400">about:config</code> and manually enable the <code className="text-purple-400">layout.css.backdrop-filter.enabled</code> flag.
              </p>
              <p>
                To guarantee a high-quality user experience across all devices, we recommend implementing a solid or semi-transparent fallback background-color style ruleset inside a feature query block using CSS <code className="text-purple-400">@supports</code> declarations. By styling a safe background color as a default and applying the backdrop-filter only when supported, you ensure your layouts degrade gracefully. Our tool generates these safe fallbacks automatically, keeping your designs accessible to all users.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Designing for the Future: UX-Driven &amp; Liquid Glass Effects</h3>
              <p>
                As visual trends transition into 2026, styling paradigms are shifting from simple blurred boxes to complex <strong>UX-driven glassmorphism</strong>. Modern interfaces use depth to establish content hierarchy rather than simple aesthetic decoration. In UX-driven layouts, the blur strength and background opacity correlate directly with the component&apos;s position in the visual hierarchy. For example, a persistent background navigation bar might use a subtle blur (8px) and low opacity (0.05) to remain unobtrusive, while a modal overlay uses an intense blur (24px) and higher opacity (0.2) to draw focus and separate itself from the layout.
              </p>
              <p>
                Furthermore, our editor supports experimental designs like the <strong>liquid glass UI effect</strong>, introducing complex refraction layers and specular gradients that mimic real glass behaviors under varying light sources. With our tool, you are not limited to basic containers. You can craft a highly customized <strong>responsive glass card CSS</strong> definition, fine-tune border-image gradients to simulate specular edge highlights, and extract variables directly for your styling system.
              </p>
              <p>
                By utilizing our integrated <strong>gradient css generator</strong>, developers can seamlessly blend background linear gradient alpha colors with specular borders to create incredibly realistic effects. Adding dynamic mouse-tracking glow events (as showcased in our interactive cards) further breathes life into the UI, encouraging user interaction and giving your application a premium visual feel that stands out from typical flat layouts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-white/50 leading-relaxed border-t border-white/5 pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Full-Stack Integration &amp; Secure API Capability</h3>
              <p>
                Modern engineering teams need more than a simple playground; they require a persistent workspace. This web application integrates a secure full-stack backend <strong>api</strong> tier that automatically saves transaction and preset configuration histories permanently. The moment you authenticate, your custom configurations are loaded, giving you immediate access to your saved assets. This cloud-based system keeps your visual workspace synchronized, allowing you to access and edit your designs from any machine.
              </p>
              <p>
                This enterprise-grade infrastructure allows you to store and modify complex layouts that go far beyond basic cards. Users can instantly generate and export advanced layouts, including glassmorphic dashboard sidebars with nested list items, elegant, transparent pricing grids with highlight borders, and secure, transactional checkout cards with embedded input fields.
              </p>
              <p>
                Payment processing for our premium presets is handled securely using industry-standard platforms. Whether you choose Stripe or Razorpay, your payment details are encrypted and processed securely without storing credit card credentials on our servers. This ensures a safe checkout process, allowing you to unlock premium preset packs and advanced diagnostic features with complete peace of mind.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Tailwind CSS Integration &amp; Utility-First Exporting</h3>
              <p>
                For engineering teams using utility-first styling systems like Tailwind CSS, manual styling calculations can disrupt the coding flow. Translating CSS properties like blur filters, opacity gradients, and border-radius settings into Tailwind utility classes requires translating values and managing custom theme extensions.
              </p>
              <p>
                Our platform features an integrated <strong>tailwind glassmorphism online</strong> exporter to solve this issue. The exporter translates your custom design parameters into clean, framework-compliant Tailwind class utility combinations. This makes it easy to integrate frosted UI components directly into React, Next.js, and static HTML layouts without manual code translations.
              </p>
              <p>
                By supporting dual exports—vanilla CSS style sheets and Tailwind CSS utility classes—our generator functions as the ultimate frontend toolkit. Whether you are styling standard HTML layouts or building components inside Next.js, CSS Frosting makes it simple to integrate frosted panels, ensuring your styles remain clean, optimized, and ready for production deployment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
