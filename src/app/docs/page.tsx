import type { Metadata } from 'next'
import DocsClient from './docs-client'

export const metadata: Metadata = {
  title: "Glassmorphism CSS Documentation & Browser Compatibility",
  description: "Learn the fundamentals of glassmorphism CSS styling. Explore integration guides, Safari compatibility rules for -webkit-backdrop-filter, and integration code snippets.",
  alternates: {
    canonical: 'https://cssfrosting.com/docs',
  },
  openGraph: {
    type: 'article',
    url: 'https://cssfrosting.com/docs',
    title: 'Glassmorphism CSS Documentation & Browser Compatibility',
    description: 'Learn the fundamentals of glassmorphism CSS styling. Explore integration guides, Safari compatibility rules for -webkit-backdrop-filter, and integration code snippets.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Glassmorphic styling documentation structure and framework integration blocks',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glassmorphism CSS Documentation & Browser Compatibility',
    description: 'Learn the fundamentals of glassmorphism CSS styling. Explore integration guides, Safari compatibility rules for -webkit-backdrop-filter, and integration code snippets.',
    images: ['https://cssfrosting.com/og-image.png'],
  }
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "Glassmorphism CSS Documentation & Integration Guide",
            "description": "Understand the fundamentals of CSS glassmorphism styling, cross-browser prefix requirements, and custom shadow offsets.",
            "url": "https://cssfrosting.com/docs",
            "inLanguage": "en",
            "articleSection": "Frontend Web Development Techniques",
            "author": {
              "@type": "Organization",
              "name": "CSS Frosting"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes this glassmorphism generator different from basic alternatives like CSS.glass?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlike basic platforms such as CSS.glass which restrict your preview canvas to a single static rectangle, our workspace features an interactive multi-component design playground. Developers can instantly toggle their layouts to preview how frosted styling renders on dynamic dashboard sidebars, layered credit card grids, mock application windows, and responsive checkout components. Additionally, this utility lets you inspect multi-layer lighting variables and border highlight specular maps in real-time. By supporting dynamic DOM injection and multi-variant component canvas views, it bridges the gap between basic visual sandboxes and complex production-ready interfaces."
                }
              },
              {
                "@type": "Question",
                "name": "Why is my backdrop-filter blur effect not rendering properly in Mozilla Firefox or older mobile browsers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The backdrop-filter property is dependent on modern GPU rendering pipelines, which are disabled by default in certain browsers. In Mozilla Firefox, you must manually enable the feature flag by navigating to about:config and toggling layout.css.backdrop-filter.enabled to true. Furthermore, older WebKit-based browsers like Safari and iOS Chrome require the legacy -webkit-backdrop-filter vendor prefix to trigger composition layering. To guarantee a high-quality user experience across all devices, we recommend implementing a solid or semi-transparent fallback background-color style ruleset inside a feature query block using CSS @supports declarations."
                }
              },
              {
                "@type": "Question",
                "name": "Can I export these translucent styling layouts directly into modern utility frameworks like Tailwind CSS, React, or Styled-Components?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our translucent element code exporter provides complete multi-framework export compatibility. With a single click, you can extract clean vanilla CSS sheets, inline React style objects, modular Styled-Components wrapper templates, or Tailwind CSS v4 custom class utility combinations. The generator automatically resolves alpha color variables and formats standard shadows into framework-compliant syntax. This ensures frontend developers can drop the exported properties directly into production configurations without requiring manual syntax translation or style refactoring."
                }
              },
              {
                "@type": "Question",
                "name": "How does the glassmorphic rendering engine affect web application performance and page rendering speeds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Using the CSS backdrop-filter property forces the browser to create a new graphics composition layer, offloading filter calculations to the hardware-accelerated GPU. While this provides exceptionally smooth rendering, applying large blurs to multiple overlapping DOM elements can degrade layout performance and cause frame rate drops, especially on mobile devices. To optimize rendering efficiency, we recommend limiting the number of active blurred panels on a single viewport and applying will-change: transform to promote elements to their own compositing layers. This approach minimizes paint operations and prevents sluggish page scrolls."
                }
              },
              {
                "@type": "Question",
                "name": "How safe and secure is the payment gateway for upgrading to premium preset templates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our payment processing infrastructure is built to guarantee the highest level of security for transactions. We integrate directly with industry-leading, PCI-DSS Level 1 compliant payment gateways, including Stripe and Razorpay, to process all premium upgrades. Your credit card credentials and sensitive payment data are encrypted on the client-side and never touch or store on our application servers. All checkout sessions employ 3D Secure verification protocols and end-to-end tokenization to prevent unauthorized transactions. This architecture ensures developers and companies can purchase premium assets with complete trust and security."
                }
              },
              {
                "@type": "Question",
                "name": "Are the premium UI component templates purchased from this platform covered under a commercial usage license?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all UI component presets and layouts exported from our platform include a comprehensive commercial usage license. This lifetime, royalty-free license grants you full permission to utilize, modify, and distribute the styling codes in personal, freelance, and corporate client production environments. There are no restrictions on the number of client sites you can deploy or the commercial revenue generated by apps using these elements. However, reselling our templates as standalone visual assets or repackaging them in competing UI libraries is strictly prohibited."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to create an account or sign in to use the core configuration utilities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Creating an account is entirely optional, as the core configuration sliders and vanilla CSS code exporters are 100% free and open to all visitors without any registration wall. We prioritize friction-free developer onboarding, allowing you to design and export standard CSS classes without sharing any personal information. Registration is required exclusively for saving customized preset dashboards, tracking transaction histories, and syncing unlocked premium layout components across multiple machines. Authenticating with your credentials simply links your settings to a secure backend cloud profile for cross-device persistence."
                }
              }
            ]
          })
        }}
      />
      <DocsClient />
    </>
  )
}
