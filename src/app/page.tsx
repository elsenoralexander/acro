'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product3D } from '@/components/Product3D'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen bg-ink flex flex-col items-center justify-center overflow-hidden">
        {/* Background grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#F5F5F0 1px, transparent 1px), linear-gradient(90deg, #F5F5F0 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Logo */}
          <div className="animate-intro mb-8">
            <Image
              src="/images/logo-white.png"
              alt="ACRO"
              width={180}
              height={90}
              className="h-20 md:h-28 w-auto object-contain"
              priority
            />
          </div>

          {/* Main headline */}
          <h1 className="font-bebas text-[18vw] md:text-[14vw] leading-none text-chalk animate-slide-up animate-slide-up-delay-1 tracking-tight">
            ACRO
          </h1>

          <p className="text-xs md:text-sm tracking-[0.5em] uppercase text-chalk/50 animate-slide-up animate-slide-up-delay-2 font-sans mt-2">
            Donostia — Crochet Artesanal
          </p>

          {/* Divider */}
          <div className="mt-10 w-px h-16 bg-chalk/20 animate-slide-up animate-slide-up-delay-3" />

          <p className="mt-6 text-xs tracking-[0.4em] uppercase text-chalk/30 font-sans animate-slide-up animate-slide-up-delay-3">
            Scroll
          </p>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────── */}
      <section className="bg-chalk text-ink py-28 md:py-40 px-6 md:px-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="reveal text-[10px] tracking-[0.5em] uppercase text-ink/40 font-sans mb-8">
            Sobre ACRO
          </p>
          <h2 className="reveal font-bebas text-[12vw] md:text-[8vw] leading-none mb-6">
            CADA PIEZA
            <br />
            <span className="text-ink/20">UNA SOLA VEZ.</span>
          </h2>
          <p className="reveal text-sm md:text-base font-sans text-ink/60 max-w-lg leading-relaxed animate-slide-up-delay-1 mt-8">
            No somos una cadena. No tenemos fábrica. Somos dos manos en Donostia
            creando complementos que ninguna máquina puede hacer. Crochet
            artesanal. Materiales seleccionados. Piezas que se llevan con
            Off-White, con LV, con Corteiz — o con lo que te dé la gana.
          </p>
          <p className="reveal text-sm md:text-base font-sans text-ink/40 max-w-lg leading-relaxed mt-4">
            We are not a chain. We have no factory. We are two hands in Donostia
            creating accessories no machine can make. Artisanal crochet. Curated
            materials. Pieces worn with Off-White, LV, Corteiz — or whatever you
            damn please.
          </p>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────── */}
      <div className="bg-ink border-y border-chalk/10 py-4 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-8 font-bebas text-2xl text-chalk/20 tracking-widest"
            >
              PIEZA ÚNICA
              <span className="text-chalk/10">·</span>
              ONE OF A KIND
              <span className="text-chalk/10">·</span>
              DONOSTIA
              <span className="text-chalk/10">·</span>
              CROCHET ARTESANAL
              <span className="text-chalk/10">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3D SHOWCASE ───────────────────────────────── */}
      <section className="bg-ink">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bebas text-[30vw] text-chalk/[0.02] select-none">02</span>
          </div>
          <Product3D
            src="/images/product-02.png"
            alt="ACRO 02"
            className="relative z-10 w-72 md:w-96 lg:w-[420px]"
          />
        </div>
        {/* Scroll space for the 3D effect */}
        <div className="h-[200vh]" />
      </section>

      {/* ── COLECCIÓN ─────────────────────────────────── */}
      <section className="bg-chalk py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[10px] tracking-[0.5em] uppercase text-ink/40 font-sans mb-16">
            Colección / Collection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {products.map((p) => (
              <Link key={p.id} href={`/coleccion/${p.id}`} className="group block">
                <article
                  className="reveal relative overflow-hidden aspect-square flex items-center justify-center"
                  style={{ backgroundColor: p.theme.bg }}
                >
                  {/* Product number watermark */}
                  <span
                    className="absolute font-bebas text-[18vw] md:text-[12vw] select-none"
                    style={{ color: p.theme.text, opacity: 0.05 }}
                  >
                    {p.number}
                  </span>

                  {/* Product image */}
                  <Image
                    src={p.images.main}
                    alt={`ACRO ${p.number}`}
                    width={500}
                    height={500}
                    className="relative z-10 w-3/4 h-3/4 object-contain transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span
                      className="font-bebas text-lg tracking-widest px-6 py-2 border"
                      style={{
                        color: p.theme.text,
                        borderColor: p.theme.text,
                        backgroundColor: p.theme.bg,
                      }}
                    >
                      Ver pieza
                    </span>
                  </div>
                </article>

                {/* Card info */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span
                      className="font-bebas text-3xl"
                      style={{ color: p.theme.text !== '#F5F5F0' ? p.theme.text : '#0A0A0A' }}
                    >
                      {p.number}
                    </span>
                    <p className="text-xs text-ink/50 font-sans tracking-wider mt-0.5">
                      {p.copy.es.tagline.split('.')[0]}
                    </p>
                  </div>
                  <span className="font-bebas text-2xl text-ink">
                    {p.price}€
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK STRIP ────────────────────────────── */}
      <section className="bg-ink py-16">
        <p className="reveal px-6 md:px-10 text-[10px] tracking-[0.5em] uppercase text-chalk/30 font-sans mb-8">
          Lookbook
        </p>
        <div className="scroll-gallery px-6 md:px-10">
          {[...products[0].shooting, ...products[1].shooting].map((src, i) => (
            <div
              key={i}
              className="reveal relative h-72 md:h-96 w-56 md:w-72 flex-shrink-0 overflow-hidden"
            >
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

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="bg-chalk text-ink py-24 md:py-36 px-6 flex flex-col items-center text-center">
        <div className="reveal unique-stamp text-ink mb-10">
          Pieza Única · One of a Kind
        </div>
        <h2 className="reveal font-bebas text-[12vw] md:text-[8vw] leading-none mb-8">
          ELIGE LA TUYA
        </h2>
        <Link
          href="/coleccion"
          className="reveal inline-block font-bebas text-lg tracking-[0.3em] px-10 py-4 border-2 border-ink text-ink hover:bg-ink hover:text-chalk transition-colors duration-300"
        >
          Ver Colección
        </Link>
      </section>

      <Footer />
    </>
  )
}
