import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'
import { getAllStock } from '@/lib/stock'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Colección — ACRO',
  description: 'Colección ACRO. Piezas únicas hechas a mano en Donostia. Una pieza, una vez.',
}

export default async function ColeccionPage() {
  const stock = await getAllStock()

  return (
    <>
      <div className="min-h-screen bg-white text-ink pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-20">
            <p className="text-[9px] tracking-[0.6em] uppercase text-ink/30 font-sans mb-4">
              Colección / Collection
            </p>
            <h1 className="font-bebas text-[12vw] md:text-[8vw] leading-none text-ink">
              PIEZAS
              <br />
              <span className="text-ink/15">ÚNICAS</span>
            </h1>
            <p className="font-sans text-sm text-ink/35 mt-6 max-w-sm leading-relaxed">
              Cuando se vende, desaparece. No hay reposición.
              <br />
              <em className="opacity-60">When it sells, it disappears. No restock.</em>
            </p>
          </div>

          {/* Products — sin fondos de color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {products.map((p) => {
              const qty = stock[p.id] ?? 0
              const outOfStock = qty === 0
              return (
                <Link key={p.id} href={`/coleccion/${p.id}`} className="group block">
                  <article>
                    {/* Imagen — solo sobre blanco */}
                    <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-white">
                      <span className="absolute font-bebas text-[22vw] md:text-[15vw] select-none pointer-events-none text-ink/[0.03] leading-none">
                        {p.number}
                      </span>
                      <Image
                        src={p.images.main}
                        alt={`ACRO ${p.number}`}
                        width={600}
                        height={600}
                        className={`relative z-10 w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-[1.03] ${outOfStock ? 'grayscale opacity-40' : ''}`}
                      />
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bebas text-sm tracking-[0.4em] uppercase text-ink/60 border border-ink/20 px-4 py-1.5 bg-white/80 backdrop-blur-sm">
                            Fuera de stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Separador animado */}
                    <div className="mt-6 h-px bg-ink/8 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-0 bg-ink group-hover:w-full transition-all duration-500" />
                    </div>

                    {/* Info */}
                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="font-bebas text-5xl text-ink leading-none">{p.number}</span>
                        <p className="text-[9px] text-ink/30 font-sans tracking-widest uppercase mt-1">
                          {outOfStock ? 'Agotado' : `Una unidad · ${p.copy.es.tagline.split('.')[0]}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bebas text-3xl ${outOfStock ? 'text-ink/30' : 'text-ink'}`}>{p.price}€</span>
                        <p className="text-[9px] text-ink/25 font-sans tracking-wider mt-1">IVA inc.</p>
                      </div>
                    </div>

                    <p className="mt-3 text-[9px] tracking-[0.4em] uppercase font-sans text-ink/20 group-hover:text-ink/50 transition-colors duration-300">
                      {outOfStock ? 'Ver pieza' : 'Descubrir →'}
                    </p>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
