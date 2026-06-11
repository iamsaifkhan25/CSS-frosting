import { NextResponse } from 'next/server'
import { createServerSupabase, createAdminClient } from '@/lib/supabase-server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 })
    }

    // Query product
    const adminSupabase = createAdminClient()
    const { data: product, error: dbError } = await adminSupabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (dbError || !product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // Check if already purchased
    const { data: existingPurchase } = await adminSupabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .maybeSingle()

    if (existingPurchase) {
      return NextResponse.json({ error: 'Product already owned.' }, { status: 400 })
    }

    // Create Razorpay Order
    const amountInCents = Math.round(Number(product.price) * 100)

    const order = await razorpay.orders.create({
      amount: amountInCents,
      currency: 'USD',
      receipt: `receipt_${user.id.substring(0, 10)}_${productId}`,
      notes: {
        product_id: productId,
        user_id: user.id,
        amount_paid: product.price.toString(),
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_T0Nw1fEYYo8OtR',
      userEmail: user.email,
    })
  } catch (error: any) {
    console.error('[RAZORPAY_CHECKOUT_API_ERROR]:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
