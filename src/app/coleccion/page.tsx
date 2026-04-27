import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'

export const metadata = {
  title: 'Colección — ACRO',
  description: 'Colección ACRO. Piezas únicas hechas a mano en Donostia. Una pieza, una vez.',
}

export default function ColeccionPage() {
  return (
    <>
      <div className="min-h-screen bg-chalk text-ink pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.5em] uppercase text-ink/40 font-sans mb-4">
              Colección / Collection
            </p>
            <h1 className="font-bebas text-[12vw] md:text-[8vw] leading-none">
              PIEZAS
              <br />
              <span className="text-ink/20">ÚNICAS</span>
            </h1>
            <p className="font-sans text-sm text-ink/40 mt-6 max-w-md leading-relaxed">
              Cuando se vende, desaparece. No hay reposición.
              <br />
              <em className="opacity-60">When it sells, it disappears. No restock.</em>
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {products.map((p, idx) => (
              <Link key={p.id} href={`/coleccion/${p.id}`} className="group">
                <article className="relative">
                  {/* Image container */}
                  <div
                    className="relative aspect-square overflow-hidden flex items-center justify-center mb-6"
                    style={{ backgroundColor: p.theme.bg }}
                  >
                    {/* Number watermark */}
                    <span
                      className="absolute font-bebas text-[20vw] md:text-[14vw] select-none"
                      style={{ color: p.theme.text, opacity: 0.04 }}
                    >
                      {p.number}
                    </span>

                    <Image
                      src={p.images.main}
                      alt={`ACRO ${p.number}`}
                      width={600}
                      height={600}
                      className="relative z-10 w-4/5 h-4/5 object-contain transition-all duration-700 group-hover:scale-[1.03]"
                    />

                    {/* Unique badge */}
                    <div
                      className="absolute top-4 right-4 z-20 px-2 py-1 text-[8px] tracking-[0.3em] uppercase font-sans border"
                      style={{
                        color: p.theme.text,
                        borderColor: p.theme.text,
                        backgroundColor: p.theme.bg,
                        opacity: 0.8,
                      }}
                    >
                      Pieza Única
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-bebas text-4xl text-ink">{p.number}</span>
                        <span className="text-[9px] tracking-[0.4em] uppercase text-ink/30 font-sans">
                          Pieza Única
                        </span>
                      </div>
                      <p className="text-xs font-sans text-ink/60 leading-relaxed max-w-xs">
                        {p.copy.es.tagline}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="font-bebas text-3xl text-ink">{p.price}€</span>
                      <p className="text-[9px] text-ink/40 font-sans tracking-wider mt-1">
                        IVA incluido
                      </p>
                    </div>
                  </div>

                  {/* CTA line */}
                  <div className="mt-6 overflow-hidden h-px bg-ink/10 relative">
                    <div className="absolute left-0 top-0 h-full w-0 bg-ink group-hover:w-full transition-all duration-500 ease-in-out" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-ink/30 group-hover:text-ink transition-colors duration-300">
                      Descubrir / Discover
                    </span>
                    <span className="text-ink/30 group-hover:text-ink transition-colors duration-300 transform group-hover:translate-x-1 inline-block">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
