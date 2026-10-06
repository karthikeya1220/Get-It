import { PremiumHero } from "@/components/premium-hero"
import { PremiumFeatures } from "@/components/premium-features"
import { PremiumTestimonials } from "@/components/premium-testimonials"
import { PremiumProcess } from "@/components/premium-process"
import { PremiumStats } from "@/components/premium-stats"
import { PremiumCTA } from "@/components/premium-cta"
import { PremiumNavbar } from "@/components/premium-navbar"
import { PremiumFooter } from "@/components/premium-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-zinc-900 dark:to-black dark:text-white">
      <PremiumNavbar />
      <main className="flex-1">
        <PremiumHero />
        <PremiumStats />
        <PremiumFeatures />
        <PremiumProcess />
        <PremiumTestimonials />
        <PremiumCTA />
      </main>
      <PremiumFooter />
    </div>
  )
}
