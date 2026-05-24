'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/* A cross-fading narrative beat that slides in horizontally from the text side */
function Beat({
  progress,
  center,
  side,
  children,
  textColor,
}: {
  progress: MotionValue<number>
  center: number
  side: 'left' | 'right' // which side the BAG sits — text goes opposite
  children: ReactNode
  textColor: string
}) {
  const opacity = useTransform(progress, [center - 0.14, center - 0.05, center + 0.05, center + 0.14], [0, 1, 1, 0])
  // Bag right → text on the left, sliding rightward; bag left → mirror.
  const from = side === 'right' ? '-26vw' : '26vw'
  const to = side === 'right' ? '3vw' : '-3vw'
  const x = useTransform(progress, [center - 0.14, center + 0.14], [from, to])
  const lines = typeof children === 'string' ? children.split('\n') : [children]
  return (
    <motion.h3
      style={{ opacity, x, color: textColor }}
      className={`absolute font-bebas leading-[0.8] text-[22vw] md:text-[15vw] pointer-events-none select-none ${
        side === 'right' ? 'left-[4vw] text-left' : 'right-[4vw] text-right'
      }`}
    >
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </motion.h3>
  )
}

function Dot({
  progress,
  cfg,
  color,
}: {
  progress: MotionValue<number>
  cfg: { x: number; y: number; s: number; from: number; to: number; o: number }
  color: string
}) {
  const ty = useTransform(progress, [0, 1], [`${cfg.from}vh`, `${cfg.to}vh`])
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, cfg.o, cfg.o, 0])
  return (
    <motion.span
      style={{ left: `${cfg.x}%`, top: `${cfg.y}%`, width: cfg.s, height: cfg.s, y: ty, opacity, background: color }}
      className="absolute rounded-full pointer-events-none"
    />
  )
}

const DOTS = [
  { x: 14, y: 26, s: 14, from: 10, to: -16, o: 0.9 },
  { x: 88, y: 20, s: 22, from: 16, to: -22, o: 0.8 },
  { x: 22, y: 72, s: 10, from: 8, to: -10, o: 0.7 },
  { x: 80, y: 70, s: 16, from: 14, to: -20, o: 0.85 },
  { x: 46, y: 12, s: 9, from: 6, to: -8, o: 0.6 },
  { x: 92, y: 50, s: 12, from: 12, to: -14, o: 0.75 },
  { x: 7, y: 54, s: 18, from: 14, to: -18, o: 0.8 },
]

type Props = {
  image: string
  alt?: string
  number: string
  eyebrow?: string
  beats?: string[]
  meta?: string
  accent?: string
  textColor?: string
  bgFrom?: string
  bgTo?: string
  height?: string
  side?: 'left' | 'right' // which side the bag is lateralised to
}

export function ProductScene({
  image,
  alt = '',
  number,
  eyebrow,
  beats = [],
  meta,
  accent = '#C2A24E',
  textColor = '#241B12',
  bgFrom = '#EFE8DA',
  bgTo = '#E6D8BE',
  height = '340vh',
  side = 'right',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const wash = useTransform(p, [0, 0.5, 1], [bgFrom, bgTo, bgFrom])
  const imgY = useTransform(p, [0, 0.5, 1], ['8vh', '0vh', '-8vh'])
  const imgScale = useTransform(p, [0, 0.5, 1], [0.86, 1, 1.07])
  const imgRot = useTransform(p, [0, 1], ['-4deg', '4deg'])
  const imgOpacity = useTransform(p, [0, 0.08, 0.95, 1], [0, 1, 1, 0.9])
  const numX = useTransform(p, [0, 1], ['-7%', '7%'])
  const numOpacity = useTransform(p, [0, 0.12, 0.88, 1], [0, 0.06, 0.06, 0])
  const ringRot = useTransform(p, [0, 1], ['-14deg', '24deg'])
  const ringScale = useTransform(p, [0, 0.5, 1], [0.85, 1.05, 1.18])
  const shadowScale = useTransform(p, [0, 0.5, 1], [0.75, 1, 0.9])
  const lineScaleY = p

  // Lateralise the bag toward one side, bleeding a little off the edge.
  const bagX = side === 'right' ? '20%' : '-20%'

  return (
    <section ref={ref} style={{ height }} className="relative">
      <motion.div style={{ background: wash }} className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Giant number watermark */}
        <motion.span
          style={{ x: numX, opacity: numOpacity, color: textColor }}
          className="absolute font-bebas leading-none select-none pointer-events-none text-[60vw] md:text-[42vw]"
        >
          {number}
        </motion.span>

        {/* Rotating accent ring — follows the bag side */}
        <motion.div
          style={{ rotate: ringRot, scale: ringScale, x: bagX }}
          className="absolute w-[86vw] md:w-[46vw] aspect-square rounded-full pointer-events-none"
        >
          <div className="w-full h-full rounded-full border" style={{ borderColor: accent, opacity: 0.22 }} />
        </motion.div>

        {/* Floating gold dots */}
        {DOTS.map((cfg, i) => (
          <Dot key={i} progress={p} cfg={cfg} color={accent} />
        ))}

        {/* Oversize narrative beats — opposite side, sliding in horizontally */}
        {beats.slice(0, 3).map((b, i) => (
          <Beat key={i} progress={p} side={side} center={beats.length === 1 ? 0.5 : 0.22 + i * (0.56 / Math.max(1, beats.length - 1))} textColor={textColor}>
            {b}
          </Beat>
        ))}

        {/* Grounding shadow */}
        <motion.div
          style={{ scaleX: shadowScale, opacity: imgOpacity, x: bagX }}
          className="absolute z-[5] bottom-[10vh] w-[52vw] md:w-[26vw] h-[5vh]"
        >
          <div className="w-full h-full rounded-[50%]" style={{ background: 'radial-gradient(ellipse at center, rgba(40,28,16,0.32), transparent 70%)' }} />
        </motion.div>

        {/* The bag — lateralised, crisp transparent PNG */}
        <motion.img
          src={image}
          alt={alt}
          style={{
            x: bagX,
            y: imgY,
            scale: imgScale,
            rotate: imgRot,
            opacity: imgOpacity,
            height: 'min(92vh, 880px)',
            width: 'auto',
          }}
          className="relative z-10 object-contain drop-shadow-2xl"
        />

        {/* Eyebrow */}
        {eyebrow && (
          <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 text-center px-6 z-20">
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.55em] uppercase" style={{ color: textColor, opacity: 0.5 }}>
              {eyebrow}
            </span>
          </div>
        )}

        {/* Meta */}
        {meta && (
          <div className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 flex flex-col items-center text-center px-6 z-20">
            <div className="h-px w-10 mb-4" style={{ backgroundColor: accent, opacity: 0.7 }} />
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase" style={{ color: textColor, opacity: 0.45 }}>
              {meta}
            </p>
          </div>
        )}

        {/* Scroll-progress line */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 h-28 w-px overflow-hidden" style={{ backgroundColor: textColor, opacity: 0.1 }}>
          <motion.div className="absolute top-0 left-0 w-full origin-top" style={{ height: '100%', scaleY: lineScaleY, backgroundColor: accent }} />
        </div>
      </motion.div>
    </section>
  )
}
