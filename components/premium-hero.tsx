"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Reveal, TextReveal } from "@/components/motion/text-reveal"
import { GIGS, type Gig } from "@/lib/gigs"

const MASK = {
  maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
} as const

function GigRow({ gig, duplicate = false }: { gig: Gig; duplicate?: boolean }) {
  return (
    <li className="border-b border-border/70 px-4 pb-3 pt-3 last:border-b-0" aria-hidden={duplicate || undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium">{gig.title}</span>
        <span className="shrink-0 font-mono text-sm font-medium">{gig.amount}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3 text-xs">
        <span className="truncate text-muted-foreground">{gig.meta}</span>
        <span className="shrink-0 font-mono text-muted-foreground">{gig.closes}</span>
      </div>
    </li>
  )
}

function GigBoard() {
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-2.5 shadow-sm">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Open gigs</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{GIGS.length} posted</span>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause the board" : "Play the board"}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {playing ? <Icons.pause className="h-3.5 w-3.5" /> : <Icons.play className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="relative h-[21rem] overflow-hidden py-2 sm:h-[25rem]" style={MASK}>
          <ul className={playing ? "board-scroll" : "board-idle"}>
            {GIGS.map((gig) => (
              <GigRow key={gig.title} gig={gig} />
            ))}
            {GIGS.map((gig) => (
              <GigRow key={`${gig.title}-dup`} gig={gig} duplicate />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function PremiumHero() {
  return (
    <section className="border-b border-border bg-background pb-14 pt-28 md:pb-20 md:pt-36">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <TextReveal
              as="h1"
              delay={0.1}
              lines={["Paid work,", "posted on campus."]}
              className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            />

            <Reveal delay={0.4}>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
                GetIT is where students find short paid gigs from startups and campus teams. Agree the terms, do the
                work, get paid on time.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup-options">
                  <Button size="xl">Create a profile</Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="xl">
                    Browse open gigs
                  </Button>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <p className="mt-6 max-w-[46ch] text-sm text-muted-foreground">
                Free for students, with AI skill matching and secure payments.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.28} y={28} duration={0.9}>
            <GigBoard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
