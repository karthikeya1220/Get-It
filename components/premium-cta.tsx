import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextReveal } from "@/components/motion/text-reveal"

const BAND = "Get paid. Get hired. Get going. "

export function PremiumCTA() {
  return (
    <section className="relative overflow-hidden bg-safety">
      <div aria-hidden="true" className="marquee-paused pointer-events-none absolute inset-0 flex items-center">
        <div className="marquee-track flex w-max select-none">
          {[0, 1].map((index) => (
            <span
              key={index}
              className="whitespace-nowrap font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-none tracking-tight text-ink/10"
            >
              {BAND.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      <div className="container relative px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl py-16 md:py-24">
          <TextReveal
            as="h2"
            lines={["Post your profile.", "Start getting paid."]}
            className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl"
          />

          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink/80">
            A profile takes about ten minutes to fill in. There are gigs on the board right now with a closing date this
            week.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup-options">
              <Button size="xl" className="bg-ink text-white hover:bg-ink/90">
                Create a profile
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="xl"
                className="border-ink/30 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-safety"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
