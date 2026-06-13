# CSS Frosting ❄️

**CSS Frosting (v2.0)** is a premium, developer-first platform designed to create, test, and export high-performance, GPU-accelerated glassmorphism layouts and styling properties. Built using Next.js 16 (App Router), React 19, and Tailwind CSS v4, it provides a comprehensive design canvas and evaluation environment.

---

## 🚀 Features

### 1. Frosting Canvas (Generator)
An interactive real-time editor featuring design controllers for all aspects of glassmorphism styling:
* **Dynamic Sliders**: Background opacity, backdrop filter blur, element saturation, border width, border opacity, and box-shadow elevation.
* **Component Playground**: Toggle live styling across multiple component views (e.g., credit card, dashboard sidebar, mock app window, and modal).
* **Multi-Framework Exporter**: Instantly copy styles formatted for:
  * Vanilla CSS
  * Tailwind CSS (features an compiler that translates complex space-separated CSS attributes into Tailwind v4 arbitrary syntax, e.g., `bg-[linear-gradient(135deg,_rgba(255,_255,_255,_0.1)_...)]`)
  * Styled-Components (React)
  * React Inline Styles

### 2. Premium Presets Gallery
A curated catalog of production-ready glassmorphic UI presets:
* **Interactive Previews**: Component-specific mockups reflecting the actual styles (Glass Credit Card, Premium Glass Modal, Navigation Sidebars, etc.).
* **Commercial Usage License**: Standard and premium license configurations allowing lifetime usage in personal and corporate projects.
* **All-Access Pass**: Immediate unlocking of all premium styles and features via Stripe or Razorpay.

### 3. Glassmorphism Code Analyzer (Verifier) (New ✨)
A diagnostic code verifier where developers can input custom CSS, Tailwind utility classes, or styled-components code:
* **Automated Checking Engine**: Validates inputs against structural rules:
  1. *Alpha Transparency Check*: Background color opacity is between `0.05` and `0.40`.
  2. *Backdrop Blur Check*: Presence of `backdrop-filter: blur(...)`.
  3. *Refraction Border Check*: Subtle, low-opacity border strokes simulating light reflection.
  4. *Elevation Shadow Check*: Elevated drop shadows to separate glass from backgrounds.
* **Compliance Scoring**: Calculates a dynamic percentage score with clear compliance checklists.
* **Live Sandbox Render**: Instantly renders user code into an interactive card against a variety of dynamic animated backgrounds.
* **Beta Access**: Free 180-day limited trial, unlockable lifetime access via standalone pass or the Ultimate Mega Bundle.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
* **Backend & Auth**: Supabase (PostgreSQL, Client Session Authentication).
* **Payment Gateways**: Stripe and Razorpay (PCI-DSS compliant SDKs and secure API routes).
* **Hosting & Runtime**: OpenNext + Cloudflare Workers / Pages.

---

## ⚙️ Environment Configuration

To run CSS Frosting locally, create a `.env.local` file in the root directory and configure the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Gateway API Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay Gateway API Configuration
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Application Deployment URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!WARNING]
> Keep your `.env.local` file private. It is automatically ignored by `.gitignore` and must never be committed to public repositories.

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database Schema
Apply the database schema locally or in your Supabase project using the queries in [schema.sql](file:///C:/Users/iamsa/Documents/VS%20Codes/CSSfrosting/schema.sql). This configures:
* User profiles and permissions tracking.
* The `products` catalog defining presets packages, analyzer trial records, and the Ultimate Mega Bundle.
* Purchase records associating users with purchased products (`glass-premium-presets`, `glass-analyzer`, `glass-mega-bundle`).

### 3. Run the Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to test the local workspace.

### 4. Code Quality & Formatting
Run the linter to verify syntax correctness:
```bash
npm run lint
```

---

## ☁️ Production Deployment

The project is configured for serverless deployment using **OpenNext** and **Cloudflare Wrangler**.

### Build for Cloudflare
```bash
npm run build:cf
```

### Deploy to Production
```bash
npm run deploy:cf
```

---

## 📄 Licensing & Security

* **Licensing**: Premium assets downloaded are covered under a lifetime royalty-free commercial license.
* **Privacy**: All credentials, payment cards, and user database profiles are secured with SSL tokenization and PCI-DSS compliance frameworks. No private payment details are ever persisted on our servers.
