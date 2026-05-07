'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { products } from '@/lib/products'

type StockData = Record<string, number>

export default function AdminPage() {
  const [stock, setStock] = useState<StockData | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ id: string; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/stock')
      .then((r) => r.json())
      .then(setStock)
      .catch(() => setStock({}))
  }, [])

  async function updateStock(productId: string, quantity: number) {
    setSaving(productId)
    setMessage(null)

    const res = await fetch('/api/stock', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })

    if (res.ok) {
      const data = await res.json()
      setStock(data.stock)
      setMessage({ id: productId, text: 'Guardado' })
      setTimeout(() => setMessage(null), 2000)
    } else if (res.status === 401) {
      router.push('/admin/login')
    } else {
      setMessage({ id: productId, text: 'Error al guardar' })
    }

    setSaving(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-bebas text-[9px] tracking-[0.6em] uppercase text-white/25 mb-1">
              ACRO · Panel interno
            </p>
            <h1 className="font-bebas text-6xl text-white leading-none">STOCK</h1>
          </div>
          <button
            onClick={handleLogout}
            className="font-sans text-xs text-white/30 hover:text-white/70 tracking-[0.2em] uppercase transition-colors"
          >
            Salir
          </button>
        </div>

        {/* Stock table */}
        {!stock ? (
          <p className="font-sans text-sm text-white/30 tracking-widest">Cargando...</p>
        ) : (
          <div className="space-y-px">
            {products.map((p) => {
              const qty = stock[p.id] ?? 0
              const isOut = qty === 0

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-6 bg-white/[0.03] border border-white/8 px-6 py-5"
                >
                  {/* Product info */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-bebas text-3xl text-white leading-none">{p.number}</span>
                      <span className="font-sans text-xs text-white/30">{p.price}€</span>
                    </div>
                    <p className="font-sans text-[10px] text-white/25 mt-0.5 tracking-wide">
                      {p.copy.es.tagline.split('.')[0]}
                    </p>
                  </div>

                  {/* Stock status badge */}
                  <div className="flex items-center gap-2">
                    {isOut ? (
                      <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-red-400/80 border border-red-400/30 px-2 py-0.5">
                        Agotado
                      </span>
                    ) : (
                      <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-emerald-400/80 border border-emerald-400/30 px-2 py-0.5">
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => updateStock(p.id, Math.max(0, qty - 1))}
                      disabled={saving === p.id || qty === 0}
                      className="w-9 h-9 border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all font-sans text-lg flex items-center justify-center disabled:opacity-25"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bebas text-2xl text-white select-none">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateStock(p.id, qty + 1)}
                      disabled={saving === p.id}
                      className="w-9 h-9 border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all font-sans text-lg flex items-center justify-center disabled:opacity-25"
                    >
                      +
                    </button>
                  </div>

                  {/* Feedback */}
                  <div className="w-16 text-right">
                    {saving === p.id ? (
                      <span className="font-sans text-[9px] text-white/30 tracking-widest">...</span>
                    ) : message?.id === p.id ? (
                      <span className="font-sans text-[9px] text-emerald-400/70 tracking-widest">
                        {message.text}
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Note */}
        <p className="mt-10 font-sans text-[9px] text-white/15 tracking-wide leading-relaxed">
          Los cambios se aplican inmediatamente.
          <br />
          Si el stock está a 0, el producto aparece como &ldquo;Fuera de stock&rdquo; en la tienda.
        </p>
      </div>
    </div>
  )
}
