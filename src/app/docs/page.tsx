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
      <DocsClient />
    </>
  )
}
