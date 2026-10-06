"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function PremiumHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useMotionValue(0)
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // Parallax effect for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const bgY3 = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-20 pt-32"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#6d28d9_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#8b5cf6_1px,transparent_1px)]"></div>
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl dark:bg-violet-600/20"
        style={{ y: bgY1 }}
        animate={{
          x: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl dark:bg-amber-600/20"
        style={{ y: bgY2 }}
        animate={{
          x: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl dark:bg-blue-600/20"
        style={{ y: bgY3 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="container relative z-10 px-4 md:px-8 lg:px-12">
        <motion.div className="mx-auto max-w-5xl text-center" style={{ opacity, scale }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-violet-200 bg-white/90 px-4 py-2 shadow-md backdrop-blur dark:border-violet-800/30 dark:bg-zinc-900/80">
              <motion.div
                className="mr-2 h-2 w-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm font-medium text-violet-800 dark:text-violet-300">
                Launching for Fall Semester 2025
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="mb-6 bg-gradient-to-r from-violet-900 via-violet-700 to-violet-800 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-400 sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
          >
            <span className="inline-block">Showcase Your Skills,</span> <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-violet-600 to-amber-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              Find Paid Gigs
            </motion.span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-violet-950 dark:text-zinc-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            Connect with startups and peers who need your talents. Build your portfolio, earn money, and gain real-world
            experience while still in college.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="group relative h-14 overflow-hidden bg-gradient-to-r from-violet-600 to-amber-600 px-8 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 dark:shadow-violet-600/10 hover:from-violet-700 hover:to-amber-700"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <Icons.arrowRight className="h-4 w-4" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 -z-0 bg-gradient-to-r from-violet-600 to-amber-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"></span>
                </Button>
              </motion.div>
            </Link>
            <Link href="#how-it-works">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 border-violet-200 bg-white/80 px-8 text-violet-800 shadow-md backdrop-blur-sm hover:bg-white hover:text-violet-900 dark:border-violet-800/30 dark:bg-zinc-900/50 dark:text-violet-300 dark:hover:bg-zinc-800/80 dark:hover:text-violet-200"
                >
                  How It Works
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="flex items-center gap-2 text-sm text-violet-800 dark:text-violet-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.5 }}
              >
                <Icons.check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
              <span>No fees for students</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm text-violet-800 dark:text-violet-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.6 }}
              >
                <Icons.check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
              <span>AI-powered skill matching</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm text-violet-800 dark:text-violet-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.7 }}
              >
                <Icons.check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
              <span>Secure payments</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-20 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, type: "spring", stiffness: 50 }}
          style={{ scale }}
        >
          <motion.div
            className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-violet-200 bg-white/90 shadow-2xl backdrop-blur dark:border-violet-800/30 dark:bg-zinc-900/80"
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-amber-600/5 dark:from-violet-600/10 dark:via-transparent dark:to-amber-600/10"></div>
            <div className="absolute inset-0">
              <img src="/demo.gif" alt="GetIt platform demo" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="rounded-full bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-amber-600 p-[1px] shadow-lg shadow-violet-600/20 dark:shadow-violet-600/10">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-black">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-violet-800 dark:text-white"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 transform">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="mb-2 text-sm text-violet-800 dark:text-violet-300">Scroll to explore</span>
          <motion.div
            className="h-10 w-6 rounded-full border border-violet-300 p-1 shadow-md dark:border-violet-800"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="h-2 w-full rounded-full bg-violet-500 dark:bg-violet-400"
              animate={{
                y: [0, 6, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
