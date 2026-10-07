"use client"

import { Reveal } from "@/components/motion/text-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const TESTIMONIALS = [
  {
    quote:
      "I built my profile on a Sunday and had two interview calls by Wednesday. The agreement told me exactly what I would be paid before I started.",
    name: "David Chen",
    role: "Computer Science student",
    where: "Stanford University",
    tilt: "-0.7deg",
  },
  {
    quote:
      "Three startups and one internship later, my portfolio finally shows work people recognise. The deadlines on the board kept me honest.",
    name: "Sophia Martinez",
    role: "Graphic Design student",
    where: "Rhode Island School of Design",
    tilt: "0.5deg",
  },
  {
    quote:
      "The matching sent me marketing gigs instead of a general feed. I earned through the semester and stopped asking my parents for spending money.",
    name: "James Wilson",
    role: "Marketing student",
    where: "NYU Stern",
    tilt: "-0.4deg",
  },
]

const EDGE_MASK = {
  maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
} as const

function Slip({ item }: { item: (typeof TESTIMONIALS)[number] }) {
  return (
    <TiltCard className="shrink-0">
      <figure
        className="relative w-[19rem] rounded-xl border border-border bg-card p-6 pt-7 shadow-sm md:w-[24rem]"
        style={{ transform: `rotate(${item.tilt})` }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-3.5 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2 bg-safety/85"
        />
        <blockquote className="text-[15px] leading-relaxed text-foreground">
          <span aria-hidden="true">“</span>
          {item.quote}
          <span aria-hidden="true">”</span>
        </blockquote>
        <figcaption className="mt-5 border-t border-border pt-4">
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.role}</div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">{item.where}</div>
        </figcaption>
      </figure>
    </TiltCard>
  )
}

export function PremiumTestimonials() {
  return (
    <section id="testimonials" className="border-b border-border bg-muted/40 py-16 md:py-24">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              From students who got paid
            </h2>
            <p className="mt-4 text-muted-foreground">Three people who used the board while it was still filling up.</p>
          </Reveal>
        </div>
      </div>

      <div className="marquee-paused group relative mt-12 overflow-hidden" style={EDGE_MASK}>
        <div className="marquee-track flex w-max">
          <div className="flex gap-6 pr-6">
            {TESTIMONIALS.map((item) => (
              <Slip key={item.name} item={item} />
            ))}
          </div>
          <div className="flex gap-6 pr-6" aria-hidden="true">
            {TESTIMONIALS.map((item) => (
              <Slip key={`${item.name}-dup`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
