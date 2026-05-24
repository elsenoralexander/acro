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
  // Already clearly peeking from the edges at progress 0 — never an empty wait.
  const startX = `${side * 50}vw`
  const targetX = `${(index - mid) * 11}vw`
  const startRot = `${side * -14}deg`
  const targetRot = `${(index - mid) * 4}deg`

  const x = useTransform(progress, [0, 0.42, 1], [startX, targetX, targetX])
  const rotate = useTransform(progress, [0, 0.42], [startRot, targetRot])
  const scale = useTransform(progress, [0, 0.42, 1], [0.78, 1, 1.12])
  const yOff = index % 2 === 0 ? '-3vh' : '4vh'

  return (
    <motion.div
      style={{ x, rotate, scale, y: yOff, zIndex: index }}
      className="absolute w-[62vw] sm:w-[42vw] md:w-[25vw] aspect-[3/4] overflow-hidden shadow-2xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
    </motion.div>
  )
}

export function ConvergeScene({
  images,
  height = '185vh',
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

  const titleOpacity = useTransform(scrollYProgress, [0.34, 0.5, 1], [0, 1, 1])
  const titleScale = useTransform(scrollYProgress, [0.34, 0.54, 1], [1.16, 1, 1.05])
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.06, 0.34, 0.44], [0, 1, 1, 0])

  return (
    <section ref={ref} style={{ height, background: bg }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Converging images */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {images.slice(0, 6).map((src, i) => (
            <ConvergeItem key={i} progress={scrollYProgress} index={i} total={Math.min(images.length, 6)} src={src} />
          ))}
        </div>

        {/* Eyebrow — top */}
        {eyebrow && (
          <motion.div style={{ opacity: eyebrowOpacity }} className="absolute top-[11vh] left-1/2 -translate-x-1/2 text-center px-6 z-30">
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.55em] uppercase" style={{ color: textColor, opacity: 0.6 }}>
              {eyebrow}
            </span>
          </motion.div>
        )}

        {/* Headline OVER the cluster — mix-blend keeps it legible on any photo */}
        {(title || sub) && (
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <div className="mix-blend-difference text-white">
              {title && (
                <h2 className="font-bebas leading-[0.8] text-[22vw] md:text-[14vw]">
                  {title.split('\n').map((l, i) => (
                    <span key={i} className="block">
                      {l}
                    </span>
                  ))}
                </h2>
              )}
              {sub && <p className="font-bebas text-3xl md:text-5xl leading-[0.95] mt-3 max-w-3xl mx-auto">{sub}</p>}
            </div>
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
