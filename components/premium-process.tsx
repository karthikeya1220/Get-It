"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { Reveal } from "@/components/motion/text-reveal"

const STEPS = [
  {
    title: "Create your profile",
    description: "Add your skills, coursework and any work you have already shipped. It takes about ten minutes.",
  },
  {
    title: "Browse or get matched",
    description: "Open the board and filter down, or let AI matching send you the gigs that fit your skills.",
  },
  {
    title: "Agree the terms",
    description: "Scope, deadline and payment are written into an agreement that both you and the recruiter sign.",
  },
  {
    title: "Do the work",
    description: "Deliver against the agreed scope and post it for review. Everything stays inside GetIT.",
  },
  {
    title: "Get paid",
    description: "Once the work is approved, payment is released to you and the gig closes with a review.",
  },
]

export function PremiumProcess() {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  return (
    <section id="how-it-works" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              From sign-up to paid, in five steps
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each step ends with something you can check, so you always know where the work stands.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-12">
          <span
            aria-hidden="true"
            className="absolute -left-4 top-0 hidden h-full w-px bg-border md:block lg:-left-6"
          />
          <motion.span
            aria-hidden="true"
            className="absolute -left-4 top-0 hidden h-full w-px origin-top bg-primary md:block lg:-left-6"
            style={{ scaleY: reduced ? scrollYProgress : scaleY }}
          />

          <ol ref={ref} className="border-t border-border">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-b border-border">
                <Reveal
                  delay={index * 0.06}
                  className="grid gap-x-8 gap-y-1.5 py-7 md:grid-cols-[3.5rem_minmax(0,15rem)_minmax(0,1fr)] md:items-baseline"
                >
                  <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
                  <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
