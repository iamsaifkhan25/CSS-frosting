import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_to_avoid_build_crash', {
  apiVersion: '2025-01-27-ac' as unknown as NonNullable<ConstructorParameters<typeof Stripe>[1]>['apiVersion'],
})

