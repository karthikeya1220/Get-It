"use client"

import { useRef, type ElementType, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const EXPO_OUT = [0.19, 1, 0.22, 1] as const

interface TextRevealProps {
  /** One entry per rendered line. Words stagger across the whole block. */
  lines: string[]
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  duration?: number
}

export function TextReveal({
  lines,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.055,
  duration = 0.75,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduced = useReducedMotion()

  const words = lines.flatMap((line) => line.split(/\s+/).filter(Boolean))
  const label = words.join(" ")

  let cursor = -1

  return (
    <Tag ref={ref} aria-label={label} className={className}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.14em]">
          {line
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => {
              cursor += 1
              return (
                <motion.span
                  key={`${line}-${word}`}
                  className="mr-[0.26em] inline-block"
                  initial={{ y: "110%" }}
                  animate={inView ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    duration: reduced ? 0 : duration,
                    delay: reduced ? 0 : delay + cursor * stagger,
                    ease: EXPO_OUT,
                  }}
                >
                  {word}
                </motion.span>
              )
            })}
        </span>
      ))}
    </Tag>
  )
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  once?: boolean
}

export function Reveal({ children, className, delay = 0, y = 18, duration = 0.7, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: EXPO_OUT }}
    >
      {children}
    </motion.div>
  )
}

export { EXPO_OUT }
