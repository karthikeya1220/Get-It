"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function PremiumCTA() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white dark:from-black dark:via-zinc-900 dark:to-black"></div>

      <div className="container relative z-10 px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-amber-600"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

            <div className="relative z-10 px-6 py-16 sm:px-12 md:py-20 lg:px-20">
              <div className="mx-auto max-w-3xl text-center">
                <motion.h2
                  className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Ready to Kickstart Your Professional Journey?
                </motion.h2>

                <motion.p
                  className="mb-10 text-lg text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Join thousands of students who are building their portfolios, earning money, and gaining real-world
                  experience while still in college.
                </motion.p>

                <motion.div
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="group relative h-14 overflow-hidden bg-white px-8 text-violet-800 shadow-lg hover:bg-violet-50"
                    >
                      <span className="relative z-10 flex items-center">
                        Get Started Now
                        <Icons.arrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 border-white/40 bg-transparent px-8 text-white shadow-lg hover:bg-white/10"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/30 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
