import type { Metadata } from 'next'
import HomeClient from './home-client'

export const metadata: Metadata = {
  title: "CSS Glassmorphic & Gradient Generator | Real-Time UI Exporter",
  description: "Generate high-performance frosted glass styles and translucent layouts with our free CSS generator. Customize background alpha channels, shadows, gradients, and blurs.",
  alternates: {
    canonical: 'https://cssfrosting.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com',
    title: 'CSS Glassmorphic & Gradient Generator | Real-Time UI Exporter',
    description: 'Generate high-performance frosted glass styles and translucent layouts with our free CSS generator. Customize background alpha channels, shadows, gradients, and blurs.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Frosting UI Canvas Preview showing translucent panels with background blurs and shadows',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Glassmorphic & Gradient Generator | Real-Time UI Exporter',
    description: 'Generate high-performance frosted glass styles and translucent layouts with our free CSS generator. Customize background alpha channels, shadows, gradients, and blurs.',
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
            "name": "CSS Frosting",
            "url": "https://cssfrosting.com",
            "description": "A developer-centric web utility to generate and export CSS/Tailwind glassmorphic styling codes in real time.",
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
      <HomeClient />
    </>
  )
}
