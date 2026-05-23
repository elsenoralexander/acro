'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { ScrollVideo } from '@/components/ScrollVideo'
import { getProduct } from '@/lib/products'
import { useCart } from '@/lib/cart'
import { useCatalog } from '@/lib/useCatalog'

// Warm off-white surfaces — keep all light sections in one cohesive palette
const LIGHT_SURFACE = '#EFE8DA'
const LIGHT_SURFACE_2 = '#E7DECB'

// Perceived brightness of a hex colour — drives light/dark styling robustly
function isDarkColor(hex: string): boolean {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 140
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProduct(params.id as string)
  const { addItem, items } = useCart()
  const { getPrice, getStock } = useCatalog()
  const [added, setAdded] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  const inCart = items.some((i) => i.product.id === product?.id)
  const catalogStock = product ? getStock(product.id) : null
  const outOfStock = catalogStock === 0

  useEffect(() => {
    if (!product) router.push('/coleccion')
  }, [product, router])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!product) return null

  const { copy, theme, images, shooting, price: basePrice, number } = product
  const price = getPrice(product.id, basePrice)
  const is02 = number === '02'
  const isDark = isDarkColor(theme.bg)
  const hasVideo = number === '01' || number === '02'
  const sku = `#${/^\d+$/.test(number) ? 'P' + number : number}-001`
  const videoSrc = `/videos/product-${number}.mp4`
  const heroImage = isDark && images.dark ? images.dark : images.main

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const txtColor = theme.text
  const bgColor = theme.bg
  const mutedColor = isDark ? `rgba(228,232,239,0.3)` : 'rgba(10,10,10,0.3)'

  return (
    <>
      {/* ── HERO ───────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center overflow-hidden"
        style={{ backgroundColor: bgColor, color: txtColor }}
      >
        <span
          className="absolute right-0 bottom-0 font-bebas text-[40vw] leading-none select-none pointer-events-none"
          style={{ color: txtColor, opacity: 0.04 }}
        >
          {number}
        </span>

        {/* Imagen / Video producto */}
        <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center pt-28 md:pt-0 px-10 md:px-16 min-h-[60vh] md:min-h-screen">
          <div className="w-full max-w-sm md:max-w-md aspect-square">
            {hasVideo ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
                poster={images.main}
              />
            ) : (
              <Image
                src={heroImage}
                alt={`ACRO ${number}`}
                width={600}
                height={600}
                className="w-full h-full object-contain"
                priority
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="relative z-10 w-full md:w-1/2 px-8 md:px-16 py-12 md:py-0 flex flex-col justify-center">
          <div
            className="unique-stamp inline-block self-start mb-8"
            style={{ color: txtColor, borderColor: txtColor, opacity: 0.5 }}
          >
            Pieza Única · One of a Kind
          </div>

          <h1 className="font-bebas text-[18vw] md:text-[12vw] leading-none" style={{ color: txtColor }}>
            {number}
          </h1>

          <p className="font-sans text-sm leading-relaxed mt-4 max-w-sm" style={{ color: txtColor, opacity: 0.7 }}>
            {copy.es.tagline}
          </p>
          <p className="font-sans text-xs leading-relaxed mt-2 max-w-sm italic" style={{ color: txtColor, opacity: 0.35 }}>
            {copy.en.tagline}
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-bebas text-5xl" style={{ color: txtColor }}>{price}€</span>
            <span className="font-sans text-xs" style={{ color: txtColor, opacity: 0.35 }}>
              IVA incluido · Envío España
            </span>
          </div>

          {outOfStock ? (
            <div
              className="mt-6 w-full max-w-xs font-bebas text-xl tracking-[0.2em] py-4 px-8 border-2 text-center select-none"
              style={{ borderColor: txtColor, color: txtColor, opacity: 0.3 }}
            >
              Fuera de stock
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={inCart || catalogStock === null}
              className="mt-6 w-full max-w-xs font-bebas text-xl tracking-[0.2em] py-4 px-8 border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-40"
              style={{
                borderColor: txtColor,
                color: inCart ? bgColor : txtColor,
                backgroundColor: inCart ? txtColor : 'transparent',
              }}
            >
              {inCart ? '✓ En el carrito' : added ? '✓ Añadido' : 'Añadir al carrito'}
            </button>
          )}

          {inCart && (
            <button
              onClick={() => router.push('/carrito')}
              className="mt-3 w-full max-w-xs font-sans text-xs tracking-[0.3em] uppercase py-2 opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: txtColor }}
            >
              Ver carrito →
            </button>
          )}
        </div>
      </section>

      {/* ── PRIMERA FOTO — full bleed inmediato, color ── */}
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
        <Image
          src={shooting[0]}
          alt={`ACRO ${number}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay sutil con el número */}
        <div className="absolute inset-0 flex items-end justify-end p-8 md:p-14">
          <span className="font-bebas text-[15vw] text-white/10 leading-none select-none">
            {number}
          </span>
        </div>
      </div>

      {/* ── SPIN SHOWCASE — bolso gigante girando con el scroll ── */}
      {product.spinVideo && (
        <ScrollVideo
          src={product.spinVideo}
          poster={product.spinPoster ?? heroImage}
          scrollHeight="300vh"
          bg={isDark ? bgColor : 'linear-gradient(180deg,#D8C9AE 0%,#C3B393 55%,#D2C4A8 100%)'}
          scrim={isDark ? bgColor : '#CFC0A2'}
          tint={isDark ? undefined : '#E2CFA6'}
          tintOpacity={0.6}
          fadeTop={isDark ? bgColor : '#C7B894'}
          fadeBottom={isDark ? bgColor : LIGHT_SURFACE}
          textColor={isDark ? theme.text : '#241B12'}
          accent={theme.accent}
          eyebrow={`360° · ${copy.es.tagline.split('.')[0]}`}
          title={number}
          sub={copy.es.tagline}
          meta={`${price}€ · Hecho en Donostia`}
          side="right"
        />
      )}

      {/* ── THE WORLD ─────────────────────────── */}
      <section
        className="py-24 md:py-36 px-6 md:px-10"
        style={{ backgroundColor: isDark ? bgColor : LIGHT_SURFACE }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="reveal text-[9px] tracking-[0.6em] uppercase font-sans mb-10" style={{ color: mutedColor }}>
            El mundo del {number} / The world of {number}
          </p>
          <blockquote
            className="reveal font-bebas text-[6vw] md:text-[4.5vw] leading-tight"
            style={{ color: txtColor }}
          >
            {copy.es.world}
          </blockquote>
          <p
            className="reveal font-sans text-sm leading-relaxed mt-10 max-w-lg italic"
            style={{ color: isDark ? 'rgba(228,232,239,0.35)' : 'rgba(10,10,10,0.35)' }}
          >
            {copy.en.world}
          </p>
        </div>
      </section>

      {/* ── DOS FOTOS intercaladas — B&W → color hover ── */}
      {shooting.length > 2 && (
        <div className="grid grid-cols-2 gap-1">
          {[shooting[1], shooting[2]].map((src, i) => (
            <div key={i} className="reveal relative aspect-[3/4] overflow-hidden group">
              <Image
                src={src}
                alt={`ACRO ${number} ${i + 2}`}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.02] group-hover:scale-100"
                sizes="50vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── DETAILS ───────────────────────────── */}
      <section
        className="py-20 px-6 md:px-10"
        style={{ backgroundColor: isDark ? '#0D121F' : LIGHT_SURFACE_2 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="reveal text-[9px] tracking-[0.5em] uppercase font-sans mb-8" style={{ color: mutedColor }}>
              Descripción / Description
            </p>
            <p className="reveal font-sans text-base leading-relaxed" style={{ color: txtColor, opacity: 0.8 }}>
              {copy.es.description}
            </p>
            <p
              className="reveal font-sans text-sm leading-relaxed mt-4 italic"
              style={{ color: isDark ? 'rgba(228,232,239,0.3)' : 'rgba(10,10,10,0.3)' }}
            >
              {copy.en.description}
            </p>
          </div>

          <div>
            <p className="reveal text-[9px] tracking-[0.5em] uppercase font-sans mb-8" style={{ color: mutedColor }}>
              Materiales / Materials
            </p>
            <ul className="space-y-4">
              {copy.es.details.map((d, i) => (
                <li
                  key={i}
                  className="reveal font-sans text-sm flex items-center gap-3"
                  style={{ color: txtColor }}
                >
                  <span className="w-px h-4 flex-shrink-0" style={{ backgroundColor: theme.accent }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOTO ÚNICA — full bleed, color ───── */}
      {shooting[3] && (
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden">
          <Image
            src={shooting[3]}
            alt={`ACRO ${number} lookbook`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* ── RESTO DE FOTOS — grid B&W → color ── */}
      {shooting.length > 4 && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-1 p-1"
          style={{ backgroundColor: is02 ? '#0A0A0A' : LIGHT_SURFACE }}
        >
          {shooting.slice(4).map((src, i) => (
            <div key={i} className="reveal relative aspect-square overflow-hidden group">
              <Image
                src={src}
                alt={`ACRO ${number} ${i + 5}`}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.02] group-hover:scale-100"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── BOTTOM CTA ────────────────────────── */}
      <section
        className="py-24 px-6 flex flex-col items-center text-center"
        style={{ backgroundColor: bgColor, color: txtColor }}
      >
        <div
          className="unique-stamp inline-block mb-10"
          style={{ color: txtColor, borderColor: txtColor, opacity: 0.4 }}
        >
          Pieza Única · {sku}
        </div>
        <p className="font-bebas text-6xl md:text-8xl mb-2" style={{ color: txtColor }}>
          {price}€
        </p>
        <p className="font-sans text-xs mb-12" style={{ color: txtColor, opacity: 0.35 }}>
          {outOfStock ? 'Pieza agotada · Sold out' : 'Una sola unidad disponible · Only one available'}
        </p>
        {outOfStock ? (
          <div
            className="font-bebas text-2xl tracking-[0.2em] py-5 px-14 border-2 select-none"
            style={{ borderColor: txtColor, color: txtColor, opacity: 0.25 }}
          >
            Fuera de stock
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={inCart || catalogStock === null}
            className="font-bebas text-2xl tracking-[0.2em] py-5 px-14 border-2 transition-all duration-300 hover:opacity-70 disabled:opacity-30"
            style={{
              borderColor: txtColor,
              color: inCart ? bgColor : txtColor,
              backgroundColor: inCart ? txtColor : 'transparent',
            }}
          >
            {inCart ? '✓ En el carrito' : 'Añadir al carrito'}
          </button>
        )}
      </section>

      <Footer />
    </>
  )
}
