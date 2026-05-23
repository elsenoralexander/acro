'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/* ════════════════════════════════════════════════════════════════
   ConvergeScene — images fly in from the sides and converge into a
   fanned cluster as you scroll, while a headline assembles behind.
   (The alliahealth "phones from the sides" effect, ACRO-style.)
   ════════════════════════════════════════════════════════════════ */

function ConvergeItem({
  progress,
  index,
  total,
  src,
}: {
  progress: MotionValue<number>
  index: number
  total: number
  src: string
}) {
  const side = index % 2 === 0 ? -1 : 1
  const mid = (total - 1) / 2
  const startX = `${side * 135}vw`
  const targetX = `${(index - mid) * 10}vw`
  const startRot = `${side * -22}deg`
  const targetRot = `${(index - mid) * 4}deg`

  const x = useTransform(progress, [0.02, 0.55], [startX, targetX])
  const rotate = useTransform(progress, [0.02, 0.55], [startRot, targetRot])
  const scale = useTransform(progress, [0.02, 0.55], [0.65, 1])
  const yOff = index % 2 === 0 ? '-3vh' : '4vh'

  return (
    <motion.div
      style={{ x, rotate, scale, y: yOff, zIndex: index }}
      className="absolute w-[58vw] sm:w-[40vw] md:w-[24vw] aspect-[3/4] overflow-hidden shadow-2xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
    </motion.div>
  )
}

export function ConvergeScene({
  images,
  height = '300vh',
  bg = '#0A0A0A',
  textColor = '#F5F5F0',
  eyebrow,
  title,
  sub,
}: {
  images: string[]
  height?: string
  bg?: string
  textColor?: string
  eyebrow?: string
  title?: string
  sub?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.68, 0.92, 1], [0, 1, 1, 0.6])
  const titleScale = useTransform(scrollYProgress, [0.5, 0.7], [1.15, 1])
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.08, 0.45, 0.55], [0, 1, 1, 0])

  return (
    <section ref={ref} style={{ height, background: bg }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Headline behind the cluster */}
        {title && (
          <motion.h2
            style={{ opacity: titleOpacity, scale: titleScale, color: textColor }}
            className="absolute z-0 font-bebas leading-[0.82] text-center px-6 text-[16vw] md:text-[11vw] pointer-events-none select-none"
          >
            {title.split('\n').map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </motion.h2>
        )}

        {/* Converging images */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {images.slice(0, 6).map((src, i) => (
            <ConvergeItem key={i} progress={scrollYProgress} index={i} total={Math.min(images.length, 6)} src={src} />
          ))}
        </div>

        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            style={{ opacity: eyebrowOpacity }}
            className="absolute top-[12vh] left-1/2 -translate-x-1/2 text-center px-6 z-20"
          >
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.55em] uppercase" style={{ color: textColor, opacity: 0.6 }}>
              {eyebrow}
            </span>
          </motion.div>
        )}

        {/* Sub caption */}
        {sub && (
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 text-center px-6 z-20"
          >
            <p className="font-sans text-sm md:text-base leading-relaxed max-w-md" style={{ color: textColor, opacity: 0.7 }}>
              {sub}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   HorizontalGallery — pins and scrolls a row of images sideways as
   you scroll vertically. Classic Awwwards horizontal-scroll beat.
   ════════════════════════════════════════════════════════════════ */

export function HorizontalGallery({
  images,
  height = '320vh',
  bg = '#0A0A0A',
  textColor = '#F5F5F0',
  label,
}: {
  images: string[]
  height?: string
  bg?: string
  textColor?: string
  label?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setShift(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [images.length])

  const x = useTransform(scrollYProgress, [0, 1], [0, -shift])

  return (
    <section ref={ref} style={{ height, background: bg }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {label && (
          <div className="absolute top-[10vh] left-6 md:left-10 z-20">
            <span className="font-sans text-[10px] tracking-[0.55em] uppercase" style={{ color: textColor, opacity: 0.5 }}>
              {label}
            </span>
          </div>
        )}
        <motion.div ref={trackRef} style={{ x }} className="flex gap-4 md:gap-6 px-6 md:px-10 will-change-transform">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 h-[58vh] md:h-[66vh] overflow-hidden"
              style={{ width: 'clamp(260px, 46vh, 520px)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute bottom-4 left-4 font-bebas text-3xl" style={{ color: textColor, opacity: 0.85, mixBlendMode: 'difference' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
