'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'

type Props = {
  framePrefix: string
  frameCount: number
  frameExt?: string
  pad?: number
  height?: string // scroll travel for the pinned scene
  number: string // giant watermark
  eyebrow?: string
  beats?: string[] // up to 3 narrative lines that cross-fade through the spin
  meta?: string
  accent?: string
  textColor?: string
  creamFrom?: string
  creamTo?: string
}

/* One cross-fading headline beat, parallaxing through its life */
function Beat({
  progress,
  center,
  children,
  textColor,
}: {
  progress: MotionValue<number>
  center: number
  children: ReactNode
  textColor: string
}) {
  const opacity = useTransform(
    progress,
    [center - 0.2, center - 0.1, center + 0.1, center + 0.2],
    [0, 1, 1, 0]
  )
  const y = useTransform(progress, [center - 0.2, center + 0.2], [80, -80])
  const lines = typeof children === 'string' ? children.split('\n') : [children]
  return (
    <motion.h3
      style={{ opacity, y, color: textColor }}
      className="absolute font-bebas leading-[0.82] text-center px-6 text-[15vw] md:text-[10vw] max-w-[92vw] pointer-events-none"
    >
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </motion.h3>
  )
}

export function BagScene({
  framePrefix,
  frameCount,
  frameExt = 'webp',
  pad = 3,
  height = '440vh',
  number,
  eyebrow,
  beats = [],
  meta,
  accent = '#C2A24E',
  textColor = '#241B12',
  creamFrom = '#EFE8DA',
  creamTo = '#E4D6BC',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef<boolean[]>([])
  const frameRef = useRef(0)
  const drawRef = useRef<() => void>(() => {})

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ── Scene layers driven by the same scroll progress ──
  const washColor = useTransform(scrollYProgress, [0, 0.5, 1], [creamFrom, creamTo, creamFrom])
  const numX = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  const numOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.06, 0.06, 0])
  const bagScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.03, 0.97])
  const bagOpacity = useTransform(scrollYProgress, [0, 0.08, 0.94, 1], [0, 1, 1, 0.85])
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.0, 0.9])
  const lineScaleY = scrollYProgress

  useEffect(() => {
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

    const nearest = (idx: number) => {
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
      const idx = nearest(frameRef.current)
      if (idx < 0) return
      const img = imgs[idx]
      if (!img.naturalWidth) return
      const ar = img.naturalWidth / img.naturalHeight
      let dw = cssW
      let dh = dw / ar
      if (dh > cssH) {
        dh = cssH
        dw = dh * ar
      }
      ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh)
    }

    drawRef.current = draw
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    requestAnimationFrame(draw)
    return () => window.removeEventListener('resize', onResize)
  }, [framePrefix, frameCount, frameExt, pad])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const f = Math.max(0, Math.min(frameCount - 1, Math.round(p * (frameCount - 1))))
    if (f !== frameRef.current) {
      frameRef.current = f
      drawRef.current()
    }
  })

  return (
    <section ref={sectionRef} style={{ height }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Breathing colour wash */}
        <motion.div className="absolute inset-0" style={{ backgroundColor: washColor }} />

        {/* Giant number watermark — parallax */}
        <motion.span
          style={{ x: numX, opacity: numOpacity, color: textColor }}
          className="absolute font-bebas leading-none select-none pointer-events-none text-[60vw] md:text-[40vw]"
        >
          {number}
        </motion.span>

        {/* Narrative beats, behind the bag */}
        {beats.slice(0, 3).map((b, i) => (
          <Beat
            key={i}
            progress={scrollYProgress}
            center={beats.length === 1 ? 0.5 : 0.22 + i * (0.56 / Math.max(1, beats.length - 1))}
            textColor={textColor}
          >
            {b}
          </Beat>
        ))}

        {/* Grounding shadow */}
        <motion.div
          style={{ scaleX: shadowScale, opacity: bagOpacity }}
          className="absolute z-[5] bottom-[16vh] w-[42vw] md:w-[24vw] h-[5vh]"
        >
          <div
            className="w-full h-full rounded-[50%]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(60,40,20,0.28), transparent 70%)' }}
          />
        </motion.div>

        {/* The bag — rotates with scroll (canvas), scales subtly (motion) */}
        <motion.canvas
          ref={canvasRef}
          style={{ scale: bagScale, opacity: bagOpacity, height: 'min(60vh, 580px)', width: 'min(88vw, 420px)' }}
          className="relative z-10"
        />

        {/* Eyebrow */}
        {eyebrow && (
          <div className="absolute top-[11vh] left-1/2 -translate-x-1/2 text-center px-6">
            <span
              className="font-sans text-[10px] md:text-[11px] tracking-[0.55em] uppercase"
              style={{ color: textColor, opacity: 0.5 }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* Meta */}
        {meta && (
          <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex flex-col items-center text-center px-6">
            <div className="h-px w-10 mb-4" style={{ backgroundColor: accent, opacity: 0.7 }} />
            <p
              className="font-sans text-[11px] tracking-[0.25em] uppercase"
              style={{ color: textColor, opacity: 0.45 }}
            >
              {meta}
            </p>
          </div>
        )}

        {/* Scroll-progress line */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 h-28 w-px overflow-hidden" style={{ backgroundColor: textColor, opacity: 0.1 }}>
          <motion.div
            className="absolute top-0 left-0 w-full origin-top"
            style={{ height: '100%', scaleY: lineScaleY, backgroundColor: accent }}
          />
        </div>
      </div>
    </section>
  )
}
