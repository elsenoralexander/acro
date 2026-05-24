'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/cart'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor de pagos.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (items.length === 0) router.push('/carrito')
  }, [items.length, router])

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-chalk text-ink pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-lg mx-auto">
        <p className="text-[10px] tracking-[0.5em] uppercase text-ink/40 font-sans mb-4">
          Checkout / Pago
        </p>
        <h1 className="font-bebas text-5xl md:text-7xl leading-none mb-16">RESUMEN</h1>

        {/* Order summary */}
        <div className="space-y-6 mb-10">
          {items.map(({ product }) => (
            <div key={product.id} className="flex items-center gap-5 border-b border-ink/10 pb-6">
              <div
                className="w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: product.theme.bg }}
              >
                <Image
                  src={product.cutout ?? product.images.main}
                  alt={`ACRO ${product.number}`}
                  width={100}
                  height={100}
                  className="w-[78%] h-[78%] object-contain"
                />
              </div>
              <div className="flex-1">
                <span className="font-bebas text-2xl">{product.number}</span>
                <p className="font-sans text-xs text-ink/50">Pieza Única · One of a Kind</p>
              </div>
              <span className="font-bebas text-xl">{product.price}€</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t-2 border-ink pt-6 mb-10">
          <span className="font-sans text-xs uppercase tracking-widest text-ink/50">Total</span>
          <span className="font-bebas text-4xl">{total}€</span>
        </div>

        {/* Stripe note */}
        <div className="bg-ink/5 border border-ink/10 rounded-none p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/40">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="font-sans text-xs text-ink/40 tracking-wider uppercase">Pago seguro via Stripe</span>
          </div>
          <p className="font-sans text-xs text-ink/40 leading-relaxed">
            Serás redirigido a Stripe para completar tu pago de forma segura.
            Aceptamos tarjeta de crédito, débito, Apple Pay y Google Pay.
          </p>
        </div>

        {error && (
          <p className="font-sans text-xs text-red-600 mb-6 bg-red-50 border border-red-100 p-4">
            {error}
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full font-bebas text-2xl tracking-[0.2em] py-5 bg-ink text-chalk hover:opacity-80 transition-opacity duration-300 disabled:opacity-40"
        >
          {loading ? 'Procesando...' : 'Pagar con Stripe'}
        </button>

        <p className="font-sans text-[10px] text-ink/30 text-center mt-6 leading-relaxed">
          Pago 100% seguro · Encriptación SSL · No almacenamos datos de tu tarjeta
        </p>
      </div>
    </div>
  )
}
