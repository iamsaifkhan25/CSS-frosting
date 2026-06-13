import type { Metadata } from 'next'
import AnalyzerClient from './analyzer-client'

export const metadata: Metadata = {
  title: "Glassmorphism Code Analyzer & Verifier | CSS Frosting",
  description: "Test your custom CSS, Tailwind, or styled-components code to verify if it qualifies as glassmorphism. Get a score, a detailed evaluation checklist, and see it in action in real-time.",
  alternates: {
    canonical: 'https://cssfrosting.com/analyzer',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com/analyzer',
    title: 'Glassmorphism Code Analyzer & Verifier | CSS Frosting',
    description: 'Test your custom CSS, Tailwind, or styled-components code to verify if it qualifies as glassmorphism. Get a score, a detailed evaluation checklist, and see it in action in real-time.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Frosting Glassmorphism Code Analyzer Workspace',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glassmorphism Code Analyzer & Verifier | CSS Frosting',
    description: 'Test your custom CSS, Tailwind, or styled-components code to verify if it qualifies as glassmorphism. Get a score, a detailed evaluation checklist, and see it in action in real-time.',
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
            "name": "CSS Frosting Glassmorphism Analyzer",
            "operatingSystem": "All",
            "applicationCategory": "DeveloperApplication",
            "description": "Evaluate and test CSS, Tailwind, and styled-components for glassmorphism compliance and view an interactive preview.",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <AnalyzerClient />
    </>
  )
}
