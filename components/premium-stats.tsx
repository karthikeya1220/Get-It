"use client"

import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/motion/text-reveal"

const STATS = [
  { value: 10000, suffix: "+", label: "Students on GetIT", money: false },
  { value: 5000, suffix: "+", label: "Gigs completed", money: false },
  { value: 1000, suffix: "+", label: "Partner companies", money: false },
  { value: 500, prefix: "₹", suffix: "K+", label: "Paid out to students", money: true },
]

export function PremiumStats() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {STATS.map((stat, index) => (
            <div key={stat.label} className={index === 0 ? "" : "md:border-l md:border-border md:pl-6"}>
              <Reveal delay={index * 0.08}>
                <div
                  className={`font-mono text-3xl font-medium tracking-tight md:text-4xl ${
                    stat.money ? "text-money" : "text-foreground"
                  }`}
                >
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">{stat.label}</div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
