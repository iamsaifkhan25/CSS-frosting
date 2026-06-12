import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with CSS Frosting Support",
  description: "Reach out to the CSS Frosting and Open Study Deck developer team. Send us bug reports, design ideas, or integration inquiries directly.",
  alternates: {
    canonical: 'https://cssfrosting.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact CSS Frosting & Open Study Deck Team",
            "url": "https://cssfrosting.com/contact",
            "description": "Get in touch with the development team for CSS Frosting and Open Study Deck.",
            "mainEntity": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "harukiwaves@zohomail.in"
            }
          })
        }}
      />
      <ContactClient />
    </>
  )
}
