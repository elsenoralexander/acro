'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import { useCatalog } from '@/lib/useCatalog'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/motion'

export default function CarritoPage() {
  const { items, removeItem, count } = useCart()
  const { getPrice } = useCatalog()
  const router = useRouter()

  const total = items.reduce((acc, { product }) => acc + getPrice(product.id, product.price), 0)

  return (
    <>
      <div className="min-h-screen bg-chalk text-ink pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-ink/40 font-sans mb-4">
            Carrito / Cart
          </p>
          <h1 className="font-bebas text-[10vw] md:text-6xl leading-none mb-16">
            {count === 0 ? 'VACÍO' : `${count} PIEZA${count > 1 ? 'S' : ''}`}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-sm text-ink/60 mb-8">
                Tu carrito está vacío.
                <br />
                <em className="text-ink/45">Your cart is empty.</em>
              </p>
              <Link
                href="/coleccion"
                className="press inline-block font-bebas text-xl tracking-[0.2em] border-2 border-ink px-8 py-3 hover:bg-ink hover:text-chalk transition-colors duration-300"
              >
                Ver Colección
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-8 mb-12">
                {items.map(({ product }, i) => (
                  <Reveal as="div" key={product.id} delay={i * 0.06} y={24}>
                  <div className="flex items-center gap-6 border-b border-ink/10 pb-8">
                    {/* Thumbnail — recorte sobre el color de la pieza */}
                    <div
                      className="w-24 h-24 flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: product.theme.bg }}
                    >
                      <Image
                        src={product.cutout ?? product.images.main}
                        alt={`ACRO ${product.number}`}
                        width={120}
                        height={120}
                        className="w-[78%] h-[78%] object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bebas text-3xl text-ink">{product.number}</span>
                          <p className="font-sans text-xs text-ink/65 mt-0.5">
                            {product.copy.es.tagline.split('.')[0]}
                          </p>
                          <p className="font-sans text-[9px] text-ink/30 tracking-[0.3em] uppercase mt-1">
                            Pieza Única
                          </p>
                        </div>
                        <span className="font-bebas text-2xl text-ink">{getPrice(product.id, product.price)}€</span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label={`Quitar pieza ${product.number} del carrito`}
                      className="press text-ink/55 hover:text-ink transition-colors font-sans text-xs tracking-wider uppercase -m-2 p-2"
                    >
                      Quitar
                    </button>
                  </div>
                  </Reveal>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-ink pt-8 flex items-center justify-between mb-10">
                <span className="font-sans text-sm text-ink/60 uppercase tracking-widest">Total</span>
                <span className="font-bebas text-4xl text-ink">{total}€</span>
              </div>

              {/* Note */}
              <p className="font-sans text-xs text-ink/60 mb-8 leading-relaxed">
                Las piezas ACRO son únicas. Una vez vendida, no habrá otra igual.
                <br />
                <em className="text-ink/45">ACRO pieces are unique. Once sold, there will never be another.</em>
              </p>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="press w-full font-bebas text-2xl tracking-[0.2em] py-5 bg-ink text-chalk hover:opacity-80 transition-opacity duration-300"
              >
                Finalizar Compra / Checkout
              </button>

              <Link
                href="/coleccion"
                className="block text-center mt-4 font-sans text-xs text-ink/55 hover:text-ink transition-colors tracking-wider uppercase py-2"
              >
                ← Seguir viendo
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
