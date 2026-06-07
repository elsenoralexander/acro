'use client'

import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'
import { useCatalog } from '@/lib/useCatalog'
import { Reveal, MaskReveal, Words } from '@/components/motion'

export function CollectionGrid() {
  const { getPrice, getStock } = useCatalog()

  return (
    <div className="bg-white text-ink pt-32 md:pt-40 pb-24 px-6 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <Reveal>
            <p className="text-[9px] tracking-[0.6em] uppercase text-ink/30 font-sans mb-5">Colección / Collection</p>
          </Reveal>
          <h1 className="font-bebas text-[16vw] md:text-[9vw] leading-[0.82] text-ink">
            <Words text="PIEZAS" />
            <br />
            <span className="text-ink/15">
              <Words text="ÚNICAS" delay={0.12} />
            </span>
          </h1>
          <Reveal delay={0.2}>
            <p className="font-sans text-sm text-ink/40 mt-8 max-w-sm leading-relaxed">
              Cuando se vende, desaparece. No hay reposición.
              <br />
              <em className="opacity-60">When it sells, it disappears. No restock.</em>
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 md:gap-y-28">
          {products.map((p, i) => {
            const stock = getStock(p.id)
            const outOfStock = stock === 0
            const price = getPrice(p.id, p.price)
            return (
              <Link
                key={p.id}
                href={`/coleccion/${p.id}`}
                data-cursor="view"
                className={`press group block focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/40 ${i % 2 === 1 ? 'md:mt-24' : ''}`}
              >
                <MaskReveal from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08} className="relative aspect-[4/5] overflow-hidden">
                  {/* Colour panel on hover/focus */}
                  <div
                    className="absolute inset-0 scale-[0.97] opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ backgroundColor: p.theme.bg }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bebas text-[34vw] md:text-[18vw] select-none pointer-events-none leading-none text-ink/[0.05]">
                    {p.number}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={p.cutout ?? p.images.main}
                      alt={`ACRO ${p.number}`}
                      width={620}
                      height={760}
                      className={`relative z-10 h-[72%] w-auto object-contain transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-focus-within:scale-[1.06] drop-shadow-xl ${
                        outOfStock ? 'grayscale opacity-50' : ''
                      }`}
                    />
                  </div>

                  {outOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <span className="font-bebas text-sm tracking-[0.4em] uppercase text-ink/70 border border-ink/20 px-4 py-1.5 bg-white/70 backdrop-blur-sm">
                        Fuera de stock
                      </span>
                    </div>
                  )}

                  {/* Info on hover */}
                  {!outOfStock && (
                    <div
                      className="absolute z-20 inset-x-0 bottom-0 p-6 md:p-7 flex items-end justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-500"
                      style={{ color: p.theme.text }}
                    >
                      <div>
                        <span className="font-bebas text-5xl md:text-6xl leading-none block">{p.number}</span>
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-60">{p.copy.es.tagline.split('.')[0]}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bebas text-3xl md:text-4xl">{price}€</span>
                        <span className="block font-sans text-[9px] tracking-[0.4em] uppercase opacity-50 mt-1">Descubrir →</span>
                      </div>
                    </div>
                  )}
                </MaskReveal>

                {/* Always-visible line */}
                <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4 md:opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="font-bebas text-3xl text-ink leading-none">{p.number}</span>
                  <span className={`font-bebas text-2xl ${outOfStock ? 'text-ink/30' : 'text-ink'}`}>{outOfStock ? 'Agotado' : `${price}€`}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
