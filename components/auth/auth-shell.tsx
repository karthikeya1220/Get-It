"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Reveal, TextReveal } from "@/components/motion/text-reveal"
import { GIGS } from "@/lib/gigs"

const EDGE_MASK = {
  maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
} as const

function Chip({ amount, title }: { amount: string; title: string }) {
  return (
    <span className="mr-3 inline-flex shrink-0 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">
      <span className="font-mono text-safety">{amount}</span>
      <span className="text-white/70">{title}</span>
    </span>
  )
}

function Board() {
  const halves = [0, 1]

  return (
    <div className="marquee-paused relative -mx-10 overflow-hidden" style={EDGE_MASK}>
      <div className="marquee-track flex w-max">
        {halves.map((half) => (
          <div key={half} className="flex pr-3" aria-hidden={half === 1 ? "true" : undefined}>
            {GIGS.map((gig) => (
              <Chip key={`${half}-${gig.title}`} amount={gig.amount} title={gig.title} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  contentClassName?: string
}

export function AuthShell({ title, description, children, footer, contentClassName }: AuthShellProps) {
  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between gap-12 overflow-hidden bg-ink px-10 py-10 text-white lg:flex xl:px-14">
        <Link href="/" className="flex w-fit items-center gap-2.5 focus-visible:outline-none">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight">GetIT</span>
        </Link>

        <div>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight xl:text-6xl">
            Paid work,
            <br />
            posted on campus.
          </h2>
          <p className="mt-5 max-w-[44ch] text-white/70">
            GetIT is where students find short paid gigs from startups and campus teams. Agree the terms, do the work,
            get paid on time.
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs text-safety">Open on the board right now</p>
          <Board />
        </div>
      </aside>

      <main className="relative flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </span>
            <span className="font-semibold tracking-tight">GetIT</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className={`w-full ${contentClassName ?? "max-w-md"}`}>
            <TextReveal
              as="h1"
              lines={[title]}
              className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
            />
            <Reveal delay={0.18}>
              <p className="mt-3 text-muted-foreground">{description}</p>
            </Reveal>

            <Reveal delay={0.28} className="mt-8">
              {children}
            </Reveal>

            {footer ? (
              <Reveal delay={0.36} className="mt-6">
                {footer}
              </Reveal>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
