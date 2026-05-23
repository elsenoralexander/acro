'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ReactLenis, type LenisRef } from 'lenis/react'

// Buttery inertial scroll — the backbone of the "Awwwards" feel.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()

  // Reset to the top on every route change — Lenis hijacks scroll, so Next's
  // default scroll-to-top doesn't fire and you'd land mid/bottom of the page.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    lenis?.scrollTo(0, { immediate: true })
    if (lenis) (window as unknown as { lenis?: unknown }).lenis = lenis
  }, [pathname])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}
