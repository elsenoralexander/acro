'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollVideo } from '@/components/ScrollVideo'
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
      {/* ── HERO — blanco puro ────────────────────────── */}
      <section className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
        {/* Grid lines sobre blanco */}
        <div
          className="absolute inset-0 opacity-[0.04]"
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

      {/* ── MANIFESTO — negro ─────────────────────────── */}
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

      {/* ── MARQUEE — negro ───────────────────────────── */}
      <div className="bg-ink border-y border-chalk/8 py-4 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-8 font-bebas text-2xl text-chalk/15 tracking-widest"
            >
              PIEZA ÚNICA
              <span className="text-chalk/8">·</span>
              ONE OF A KIND
              <span className="text-chalk/8">·</span>
              DONOSTIA
              <span className="text-chalk/8">·</span>
              HECHO A MANO
              <span className="text-chalk/8">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SCROLL-DRIVEN VIDEO — negro ───────────────── */}
      <ScrollVideo
        src="/videos/product-02.mp4"
        poster="/images/product-02.png"
        className="w-72 md:w-96 lg:w-[460px] aspect-square object-contain"
        scrollHeight="320vh"
        number="02"
        label="02 — LUJO LIMITADO"
      />

      {/* ── COLECCIÓN — blanco puro ───────────────────── */}
      <section className="bg-white py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[9px] tracking-[0.6em] uppercase text-ink/25 font-sans mb-16">
            Colección / Collection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {products.map((p) => (
              <Link key={p.id} href={`/coleccion/${p.id}`} className="group block">
                <article className="reveal relative">
                  {/* Imagen limpia sobre blanco — sin fondo de color */}
                  <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-white">
                    <span
                      className="absolute font-bebas text-[20vw] md:text-[14vw] select-none pointer-events-none text-ink/[0.03]"
                    >
                      {p.number}
                    </span>
                    <Image
                      src={p.images.main}
                      alt={`ACRO ${p.number}`}
                      width={520}
                      height={520}
                      className="relative z-10 w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-[1.03] mix-blend-multiply"
                    />
                  </div>

                  {/* Info bajo la imagen */}
                  <div className="mt-5 flex items-baseline justify-between border-t border-ink/8 pt-5">
                    <div>
                      <span className="font-bebas text-5xl text-ink leading-none">{p.number}</span>
                      <p className="text-[10px] text-ink/30 font-sans tracking-widest uppercase mt-1">
                        Una unidad disponible
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bebas text-3xl text-ink">{p.price}€</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — negro ───────────────────────────────── */}
      <section className="bg-ink text-chalk py-28 md:py-40 px-6 flex flex-col items-center text-center">
        <div className="reveal unique-stamp border-chalk/20 text-chalk/30 mb-12">
          Una pieza · Una vez · Once
        </div>
        <h2 className="reveal font-bebas text-[12vw] md:text-[7vw] leading-none mb-10">
          ELIGE LA TUYA
        </h2>
        <Link
          href="/coleccion"
          className="reveal inline-block font-bebas text-xl tracking-[0.3em] px-12 py-4 border border-chalk/20 text-chalk/60 hover:border-chalk hover:text-chalk transition-all duration-500"
        >
          Ver Colección
        </Link>
      </section>

      <Footer />
    </>
  )
}
