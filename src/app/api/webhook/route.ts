import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const bodyText = await req.text()
  const sig = req.headers.get('x-razorpay-signature') || ''
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret_to_avoid_build_crash'

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyText)
    .digest('hex')

  if (expectedSignature !== sig) {
    console.error('[RAZORPAY_WEBHOOK_SIGNATURE_FAILED]')
    return NextResponse.json({ error: 'Signature mismatch.' }, { status: 400 })
  }

  const event = JSON.parse(bodyText)

  // Handle order.paid or payment.captured events
  if (event.event === 'order.paid' || event.event === 'payment.captured') {
    const payloadEntity = event.event === 'order.paid' 
      ? event.payload.order.entity 
      : event.payload.payment.entity

    // Razorpay orders contain notes we pass during creation
    // If the event is payment.captured, we might need to get notes from the payment entity
    // or retrieve the order notes. In our order creation we set notes on the order, 
    // so checking order entity is more reliable.
    const orderNotes = event.payload.order?.entity?.notes || payloadEntity.notes
    
    if (!orderNotes) {
      console.error('Webhook missing notes metadata:', event)
      return NextResponse.json({ error: 'Missing metadata notes' }, { status: 400 })
    }

    const userId = orderNotes.user_id
    const productId = orderNotes.product_id
    const amountPaid = orderNotes.amount_paid || '0'

    if (!userId || !productId) {
      console.error('Webhook parsed notes missing parameters:', orderNotes)
      return NextResponse.json({ error: 'Incomplete notes data' }, { status: 400 })
    }

    try {
      const adminSupabase = createAdminClient()

      // Ensure user profile exists (fallback)
      const { data: userRecord, error: userError } = await adminSupabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (userError || !userRecord) {
        const { data: authUser, error: authUserError } = await adminSupabase.auth.admin.getUserById(userId)
        if (!authUserError && authUser?.user) {
          await adminSupabase.from('users').insert({
            id: userId,
            email: authUser.user.email || '',
          })
        }
      }

      // Check if purchase already recorded to prevent duplicates
      const { data: existingPurchase } = await adminSupabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('status', 'completed')
        .maybeSingle()

      if (!existingPurchase) {
        // Record purchase
        const { error: insertError } = await adminSupabase
          .from('purchases')
          .insert({
            user_id: userId,
            product_id: productId,
            amount_paid: parseFloat(amountPaid),
            status: 'completed',
          })

        if (insertError) {
          console.error('[WEBHOOK_DB_INSERT_FAILED]:', insertError)
          return NextResponse.json({ error: 'Database record failed' }, { status: 500 })
        }
      }

      console.log(`[RAZORPAY_WEBHOOK_SUCCESS]: User ${userId} bought ${productId}`)
    } catch (dbErr: any) {
      console.error('[WEBHOOK_DB_EXCEPTION]:', dbErr)
      return NextResponse.json({ error: 'Database exception occurred' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
