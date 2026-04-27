import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { CartItem } from '@/lib/cart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `ACRO ${item.product.number} — Pieza Única`,
          description: item.product.copy.es.tagline,
          images: [`${baseUrl}${item.product.images.main}`],
          metadata: {
            productId: item.product.id,
            serial: `#P${item.product.number}-001`,
          },
        },
        unit_amount: item.product.price * 100, // cents
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/carrito`,
      locale: 'es',
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'PT', 'GB', 'DE', 'IT', 'BE', 'NL'],
      },
      metadata: {
        items: JSON.stringify(items.map((i) => i.product.id)),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Stripe error:', err)
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
