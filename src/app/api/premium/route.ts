import { NextResponse } from 'next/server'
import { createServerSupabase, createAdminClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase()
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Query purchases
    const { data: purchase, error: purchaseError } = await adminSupabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .maybeSingle()

    if (purchaseError) {
      console.error('[PREMIUM_API_DB_ERROR]:', purchaseError)
      return NextResponse.json({ error: 'Database verification error' }, { status: 500 })
    }

    if (!purchase) {
      return NextResponse.json({ error: 'Forbidden. Purchase required to unlock.' }, { status: 403 })
    }

    // Retrieve premium CSS
    const { data: product, error: productError } = await adminSupabase
      .from('products')
      .select('name, premium_css_string')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Premium product content not found.' }, { status: 404 })
    }

    return NextResponse.json({
      productId,
      name: product.name,
      css: product.premium_css_string,
    })
  } catch (error: any) {
    console.error('[PREMIUM_API_ERROR]:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
