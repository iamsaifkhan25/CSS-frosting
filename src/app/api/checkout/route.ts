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
      console.error('[CHECKOUT_PRODUCT_QUERY_FAILED]:', dbError)
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // Check if already purchased
    const { data: userPurchases } = await adminSupabase
      .from('purchases')
      .select('product_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    const purchasedIds = userPurchases ? userPurchases.map((p: any) => p.product_id) : []

    let owned = false
    let errorMsg = 'Product already owned.'

    if (productId === 'glass-analyzer') {
      if (purchasedIds.includes('glass-analyzer')) {
        owned = true
      } else if (purchasedIds.includes('glass-premium-all-access')) {
        owned = true
        errorMsg = 'You already own the Lifetime All-Access Pass (which includes the Analyzer).'
      } else if (purchasedIds.includes('glass-mega-bundle')) {
        owned = true
        errorMsg = 'You already own the Ultimate Mega Bundle (which includes the Analyzer).'
      }
    } else if (productId === 'glass-premium-all-access') {
      if (purchasedIds.includes('glass-premium-all-access')) {
        owned = true
      } else if (purchasedIds.includes('glass-mega-bundle')) {
        owned = true
        errorMsg = 'You already own the Ultimate Mega Bundle (which includes all presets).'
      }
    } else if (productId === 'glass-mega-bundle') {
      if (purchasedIds.includes('glass-mega-bundle')) {
        owned = true
      } else if (purchasedIds.includes('glass-premium-all-access')) {
        owned = true
        errorMsg = 'You already own the Lifetime All-Access Pass. You can purchase the Glass Analyzer separately.'
      }
    } else {
      if (purchasedIds.includes(productId)) {
        owned = true
      } else if (purchasedIds.includes('glass-premium-all-access') || purchasedIds.includes('glass-mega-bundle')) {
        owned = true
        errorMsg = 'You already own the Lifetime All-Access Pass (all presets unlocked).'
      }
    }

    if (owned) {
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    // Create Razorpay Order
    const amountInCents = Math.round(Number(product.price) * 100)

    const order = await razorpay.orders.create({
      amount: amountInCents,
      currency: 'USD',
      receipt: `rcp_${user.id.substring(0, 8)}_${productId.substring(0, 20)}`,
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
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      userEmail: user.email,
    })
  } catch (error: unknown) {
    console.error('[RAZORPAY_CHECKOUT_API_ERROR]:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
