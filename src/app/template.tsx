'use client'

import { motion } from 'framer-motion'

// App Router remounts this template on every navigation, so a mount animation
// reads as a page transition. Enter-only (App Router has no reliable exit hook),
// kept short and subtle so it never gets in the way of repeated navigation.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
