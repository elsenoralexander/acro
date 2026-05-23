'use client'

import { useEffect, useRef } from 'react'

type Props = {
  framePrefix: string // e.g. '/spin/pop/frame-'
  frameCount: number
  frameExt?: string // 'webp'
  pad?: number // zero-pad width of the index (default 3)
  scrollHeight?: string // scroll travel — more = slower spin
  bg?: string // section background (match the page so the cut-out floats)
  textColor?: string
  accent?: string
  watermark?: string // giant faint word behind the product
  eyebrow?: string
  sub?: string
  meta?: string
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function ScrollSequence({
  framePrefix,
  frameCount,
  frameExt = 'webp',
  pad = 3,
  scrollHeight = '300vh',
  bg = '#EFE8DA',
  textColor = '#241B12',
  accent = '#C2A24E',
  watermark,
  eyebrow,
  sub,
  meta,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef<boolean[]>([])
  const rafRef = useRef<number | null>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    // Preload the frame sequence
    const imgs: HTMLImageElement[] = []
    const loaded: boolean[] = new Array(frameCount).fill(false)
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = `${framePrefix}${String(i).padStart(pad, '0')}.${frameExt}`
      img.onload = () => {
        loaded[i] = true
        if (i === 0) requestAnimationFrame(draw)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
    loadedRef.current = loaded

    const nearestLoaded = (idx: number) => {
      if (loaded[idx]) return idx
      for (let d = 1; d < frameCount; d++) {
        if (loaded[idx - d]) return idx - d
        if (loaded[idx + d]) return idx + d
      }
      return -1
    }

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr)
        canvas.height = Math.round(cssH * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)

      const p = progressRef.current
      const frame = Math.max(0, Math.min(frameCount - 1, Math.round(p * (frameCount - 1))))
      const idx = nearestLoaded(frame)
      if (idx < 0) return
      const img = imgs[idx]
      if (!img.naturalWidth) return

      // Entrance: fade + rise + scale in over the first slice of scroll
      const intro = easeOut(Math.min(1, p / 0.14))
      const scale = 0.84 + 0.16 * intro
      const rise = (1 - intro) * cssH * 0.06
      const alpha = intro

      // contain-fit the frame, then apply the entrance scale
      const ar = img.naturalWidth / img.naturalHeight
      let dw = cssW
      let dh = dw / ar
      if (dh > cssH) {
        dh = cssH
        dw = dh * ar
      }
      dw *= scale
      dh *= scale
      const dx = (cssW - dw) / 2
      const dy = (cssH - dh) / 2 + rise

      ctx.globalAlpha = alpha
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.globalAlpha = 1
    }

    const update = () => {
      const section = sectionRef.current
      if (section) {
        const rect = section.getBoundingClientRect()
        const travel = section.offsetHeight - window.innerHeight
        progressRef.current = Math.max(0, Math.min(1, -rect.top / travel))
      }
      draw()
      rafRef.current = null
    }

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [framePrefix, frameCount, frameExt, pad])

  return (
    <section ref={sectionRef} style={{ height: scrollHeight, background: bg }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Giant faint watermark behind the product */}
        {watermark && (
          <span
            className="absolute font-bebas leading-none select-none pointer-events-none text-[42vw] md:text-[30vw]"
            style={{ color: textColor, opacity: 0.05 }}
          >
            {watermark}
          </span>
        )}

        {/* Eyebrow — top */}
        {eyebrow && (
          <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 text-center px-6">
            <span
              className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase"
              style={{ color: textColor, opacity: 0.5 }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* The product — scroll-driven rotation */}
        <canvas
          ref={canvasRef}
          className="relative z-10"
          style={{ height: 'min(58vh, 560px)', width: 'min(86vw, 400px)' }}
        />

        {/* Caption — bottom */}
        {(sub || meta) && (
          <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center text-center px-6">
            <div className="h-px w-12 mb-5" style={{ backgroundColor: accent, opacity: 0.7 }} />
            {sub && (
              <p
                className="font-sans text-sm md:text-base leading-relaxed max-w-xs"
                style={{ color: textColor, opacity: 0.75 }}
              >
                {sub}
              </p>
            )}
            {meta && (
              <p
                className="font-sans text-[11px] tracking-[0.25em] uppercase mt-3"
                style={{ color: textColor, opacity: 0.4 }}
              >
                {meta}
              </p>
            )}
          </div>
        )}

        {/* Scroll hint */}
        <div className="absolute bottom-6 right-6 md:right-10 flex flex-col items-center gap-2">
          <span
            className="text-[9px] tracking-[0.5em] uppercase font-sans"
            style={{ color: textColor, opacity: 0.3 }}
          >
            360°
          </span>
          <div className="w-px h-10 relative overflow-hidden" style={{ backgroundColor: textColor, opacity: 0.12 }}>
            <div
              className="absolute top-0 left-0 w-full"
              style={{ backgroundColor: textColor, height: '30%', animation: 'scrollBarPulse 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
