'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { MotionConfig } from 'framer-motion'

// Buttery inertial scroll — the backbone of the "Awwwards" feel.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()

  // Honor the OS "reduce motion" setting: skip inertial scroll for users who
  // ask for it (vestibular comfort). Framer animations are handled by MotionConfig.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduceMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Reset to the top on every route change — Lenis hijacks scroll, so Next's
  // default scroll-to-top doesn't fire and you'd land mid/bottom of the page.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    lenis?.scrollTo(0, { immediate: true })
    if (lenis) (window as unknown as { lenis?: unknown }).lenis = lenis
  }, [pathname])

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        ref={lenisRef}
        root
        options={{
          lerp: 0.09,
          duration: 1.2,
          smoothWheel: !reduceMotion,
          syncTouch: !reduceMotion,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  )
}
