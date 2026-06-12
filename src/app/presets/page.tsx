import type { Metadata } from 'next'
import PresetsClient from './presets-client'

export const metadata: Metadata = {
  title: "Premium Glassmorphism Presets & Layouts | CSS Frosting",
  description: "Unlock professional, pre-built glassmorphic layouts including dashboard sidebars, pricing grids, and transactional checkout cards. Export HTML/CSS instantly.",
  alternates: {
    canonical: 'https://cssfrosting.com/presets',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com/presets',
    title: 'Premium Glassmorphism Presets & Layouts | CSS Frosting',
    description: 'Unlock professional, pre-built glassmorphic layouts including dashboard sidebars, pricing grids, and transactional checkout cards. Export HTML/CSS instantly.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Frosting Presets Workspace displaying dashboard layout templates and cards',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Glassmorphism Presets & Layouts | CSS Frosting',
    description: 'Unlock professional, pre-built glassmorphic layouts including dashboard sidebars, pricing grids, and transactional checkout cards. Export HTML/CSS instantly.',
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
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Glassmorphic Dashboard Sidebar Layout"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Frosted Grid Layout"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Transactional Checkout Card Preset"
              }
            ]
          })
        }}
      />
      <PresetsClient />
    </>
  )
}
