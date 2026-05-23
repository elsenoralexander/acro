'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, type MotionStyle } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Reveal — fade + rise when it enters the viewport ───────────── */
export function Reveal({
  children,
  className,
  y = 48,
  delay = 0,
  duration = 0.9,
  once = true,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  y?: number
  delay?: number
  duration?: number
  once?: boolean
  as?: 'div' | 'span' | 'li' | 'section'
}) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

/* ── MaskReveal — clip-path wipe (great for images) ─────────────── */
export function MaskReveal({
  children,
  className,
  from = 'bottom',
  duration = 1.1,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  from?: 'bottom' | 'top' | 'left' | 'right'
  duration?: number
  delay?: number
}) {
  const closed = {
    bottom: 'inset(100% 0% 0% 0%)',
    top: 'inset(0% 0% 100% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[from]
  return (
    <motion.div
      className={className}
      initial={{ clipPath: closed, scale: 1.08 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── Parallax — drifts as the element travels the viewport ──────── */
export function Parallax({
  children,
  className,
  speed = 0.3,
  style,
}: {
  children: ReactNode
  className?: string
  speed?: number // + moves up faster than scroll, - lags behind
  style?: MotionStyle
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 140, speed * -140])
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <motion.div ref={ref} className={className} style={{ y, ...style }}>
      {children}
    </motion.div>
  )
}

/* ── Words — staggered word-by-word reveal ──────────────────────── */
export function Words({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  y = 30,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  y?: number
}) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: 'inline-block' }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            className={wordClassName}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            variants={{
              hidden: { y: y, opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
