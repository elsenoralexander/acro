'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ProductScene } from '@/components/ProductScene'
import { ConvergeScene } from '@/components/scenes'
import { Reveal, Parallax, Words, MaskReveal } from '@/components/motion'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const manifestoRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const acroScale = useTransform(heroP, [0, 1], [1, 1.45])
  const acroY = useTransform(heroP, [0, 1], ['0%', '-26%'])
  const acroLetter = useTransform(heroP, [0, 1], ['-0.02em', '0.12em'])
  const heroFade = useTransform(heroP, [0, 0.7], [1, 0])
  const gridY = useTransform(heroP, [0, 1], ['0%', '18%'])

  const { scrollYProgress: manP } = useScroll({ target: manifestoRef, offset: ['start end', 'end start'] })
  const line1X = useTransform(manP, [0, 1], ['-14%', '8%'])
  const line2X = useTransform(manP, [0, 1], ['14%', '-8%'])
  const manDivider = useTransform(manP, [0.2, 0.6], [0, 1])

  const { scrollYProgress: ctaP } = useScroll({ target: ctaRef, offset: ['start end', 'end start'] })
  const ctaScale = useTransform(ctaP, [0, 0.6], [0.9, 1.12])
  const ctaX = useTransform(ctaP, [0, 1], ['6%', '-6%'])

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            y: gridY,
            backgroundImage:
              'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <motion.div style={{ opacity: heroFade }} className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <Image src="/images/logo-black.png" alt="ACRO" width={160} height={80} className="h-16 md:h-20 w-auto object-contain" priority />
          </motion.div>
          <motion.h1
            style={{ scale: acroScale, y: acroY, letterSpacing: acroLetter }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-bebas text-[22vw] md:text-[16vw] leading-none text-ink"
          >
            ACRO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-ink/30 font-sans mt-3"
          >
            Donostia
          </motion.p>
        </motion.div>
        <motion.div style={{ opacity: heroFade }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.5em] uppercase text-ink/25 font-sans">Scroll</span>
          <motion.div className="w-px h-14 bg-ink/15" animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </section>

      {/* ── MANIFESTO — líneas que se desplazan con el scroll ── */}
      <section ref={manifestoRef} className="bg-ink text-chalk py-28 md:py-48 overflow-hidden">
        <div className="px-6 md:px-10">
          <motion.h2 style={{ x: line1X }} className="font-bebas text-[16vw] md:text-[11vw] leading-[0.85] whitespace-nowrap">
            <Words text="CADA PIEZA" />
          </motion.h2>
          <motion.h2 style={{ x: line2X }} className="font-bebas text-[16vw] md:text-[11vw] leading-[0.85] text-chalk/15 whitespace-nowrap text-right">
            <Words text="UNA SOLA VEZ" delay={0.15} />
          </motion.h2>
        </div>
        <div className="max-w-5xl mx-auto px-6 md:px-10 mt-16">
          <motion.div className="h-px bg-chalk/20 origin-left mb-10" style={{ scaleX: manDivider }} />
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 max-w-3xl">
            <Reveal as="div" className="flex-1" delay={0.1}>
              <p className="font-sans text-sm text-chalk/50 leading-relaxed">
                No hay fábrica. No hay serie. Existe una, y cuando se va, no vuelve. Cada pieza sale de las mismas manos — una a una, en Donostia.
              </p>
            </Reveal>
            <Reveal as="div" className="flex-1" delay={0.25}>
              <p className="font-sans text-sm text-chalk/25 leading-relaxed italic">
                No factory. No series. There is one, and when it goes, it does not return. Each piece comes from the same hands — one by one, in Donostia.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <div className="bg-ink border-y border-chalk/8 py-4 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 px-8 font-bebas text-2xl text-chalk/15 tracking-widest">
              PIEZA ÚNICA<span className="text-chalk/8">·</span>ONE OF A KIND<span className="text-chalk/8">·</span>DONOSTIA<span className="text-chalk/8">·</span>HECHO A MANO<span className="text-chalk/8">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CONVERGENCIA — las piezas entran desde los lados y se juntan ── */}
      <ConvergeScene
        bg="#0A0A0A"
        textColor="#F5F5F0"
        eyebrow="Tres piezas · Una intención"
        title={'PIEZA\nÚNICA'}
        sub="EXISTE UNA. CUANDO SE VA, NO VUELVE."
        images={[
          '/images/shoot-04-1.jpg',
          '/images/shoot-01-1.jpg',
          '/images/shoot-02-1.jpg',
          '/images/shoot-04-5.jpg',
          '/images/shoot-03-1.png',
          '/images/shoot-04-7.jpg',
        ]}
      />

      {/* ── ESCENA DEL BOLSO — PNG nítido + motion graphics ── */}
      <ProductScene
        image="/spin/pop-cutout.png"
        alt="ACRO POP"
        height="300vh"
        number="POP"
        eyebrow="ACRO · El nuevo POP"
        beats={['CACAO\nTEJIDO', 'CUENTAS\nDE ORO', 'HORA\nDORADA']}
        meta="Pieza Única · 175€ · Donostia"
        accent="#C2A24E"
        textColor="#241B12"
      />

      {/* ── COLECCIÓN — inmersiva, escalonada ── */}
      <section className="bg-white py-24 md:py-40 px-6 md:px-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bebas text-[14vw] md:text-[8vw] leading-[0.85] text-ink mb-20">
            <Words text="LA COLECCIÓN" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 md:gap-y-32">
            {products.map((p, i) => (
              <Link key={p.id} href={`/coleccion/${p.id}`} className={`group block ${i % 2 === 1 ? 'md:mt-28' : ''}`}>
                <MaskReveal from={i % 2 === 0 ? 'left' : 'right'} className="relative aspect-[4/5] flex items-center justify-center overflow-hidden bg-[#F2F0EB]">
                  <span className="absolute font-bebas text-[26vw] md:text-[16vw] select-none pointer-events-none text-ink/[0.04]">
                    {p.number}
                  </span>
                  <Parallax speed={0.22} className="relative z-10 w-3/4 h-3/4 flex items-center justify-center">
                    <Image
                      src={p.images.main}
                      alt={`ACRO ${p.number}`}
                      width={520}
                      height={520}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.06] mix-blend-multiply"
                    />
                  </Parallax>
                  <span className="absolute bottom-5 right-5 font-sans text-[10px] tracking-[0.4em] uppercase text-ink/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Descubrir →
                  </span>
                </MaskReveal>
                <Reveal delay={0.1}>
                  <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-5">
                    <div>
                      <span className="font-bebas text-6xl text-ink leading-none">{p.number}</span>
                      <p className="text-[10px] text-ink/30 font-sans tracking-widest uppercase mt-1">{p.copy.es.tagline.split('.')[0]}</p>
                    </div>
                    <span className="font-bebas text-4xl text-ink">{p.price}€</span>
                  </div>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — escala y se desplaza con el scroll ── */}
      <section ref={ctaRef} className="bg-ink text-chalk py-32 md:py-52 px-6 flex flex-col items-center text-center overflow-hidden">
        <Reveal>
          <div className="unique-stamp border-chalk/20 text-chalk/30 mb-14">Una pieza · Una vez · Once</div>
        </Reveal>
        <motion.h2 style={{ scale: ctaScale, x: ctaX }} className="font-bebas text-[15vw] md:text-[9vw] leading-none mb-12 whitespace-nowrap">
          ELIGE LA TUYA
        </motion.h2>
        <Reveal delay={0.15}>
          <Link
            href="/coleccion"
            className="group relative inline-flex items-center gap-4 font-bebas text-xl tracking-[0.3em] px-12 py-4 border border-chalk/20 text-chalk/70 hover:text-ink overflow-hidden transition-colors duration-500"
          >
            <span className="absolute inset-0 bg-chalk -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative">Ver Colección</span>
            <span className="relative">→</span>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </>
  )
}
