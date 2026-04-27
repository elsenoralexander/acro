'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt: string
  className?: string
}

export function Product3D({ src, alt, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const latestScrollRef = useRef(0)

  const updateTransform = useCallback(() => {
    const card = cardRef.current
    const wrap = wrapRef.current
    if (!card || !wrap) return

    const rect = wrap.getBoundingClientRect()
    const vh = window.innerHeight
    // progress: 0 = top of element at bottom of screen, 1 = bottom at top
    const progress = 1 - rect.bottom / (vh + rect.height)
    const clamped = Math.max(0, Math.min(1, progress))
    // Rotate Y: -30deg → +30deg across scroll
    const rotateY = (clamped - 0.5) * 60
    // Subtle X tilt
    const rotateX = Math.sin(clamped * Math.PI) * -6

    card.style.transform = `perspective(1200px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`
    rafRef.current = null
  }, [])

  const onScroll = useCallback(() => {
    latestScrollRef.current = window.scrollY
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateTransform)
    }
  }, [updateTransform])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    updateTransform()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onScroll, updateTransform])

  return (
    <div ref={wrapRef} className={`${className}`} style={{ perspective: '1200px' }}>
      <div
        ref={cardRef}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.08s linear',
          willChange: 'transform',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={700}
          height={700}
          className="w-full h-full object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  )
}
