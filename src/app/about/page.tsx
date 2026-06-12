import type { Metadata } from 'next'
import AboutClient from './about-client'

export const metadata: Metadata = {
  title: "About Us | CSS Frosting & Open Study Deck Creator Mission",
  description: "Learn about the mission behind CSS Frosting and Open Study Deck. We build privacy-first, developer-centric utilities that bypass subscription paywalls using client-side execution.",
  alternates: {
    canonical: 'https://cssfrosting.com/about',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com/about',
    title: 'About Us | CSS Frosting & Open Study Deck Creator Mission',
    description: 'Learn about the mission behind CSS Frosting and Open Study Deck. We build privacy-first, developer-centric utilities that bypass subscription paywalls using client-side execution.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Frosting Creator Mission Overview',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | CSS Frosting & Open Study Deck Creator Mission',
    description: 'Learn about the mission behind CSS Frosting and Open Study Deck. We build privacy-first, developer-centric utilities that bypass subscription paywalls using client-side execution.',
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
            "@type": "AboutPage",
            "name": "About CSS Frosting & Open Study Deck",
            "url": "https://cssfrosting.com/about",
            "description": "Information about the developer-centric, privacy-first mission behind CSS Frosting and Open Study Deck.",
            "mainEntity": {
              "@type": "Organization",
              "name": "CSS Frosting",
              "url": "https://cssfrosting.com",
              "sameAs": [
                "https://openstudydeck.com"
              ]
            }
          })
        }}
      />
      <AboutClient />
    </>
  )
}
