import type { Metadata } from 'next'
import ResetPasswordClient from './reset-password-client'

export const metadata: Metadata = {
  title: 'Reset Password | CSS Frosting',
  description: 'Reset your CSS Frosting account password securely.',
  alternates: {
    canonical: 'https://cssfrosting.com/auth/reset-password',
  },
}

export default function Page() {
  return <ResetPasswordClient />
}
