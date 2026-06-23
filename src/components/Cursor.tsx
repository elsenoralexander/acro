'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

// Studio-style accent cursor: a small dot that springs after the pointer and
// swells over anything marked [data-cursor]. mix-blend-difference keeps it
// legible on both the cream and ink surfaces. Pointer-fine devices only, and
// it sits behind the grain/header so it never blocks interaction.
export function Cursor() {
  const x = useSpring(0, { stiffness: 500, damping: 40, mass: 0.4 })
  const y = useSpring(0, { stiffness: 500, damping: 40, mass: 0.4 })
  const [fine, setFine] = useState(false)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches || reduce.matches) return
    setFine(true)

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as HTMLElement | null
      setActive(!!t?.closest('[data-cursor]'))
    }
    const hide = () => setVisible(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    document.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      document.removeEventListener('mouseleave', hide)
    }
  }, [x, y])

  if (!fine) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[60]"
    >
      <motion.div
        animate={{
          width: active ? 56 : 9,
          height: active ? 56 : 9,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.5 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ mixBlendMode: 'difference' }}
      />
    </motion.div>
  )
}
