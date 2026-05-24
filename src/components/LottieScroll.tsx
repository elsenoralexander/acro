'use client'

import { useEffect, useRef, useState } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

type Props = {
  /** Path to a Lottie JSON exported from Cavalry / After Effects / LottieFiles, e.g. '/lottie/hero.json' */
  src: string
  /**
   * 'scroll'  → the animation is scrubbed by scroll progress over `height` (vector, crisp, frame-accurate)
   * 'inview'  → plays once when it enters the viewport
   * 'loop'    → autoplays on a loop
   */
  mode?: 'scroll' | 'inview' | 'loop'
  height?: string // only used in 'scroll' mode (the pinned scroll travel)
  className?: string // sizing for the Lottie box (inview/loop modes)
  bg?: string
}

export function LottieScroll({ src, mode = 'scroll', height = '300vh', className, bg }: Props) {
  const [data, setData] = useState<unknown>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let alive = true
    fetch(src)
      .then((r) => r.json())
      .then((d) => alive && setData(d))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [src])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (mode !== 'scroll') return
    const lottie = lottieRef.current
    if (!lottie) return
    const total = lottie.getDuration(true) // in frames
    if (total) lottie.goToAndStop(Math.max(0, Math.min(total - 1, p * (total - 1))), true)
  })

  if (!data) {
    // Reserve layout while the JSON loads
    return mode === 'scroll' ? <section ref={sectionRef} style={{ height, background: bg }} /> : <div className={className} />
  }

  if (mode === 'scroll') {
    return (
      <section ref={sectionRef} style={{ height, background: bg }} className="relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <Lottie
            lottieRef={lottieRef}
            animationData={data}
            autoplay={false}
            loop={false}
            className="w-full h-full max-w-5xl"
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </div>
      </section>
    )
  }

  return (
    <div className={className} style={{ background: bg }}>
      <Lottie animationData={data} autoplay loop={mode === 'loop'} />
    </div>
  )
}
