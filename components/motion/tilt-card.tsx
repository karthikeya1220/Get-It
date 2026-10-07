"use client"

import { useRef, type ReactNode, type PointerEvent } from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className, max = 5 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hovered = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 20 })
  const sheenX = useTransform(px, [0, 1], ["15%", "85%"])
  const sheenY = useTransform(py, [0, 1], ["15%", "85%"])
  const sheenOpacity = useSpring(hovered, { stiffness: 220, damping: 26 })

  const background = useMotionTemplate`radial-gradient(340px circle at ${sheenX} ${sheenY}, rgb(27 77 255 / 0.16), transparent 70%)`

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || reduced) return
    const rect = node.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }

  const onPointerEnter = () => {
    if (reduced) return
    hovered.set(1)
  }
  const onPointerLeave = () => {
    if (reduced) return
    hovered.set(0)
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn("[perspective:1200px]", className)}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative h-full w-full">
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background, opacity: sheenOpacity }}
        />
      </motion.div>
    </div>
  )
}
