'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── HERO — fondo blanco ───────────────────────── */}
      <section className="relative min-h-screen bg-chalk flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="animate-intro mb-6">
            <Image
              src="/images/logo-black.png"
              alt="ACRO"
              width={160}
              height={80}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </div>

          <h1 className="font-bebas text-[22vw] md:text-[16vw] leading-none text-ink animate-slide-up animate-slide-up-delay-1 tracking-tight">
            ACRO
          </h1>

          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-ink/30 animate-slide-up animate-slide-up-delay-2 font-sans mt-3">
            Donostia
          </p>

          <div className="mt-12 w-px h-20 bg-ink/10 animate-slide-up animate-slide-up-delay-3" />
          <p className="mt-4 text-[9px] tracking-[0.5em] uppercase text-ink/20 font-sans animate-slide-up animate-slide-up-delay-3">
            Scroll
          </p>
        </div>
      </section>

      {/* ── MANIFESTO — fondo negro ───────────────────── */}
      <section className="bg-ink text-chalk py-28 md:py-44 px-6 md:px-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="reveal font-bebas text-[12vw] md:text-[8vw] leading-none">
            CADA PIEZA
            <br />
            <span className="text-chalk/15">UNA SOLA VEZ.</span>
          </h2>
          <div className="reveal mt-14 flex flex-col md:flex-row gap-8 md:gap-16 max-w-3xl">
            <p className="font-sans text-sm text-chalk/50 leading-relaxed flex-1">
              No hay fábrica. No hay serie. Existe una, y cuando se va, no vuelve.
              Cada pieza sale de las mismas manos — una a una, en Donostia.
            </p>
            <p className="font-sans text-sm text-chalk/25 leading-relaxed flex-1 italic">
              No factory. No series. There is one, and when it goes, it does not return.
              Each piece comes from the same hands — one by one, in Donostia.
            </p>
          </div>
        </div>
      </section>

      {/* ── MARQUEE — fondo blanco ────────────────────── */}
      <div className="bg-chalk border-y border-ink/8 py-4 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-8 font-bebas text-2xl text-ink/15 tracking-widest"
            >
              PIEZA ÚNICA
              <span className="text-ink/8">·</span>
              ONE OF A KIND
              <span className="text-ink/8">·</span>
              DONOSTIA
              <span className="text-ink/8">·</span>
              HECHO A MANO
              <span className="text-ink/8">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SHOWCASE 3D — fondo negro ─────────────────── */}
      <section className="bg-ink relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Number watermark */}
          <span className="absolute font-bebas text-[35vw] text-chalk/[0.02] select-none pointer-events-none">
            02
          </span>

          {/* Video showcase — swap src when Higgsfield video is ready */}
          <div className="relative z-10 w-72 md:w-96 lg:w-[460px] aspect-square flex items-center justify-center">
            <ShowcaseProduct02 />
          </div>

          {/* Side label */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2">
            <span className="font-bebas text-xs tracking-[0.4em] text-chalk/20 [writing-mode:vertical-rl] rotate-180">
              02 — LUJO LIMITADO
            </span>
          </div>
        </div>
        <div className="h-[200vh]" />
      </section>

      {/* ── COLECCIÓN — fondo blanco ──────────────────── */}
      <section className="bg-chalk py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[9px] tracking-[0.6em] uppercase text-ink/25 font-sans mb-16">
            Colección / Collection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {products.map((p) => (
              <Link key={p.id} href={`/coleccion/${p.id}`} className="group block">
                <article
                  className="reveal relative overflow-hidden aspect-square flex items-center justify-center"
                  style={{ backgroundColor: p.theme.bg }}
                >
                  <span
                    className="absolute font-bebas text-[18vw] md:text-[12vw] select-none pointer-events-none"
                    style={{ color: p.theme.text, opacity: 0.04 }}
                  >
                    {p.number}
                  </span>

                  <Image
                    src={p.images.main}
                    alt={`ACRO ${p.number}`}
                    width={500}
                    height={500}
                    className="relative z-10 w-3/4 h-3/4 object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span
                      className="font-bebas text-sm tracking-[0.35em] px-6 py-2 border"
                      style={{ color: p.theme.text, borderColor: p.theme.text, backgroundColor: p.theme.bg }}
                    >
                      Descubrir
                    </span>
                  </div>
                </article>

                <div className="mt-5 flex items-start justify-between">
                  <div>
                    <span className="font-bebas text-4xl text-ink">{p.number}</span>
                    <p className="text-[10px] text-ink/35 font-sans tracking-wider mt-1 uppercase">
                      Pieza única · {p.price}€
                    </p>
                  </div>
                  <span className="font-sans text-[9px] text-ink/25 tracking-[0.3em] uppercase mt-2">
                    Una unidad
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK — fondo negro ────────────────────── */}
      <section className="bg-ink py-16">
        <p className="px-6 md:px-10 text-[9px] tracking-[0.6em] uppercase text-chalk/20 font-sans mb-8">
          Lookbook
        </p>
        <div className="scroll-gallery px-6 md:px-10">
          {[...products[0].shooting, ...products[1].shooting].map((src, i) => (
            <div key={i} className="relative h-72 md:h-96 w-56 md:w-72 flex-shrink-0 overflow-hidden">
              <Image
                src={src}
                alt={`Lookbook ${i + 1}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 224px, 288px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA — fondo negro ─────────────────────────── */}
      <section className="bg-ink text-chalk py-28 md:py-40 px-6 flex flex-col items-center text-center">
        <div className="reveal unique-stamp border-chalk/30 text-chalk/40 mb-12">
          Una pieza · Una vez · One piece · Once
        </div>
        <h2 className="reveal font-bebas text-[12vw] md:text-[7vw] leading-none mb-10">
          ELIGE LA TUYA
        </h2>
        <Link
          href="/coleccion"
          className="reveal inline-block font-bebas text-xl tracking-[0.3em] px-12 py-4 border border-chalk/30 text-chalk/70 hover:border-chalk hover:text-chalk transition-all duration-400"
        >
          Ver Colección
        </Link>
      </section>

      <Footer />
    </>
  )
}

// Showcase component — uses video if available, otherwise premium static
function ShowcaseProduct02() {
  return (
    <div
      className="w-full h-full relative flex items-center justify-center"
      style={{ filter: 'drop-shadow(0 0 60px rgba(192,192,192,0.12))' }}
    >
      <Image
        src="/images/product-02.png"
        alt="ACRO 02"
        width={460}
        height={460}
        className="w-full h-full object-contain animate-float"
        priority
      />
    </div>
  )
}
