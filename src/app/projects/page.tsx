import type { Metadata } from 'next'
import ProjectsClient from './projects-client'

export const metadata: Metadata = {
  title: "Other Projects | CSS Frosting Developer Network",
  description: "Explore other privacy-first web utilities created by our development team, including Open Study Deck, the zero-paywall AI study card studio.",
  alternates: {
    canonical: 'https://cssfrosting.com/projects',
  },
  openGraph: {
    type: 'website',
    url: 'https://cssfrosting.com/projects',
    title: 'Other Projects | CSS Frosting Developer Network',
    description: 'Explore other privacy-first web utilities created by our development team, including Open Study Deck, the zero-paywall AI study card studio.',
    images: [
      {
        url: 'https://cssfrosting.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSS Frosting Creator Network Projects Overview',
      }
    ],
    siteName: 'CSS Frosting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Other Projects | CSS Frosting Developer Network',
    description: 'Explore other privacy-first web utilities created by our development team, including Open Study Deck, the zero-paywall AI study card studio.',
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
            "@type": "ItemPage",
            "name": "Other Projects",
            "url": "https://cssfrosting.com/projects",
            "description": "A catalog of open-source, privacy-first web utilities created by our development team, including Open Study Deck.",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Open Study Deck",
                  "url": "https://openstudydeck.com"
                }
              ]
            }
          })
        }}
      />
      <ProjectsClient />
    </>
  )
}
