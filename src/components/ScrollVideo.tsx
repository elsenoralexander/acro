'use client'

import { useRef, useEffect } from 'react'

type Props = {
  src: string
  poster: string
  className?: string
  scrollHeight?: string // how much scroll travel, e.g. '300vh'
  label?: string
  number?: string
}

export function ScrollVideo({
  src,
  poster,
  className = '',
  scrollHeight = '180vh',
  label,
  number,
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

    const onReady = () => { readyRef.current = true }
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
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Set initial frame
    requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.removeEventListener('canplay', onReady)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: scrollHeight }} className="relative bg-ink">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Number watermark */}
        {number && (
          <span className="absolute font-bebas text-[35vw] text-chalk/[0.02] select-none pointer-events-none">
            {number}
          </span>
        )}

        {/* Scroll-driven video */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className={`relative z-10 ${className}`}
          style={{
            filter: 'drop-shadow(0 0 80px rgba(192,192,192,0.1))',
          }}
        />

        {/* Vertical label */}
        {label && (
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2">
            <span className="font-bebas text-[10px] tracking-[0.4em] text-chalk/20 [writing-mode:vertical-rl] rotate-180">
              {label}
            </span>
          </div>
        )}

        {/* Scroll progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.5em] uppercase text-chalk/20 font-sans">Scroll</span>
          <div className="w-px h-12 bg-chalk/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-chalk/40"
              id="scroll-bar-fill"
              style={{ height: '30%', animation: 'scrollBarPulse 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
