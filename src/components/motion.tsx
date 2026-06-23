'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, type MotionStyle } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── useReveal — scroll-position trigger ─────────────────────────
   Framer's `whileInView` AND a native IntersectionObserver both proved
   unreliable under Lenis smooth scroll (neither fired on scroll-in, so
   clip-path content stayed clipped to zero = invisible). Lenis drives the
   native window scroll position, so a passive `scroll` listener checking
   the element's rect is the reliable signal. rAF-throttled, self-removing
   once shown, with a mount check so above-fold content shows instantly. */
function useReveal(visibleAt = 0.9) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    const check = () => {
      const el2 = ref.current
      if (!el2) return
      const r = el2.getBoundingClientRect()
      // Trigger once the element's top rises into the bottom `visibleAt` of
      // the viewport (and it's not already scrolled past above).
      if (r.top < window.innerHeight * visibleAt && r.bottom > 0) {
        setShown(true)
        cleanup()
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }

    check() // in-view at mount → reveal immediately
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return cleanup
  }, [visibleAt])

  return [ref, shown] as const
}

/* ── Reveal — fade + rise when it enters the viewport ───────────── */
export function Reveal({
  children,
  className,
  y = 48,
  delay = 0,
  duration = 0.9,
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
  const [ref, shown] = useReveal(0.88)
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
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
  const open = 'inset(0% 0% 0% 0%)'
  const [ref, shown] = useReveal(0.92)
  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={{ clipPath: closed, scale: 1.06 }}
      animate={shown ? { clipPath: open, scale: 1 } : { clipPath: closed, scale: 1.06 }}
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
  const [ref, shown] = useReveal(0.9)
  return (
    <motion.span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={className}
      initial="hidden"
      animate={shown ? 'show' : 'hidden'}
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
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
