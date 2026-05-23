'use client'

import { useRef, useEffect } from 'react'

type Props = {
  src: string
  poster: string
  scrollHeight?: string // scroll travel, e.g. '320vh' — more = slower spin
  bg?: string // section background (color or gradient) — fills any tilt gaps
  textColor?: string
  accent?: string
  scrim?: string // solid color used to build the legibility gradient under the text
  eyebrow?: string
  title?: string // giant word(s)
  sub?: string
  meta?: string
  side?: 'left' | 'right' // which side the bag bleeds toward (text sits opposite)
}

export function ScrollVideo({
  src,
  poster,
  scrollHeight = '320vh',
  bg = '#0A0A0A',
  textColor = '#F5F5F0',
  accent = '#C0C0C0',
  scrim,
  eyebrow,
  title,
  sub,
  meta,
  side = 'right',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)
  const readyRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0

    const onReady = () => {
      readyRef.current = true
    }
    video.addEventListener('canplay', onReady)
    video.load()

    const update = () => {
      const section = sectionRef.current
      if (!video || !section || !readyRef.current || !video.duration) {
        rafRef.current = null
        return
      }
      const rect = section.getBoundingClientRect()
      const travelHeight = section.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / travelHeight))
      video.currentTime = progress * video.duration
      rafRef.current = null
    }

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.removeEventListener('canplay', onReady)
    }
  }, [])

  // Make the bag HUGE and bleed off one edge. object-cover guarantees the
  // viewport is always fully covered by the video's own studio backdrop, so
  // the rectangular frame is never visible — no "pegote", no seams.
  const bleedRight = side === 'right'
  const transform = bleedRight
    ? 'scale(1.62) translateX(14%) rotate(-4deg)'
    : 'scale(1.62) translateX(-14%) rotate(4deg)'

  const scrimColor = scrim ?? bg
  const textScrim = bleedRight
    ? `linear-gradient(to right, ${scrimColor} 0%, ${scrimColor} 22%, transparent 62%)`
    : `linear-gradient(to left, ${scrimColor} 0%, ${scrimColor} 22%, transparent 62%)`

  return (
    <section ref={sectionRef} style={{ height: scrollHeight, background: bg }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Giant scroll-driven spin — covers the full viewport */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform, transformOrigin: 'center', willChange: 'transform' }}
        />

        {/* Legibility gradient on the text side */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: textScrim }}
        />

        {/* Side text — sits in the empty studio space */}
        <div
          className={`absolute inset-y-0 flex flex-col justify-center px-8 md:px-16 max-w-full md:max-w-[48%] ${
            bleedRight ? 'left-0 items-start text-left' : 'right-0 items-end text-right'
          }`}
        >
          {eyebrow && (
            <span
              className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase mb-5"
              style={{ color: textColor, opacity: 0.55 }}
            >
              {eyebrow}
            </span>
          )}

          {title && (
            <h2
              className="font-bebas leading-[0.78] text-[28vw] md:text-[15vw]"
              style={{ color: textColor }}
            >
              {title}
            </h2>
          )}

          <div
            className="mt-6 h-px w-16"
            style={{ backgroundColor: accent, opacity: 0.7 }}
          />

          {sub && (
            <p
              className="font-sans text-sm md:text-base leading-relaxed mt-6 max-w-xs"
              style={{ color: textColor, opacity: 0.75 }}
            >
              {sub}
            </p>
          )}

          {meta && (
            <p
              className="font-sans text-[11px] tracking-[0.25em] uppercase mt-5"
              style={{ color: textColor, opacity: 0.4 }}
            >
              {meta}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-8 flex flex-col items-center gap-3 ${
            bleedRight ? 'right-8 md:right-12' : 'left-8 md:left-12'
          }`}
        >
          <span
            className="text-[9px] tracking-[0.5em] uppercase font-sans"
            style={{ color: textColor, opacity: 0.3 }}
          >
            360° Scroll
          </span>
          <div
            className="w-px h-12 relative overflow-hidden"
            style={{ backgroundColor: textColor, opacity: 0.12 }}
          >
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backgroundColor: textColor,
                height: '30%',
                animation: 'scrollBarPulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
