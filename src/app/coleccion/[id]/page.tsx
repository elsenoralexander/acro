'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { getProduct } from '@/lib/products'
import { useCart } from '@/lib/cart'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProduct(params.id as string)
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  const inCart = items.some((i) => i.product.id === product?.id)

  useEffect(() => {
    if (!product) router.push('/coleccion')
  }, [product, router])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!product) return null

  const { copy, theme, images, shooting, price, number } = product
  const is02 = number === '02'
  const videoSrc = `/videos/product-${number}.mp4`

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      {/* ── HERO ───────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center overflow-hidden"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        {/* Background number */}
        <span
          className="absolute right-0 bottom-0 font-bebas text-[40vw] leading-none select-none pointer-events-none"
          style={{ color: theme.text, opacity: 0.04 }}
        >
          {number}
        </span>

        {/* Left — vídeo rotación */}
        <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center pt-28 md:pt-0 px-10 md:px-16 min-h-[60vh] md:min-h-screen">
          <div
            className="w-full max-w-sm md:max-w-md aspect-square"
            style={{ filter: is02 ? 'drop-shadow(0 0 60px rgba(192,192,192,0.12))' : 'drop-shadow(0 20px 60px rgba(0,0,0,0.15))' }}
          >
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
              poster={images.main}
            />
          </div>
        </div>

        {/* Right — info */}
        <div className="relative z-10 w-full md:w-1/2 px-8 md:px-16 py-12 md:py-0 flex flex-col justify-center">
          {/* Unique stamp */}
          <div
            className="unique-stamp inline-block self-start mb-8"
            style={{ color: theme.text, borderColor: theme.text, opacity: 0.7 }}
          >
            Pieza Única · One of a Kind
          </div>

          {/* Number */}
          <h1
            className="font-bebas text-[18vw] md:text-[12vw] leading-none"
            style={{ color: theme.text }}
          >
            {number}
          </h1>

          {/* Tagline */}
          <p
            className="font-sans text-sm leading-relaxed mt-4 max-w-sm"
            style={{ color: theme.text, opacity: 0.7 }}
          >
            {copy.es.tagline}
          </p>
          <p
            className="font-sans text-xs leading-relaxed mt-2 max-w-sm italic"
            style={{ color: theme.text, opacity: 0.4 }}
          >
            {copy.en.tagline}
          </p>

          {/* Price */}
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-bebas text-5xl" style={{ color: theme.text }}>
              {price}€
            </span>
            <span className="font-sans text-xs" style={{ color: theme.text, opacity: 0.4 }}>
              IVA incluido · Free shipping Spain
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={inCart}
            className="mt-6 w-full max-w-xs font-bebas text-xl tracking-[0.2em] py-4 px-8 border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-50"
            style={{
              borderColor: theme.text,
              color: inCart ? theme.bg : theme.text,
              backgroundColor: inCart ? theme.text : 'transparent',
            }}
          >
            {inCart ? '✓ En el carrito' : added ? '✓ Añadido' : 'Añadir al carrito'}
          </button>

          {inCart && (
            <button
              onClick={() => router.push('/carrito')}
              className="mt-3 w-full max-w-xs font-sans text-xs tracking-[0.3em] uppercase py-2 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: theme.text }}
            >
              Ver carrito →
            </button>
          )}
        </div>
      </section>

      {/* ── THE WORLD ─────────────────────────── */}
      <section
        className="py-28 md:py-40 px-6 md:px-10"
        style={{ backgroundColor: is02 ? '#0A0A0A' : '#F5F5F0' }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="reveal text-[10px] tracking-[0.5em] uppercase font-sans mb-10"
            style={{ color: is02 ? 'rgba(245,245,240,0.3)' : 'rgba(10,10,10,0.3)' }}
          >
            El mundo del {number} / The world of {number}
          </p>
          <blockquote
            className="reveal font-bebas text-[6vw] md:text-[4.5vw] leading-tight"
            style={{ color: is02 ? '#F5F5F0' : '#0A0A0A' }}
          >
            {copy.es.world}
          </blockquote>
          <p
            className="reveal font-sans text-sm leading-relaxed mt-10 max-w-lg italic"
            style={{ color: is02 ? 'rgba(245,245,240,0.4)' : 'rgba(10,10,10,0.4)' }}
          >
            {copy.en.world}
          </p>
        </div>
      </section>

      {/* ── DETAILS ───────────────────────────── */}
      <section
        className="py-20 px-6 md:px-10 border-t"
        style={{
          backgroundColor: is02 ? '#111' : '#EDEDE8',
          borderColor: is02 ? 'rgba(245,245,240,0.1)' : 'rgba(10,10,10,0.1)',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="reveal text-[10px] tracking-[0.5em] uppercase font-sans mb-8"
              style={{ color: is02 ? 'rgba(245,245,240,0.3)' : 'rgba(10,10,10,0.3)' }}
            >
              Descripción / Description
            </p>
            <p
              className="reveal font-sans text-base leading-relaxed"
              style={{ color: is02 ? '#F5F5F0' : '#0A0A0A', opacity: 0.8 }}
            >
              {copy.es.description}
            </p>
            <p
              className="reveal font-sans text-sm leading-relaxed mt-4 italic"
              style={{ color: is02 ? 'rgba(245,245,240,0.35)' : 'rgba(10,10,10,0.35)' }}
            >
              {copy.en.description}
            </p>
          </div>

          <div>
            <p
              className="reveal text-[10px] tracking-[0.5em] uppercase font-sans mb-8"
              style={{ color: is02 ? 'rgba(245,245,240,0.3)' : 'rgba(10,10,10,0.3)' }}
            >
              Materiales / Materials
            </p>
            <ul className="space-y-3">
              {copy.es.details.map((d, i) => (
                <li
                  key={i}
                  className="reveal font-sans text-sm flex items-center gap-3"
                  style={{ color: is02 ? '#F5F5F0' : '#0A0A0A' }}
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: theme.accent }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SHOOTING GALLERY ──────────────────── */}
      <section
        className="py-16"
        style={{ backgroundColor: is02 ? '#0A0A0A' : '#F5F5F0' }}
      >
        <p
          className="px-6 md:px-10 text-[10px] tracking-[0.5em] uppercase font-sans mb-8"
          style={{ color: is02 ? 'rgba(245,245,240,0.3)' : 'rgba(10,10,10,0.3)' }}
        >
          Lookbook
        </p>

        {/* First image — full width */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-3">
          <Image
            src={shooting[0]}
            alt={`ACRO ${number} lookbook`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Rest — grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-3">
          {shooting.slice(1).map((src, i) => (
            <div key={i} className="reveal relative aspect-[3/4] overflow-hidden">
              <Image
                src={src}
                alt={`ACRO ${number} lookbook ${i + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────── */}
      <section
        className="py-20 px-6 flex flex-col items-center text-center"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        <div
          className="unique-stamp inline-block mb-10"
          style={{ color: theme.text, borderColor: theme.text, opacity: 0.6 }}
        >
          Pieza Única · #P{number}-001
        </div>
        <p className="font-bebas text-5xl md:text-7xl mb-2" style={{ color: theme.text }}>
          {price}€
        </p>
        <p className="font-sans text-xs mb-10" style={{ color: theme.text, opacity: 0.4 }}>
          Una sola unidad disponible · Only one available
        </p>
        <button
          onClick={handleAdd}
          disabled={inCart}
          className="font-bebas text-2xl tracking-[0.2em] py-5 px-14 border-2 transition-all duration-300 hover:opacity-70 disabled:opacity-40"
          style={{
            borderColor: theme.text,
            color: inCart ? theme.bg : theme.text,
            backgroundColor: inCart ? theme.text : 'transparent',
          }}
        >
          {inCart ? '✓ En el carrito' : 'Añadir al carrito'}
        </button>
      </section>

      <Footer />
    </>
  )
}
