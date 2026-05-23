'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BagScene } from '@/components/BagScene'
import { ConvergeScene, HorizontalGallery } from '@/components/scenes'
import { Reveal, Parallax, Words } from '@/components/motion'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const acroScale = useTransform(heroP, [0, 1], [1, 1.45])
  const acroY = useTransform(heroP, [0, 1], ['0%', '-26%'])
  const acroLetter = useTransform(heroP, [0, 1], ['-0.02em', '0.12em'])
  const heroFade = useTransform(heroP, [0, 0.7], [1, 0])
  const gridY = useTransform(heroP, [0, 1], ['0%', '18%'])

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
            <Image
              src="/images/logo-black.png"
              alt="ACRO"
              width={160}
              height={80}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
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

        <motion.div
          style={{ opacity: heroFade }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.5em] uppercase text-ink/25 font-sans">Scroll</span>
          <motion.div
            className="w-px h-14 bg-ink/15"
            animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────── */}
      <section className="bg-ink text-chalk py-28 md:py-48 px-6 md:px-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bebas text-[12vw] md:text-[8vw] leading-[0.9]">
            <Words text="CADA PIEZA" />
            <br />
            <span className="text-chalk/15">
              <Words text="UNA SOLA VEZ." delay={0.2} />
            </span>
          </h2>
          <div className="mt-14 flex flex-col md:flex-row gap-8 md:gap-16 max-w-3xl">
            <Reveal as="div" className="flex-1" delay={0.1}>
              <p className="font-sans text-sm text-chalk/50 leading-relaxed">
                No hay fábrica. No hay serie. Existe una, y cuando se va, no vuelve.
                Cada pieza sale de las mismas manos — una a una, en Donostia.
              </p>
            </Reveal>
            <Reveal as="div" className="flex-1" delay={0.25}>
              <p className="font-sans text-sm text-chalk/25 leading-relaxed italic">
                No factory. No series. There is one, and when it goes, it does not return.
                Each piece comes from the same hands — one by one, in Donostia.
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
        sub="No hay serie. No hay reposición. Existe una, y cuando se va, no vuelve."
        images={[
          '/images/shoot-04-1.jpg',
          '/images/shoot-01-1.jpg',
          '/images/shoot-02-1.jpg',
          '/images/shoot-04-5.jpg',
          '/images/shoot-03-1.png',
          '/images/shoot-04-7.jpg',
        ]}
      />

      {/* ── ESCENA CINEMÁTICA — el bolso POP gira con el scroll ── */}
      <BagScene
        framePrefix="/spin/pop/frame-"
        frameCount={72}
        height="380vh"
        number="POP"
        eyebrow="ACRO · El nuevo POP"
        beats={['CACAO\nTEJIDO', 'CUENTAS\nDE ORO', 'HORA\nDORADA']}
        meta="Pieza Única · 175€ · Donostia"
        accent="#C2A24E"
        textColor="#241B12"
      />

      {/* ── LOOKBOOK — galería horizontal con pin ── */}
      <HorizontalGallery
        bg="#0A0A0A"
        textColor="#F5F5F0"
        label="Lookbook · Toscana"
        images={[
          '/images/shoot-04-2.jpg',
          '/images/shoot-04-3.jpg',
          '/images/shoot-04-4.jpg',
          '/images/shoot-04-6.jpg',
          '/images/shoot-04-8.jpg',
          '/images/shoot-04-1.jpg',
        ]}
      />

      {/* ── COLECCIÓN ────────────────────────────────── */}
      <section className="bg-white py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-[9px] tracking-[0.6em] uppercase text-ink/25 font-sans mb-16">
              Colección / Collection
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.12} y={60}>
                <Link href={`/coleccion/${p.id}`} className="group block">
                  <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-white">
                    <span className="absolute font-bebas text-[20vw] md:text-[14vw] select-none pointer-events-none text-ink/[0.03]">
                      {p.number}
                    </span>
                    <Parallax speed={0.12} className="relative z-10 w-4/5 h-4/5 flex items-center justify-center">
                      <Image
                        src={p.images.main}
                        alt={`ACRO ${p.number}`}
                        width={520}
                        height={520}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.05] mix-blend-multiply"
                      />
                    </Parallax>
                  </div>
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
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-ink text-chalk py-28 md:py-48 px-6 flex flex-col items-center text-center overflow-hidden">
        <Reveal>
          <div className="unique-stamp border-chalk/20 text-chalk/30 mb-12">
            Una pieza · Una vez · Once
          </div>
        </Reveal>
        <h2 className="font-bebas text-[12vw] md:text-[7vw] leading-none mb-10">
          <Words text="ELIGE LA TUYA" />
        </h2>
        <Reveal delay={0.2}>
          <Link
            href="/coleccion"
            className="inline-block font-bebas text-xl tracking-[0.3em] px-12 py-4 border border-chalk/20 text-chalk/60 hover:border-chalk hover:text-chalk transition-all duration-500"
          >
            Ver Colección
          </Link>
        </Reveal>
      </section>

      <Footer />
    </>
  )
}
