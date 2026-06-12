import { NextResponse } from 'next/server'
import { createServerSupabase, createAdminClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      productId 
    } = await req.json()

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !productId) {
      return NextResponse.json({ error: 'Missing payment parameters.' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_key_secret_to_avoid_build_crash'

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Query product info to record price
    const { data: product, error: dbError } = await adminSupabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (dbError || !product) {
      return NextResponse.json({ error: 'Product metadata not found.' }, { status: 404 })
    }

    // Add row to purchases table
    const { error: insertError } = await adminSupabase
      .from('purchases')
      .insert({
        user_id: user.id,
        product_id: productId,
        amount_paid: Number(product.price),
        status: 'completed',
      })

    if (insertError) {
      console.error('[VERIFY_API_DB_INSERT_FAILED]:', insertError)
      return NextResponse.json({ error: 'Failed to record purchase.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_API_ERROR]:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
