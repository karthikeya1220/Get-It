"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Add a key to the motion.div elements to help React with reconciliation
export default function SignupOptionsPage() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // Only run this effect on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null // Return null or a loading state until client-side rendering is ready
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    hover: {
      y: -10,
      boxShadow:
        mounted && resolvedTheme === "light"
          ? "0 25px 50px -12px rgba(124, 58, 237, 0.25)"
          : "0 25px 50px -12px rgba(124, 58, 237, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-zinc-900 dark:to-black dark:text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <motion.div
          key="bg1"
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur-3xl dark:from-violet-600/20 dark:to-fuchsia-600/20"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          key="bg2"
          className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-gradient-to-r from-amber-600/10 to-rose-600/10 blur-3xl dark:from-amber-600/20 dark:to-rose-600/20"
          animate={{
            x: [0, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          key="bg3"
          className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl dark:from-blue-600/20 dark:to-cyan-600/20"
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
      </div>

      <div className="container relative z-10 flex w-full flex-col items-center justify-center px-4 md:px-8 lg:px-12">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="group absolute left-4 top-4 flex items-center gap-2 text-lg font-bold text-zinc-900 transition-all hover:text-violet-600 dark:text-white dark:hover:text-violet-400 md:left-8 md:top-8"
        >
          <motion.div
            key="logo"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-600 p-[1px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white dark:bg-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-zinc-900 transition-transform duration-300 ease-out group-hover:scale-110 dark:text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
          </motion.div>
          <span className="hidden md:inline-block">GetIT</span>
        </Link>

        <motion.div className="w-full max-w-4xl" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600/10 to-amber-600/10 dark:from-violet-600/20 dark:to-amber-600/20"
            >
              {/* <Icons.userPlus className="h-8 w-8 text-violet-600 dark:text-violet-400" /> */}
            </motion.div>
            <motion.h1
              className="mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            >
              Join GetIT
            </motion.h1>
            <motion.p
              className="text-sm text-zinc-500 dark:text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Choose how you want to use GetIT
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
              <Link href="/signup">
                <Card className="h-full overflow-hidden border-violet-100 shadow-lg transition-all dark:border-violet-800/30">
                  <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20 pb-6">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-violet-600 text-white">
                      <Icons.graduationCap className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">For Students</CardTitle>
                    <CardDescription>Showcase your skills and find opportunities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Create a professional portfolio</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Find paid gigs and internships</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Connect with recruiters and companies</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Develop your skills with personalized recommendations</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700">
                      Sign Up as Student
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
              <Link href="/recruiter-signup">
                <Card className="h-full overflow-hidden border-violet-100 shadow-lg transition-all dark:border-violet-800/30">
                  <CardHeader className="bg-gradient-to-r from-amber-100/50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-800/20 pb-6">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      <Icons.briefcase className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">For Recruiters</CardTitle>
                    <CardDescription>Find talented students for your company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Post job opportunities and projects</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Find students with specific skills</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">AI-powered matching with qualified candidates</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-5 w-5 text-green-500" />
                        <p className="text-sm">Streamlined hiring process for interns and freelancers</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700">
                      Sign Up as Recruiter
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          </div>

          <motion.div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400" variants={itemVariants}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "bg-violet-600/10 dark:bg-violet-600/20"
                : i % 3 === 1
                  ? "bg-amber-600/10 dark:bg-amber-600/20"
                  : "bg-blue-600/10 dark:bg-blue-600/20"
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  )
}
