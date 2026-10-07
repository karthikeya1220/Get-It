"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary ${className ?? ""}`}
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  )
}
