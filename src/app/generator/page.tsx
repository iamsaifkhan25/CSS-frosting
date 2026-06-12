import type { Metadata } from 'next'
import GeneratorClient from './generator-client'

export const metadata: Metadata = {
  title: "CSS Glassmorphism Generator | Real-Time UI Code Exporter",
  description: "Design stunning frosted glass effects with our real-time CSS glassmorphism generator. Adjust saturation, blur, shadows, and opacity. Export clean CSS or Tailwind classes instantly.",
  alternates: {
    canonical: 'https://cssfrosting.com/generator',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com/generator',
    title: 'CSS Glassmorphism Generator | Real-Time UI Code Exporter',
    description: 'Design stunning frosted glass effects with our real-time CSS glassmorphism generator. Adjust saturation, blur, shadows, and opacity. Export clean CSS or Tailwind classes instantly.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Glassmorphic Generator Workspace Interface showing sliders for blur, opacity, saturation, and box-shadow layers',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Glassmorphism Generator | Real-Time UI Code Exporter',
    description: 'Design stunning frosted glass effects with our real-time CSS glassmorphism generator. Adjust saturation, blur, shadows, and opacity. Export clean CSS or Tailwind classes instantly.',
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
            "@type": "WebApplication",
            "name": "CSS Glassmorphic Generator Tool",
            "url": "https://cssfrosting.com/generator",
            "description": "Interactive, browser-based web utility for adjusting and exporting CSS backdrop filter blurs, alpha gradients, and box shadows natively.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "browserRequirements": "Requires HTML5 backdrop-filter support.",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <GeneratorClient />
    </>
  )
}
