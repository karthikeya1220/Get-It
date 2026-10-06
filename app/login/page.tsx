"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { auth } from "@/firebase" // Import auth from firebase.ts
import { signInWithEmailAndPassword } from "firebase/auth"
import { createSessionCookie } from "@/lib/auth-session"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      if (result.user) {
        await createSessionCookie()
        toast.success("Successfully logged in!")
        // Honor ?next= set by middleware, but never leave the site root
        const next = new URLSearchParams(window.location.search).get("next")
        router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/profile")
        router.refresh()
      }
    } catch (error: any) {
      let message = "Failed to login"
      if (error.code === "auth/user-not-found") {
        message = "User not found"
      } else if (error.code === "auth/wrong-password") {
        message = "Invalid password"
      }
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpClick = () => {
    router.push("/signup-options")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-zinc-900 dark:to-black dark:text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <motion.div
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

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90"
            whileHover={{
              boxShadow:
                mounted && resolvedTheme === "light"
                  ? "0 25px 50px -12px rgba(0,0,0,0.15)"
                  : "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative elements */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-2xl dark:from-violet-600/20 dark:to-fuchsia-600/20"></div>
            <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-amber-600/30 to-rose-600/30 blur-2xl dark:from-amber-600/20 dark:to-rose-600/20"></div>

            <div className="relative z-10 p-8">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600/10 to-amber-600/10 dark:from-violet-600/20 dark:to-amber-600/20"
                >
                  <Icons.user className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </motion.div>
                <motion.h1
                  className="mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                >
                  Welcome back
                </motion.h1>
                <motion.p
                  className="text-sm text-zinc-500 dark:text-zinc-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Enter your credentials to access your account
                </motion.p>
              </div>

              <motion.form
                onSubmit={onSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
                      Email
                    </Label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icons.mail className="h-5 w-5 text-zinc-400 group-focus-within:text-violet-500 dark:text-zinc-500 dark:group-focus-within:text-violet-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        required
                        className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icons.lock className="h-5 w-5 text-zinc-400 group-focus-within:text-violet-500 dark:text-zinc-500 dark:group-focus-within:text-violet-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        disabled={isLoading}
                        required
                        className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 h-12 w-full bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Icons.spinner className="h-5 w-5" />
                        </motion.div>
                      ) : null}
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>
                </div>

                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                  <div className="mx-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">OR CONTINUE WITH</div>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>

                {/* <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      className="h-12 w-full border-zinc-300 bg-white/50 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <Icons.google className="mr-2 h-5 w-5 text-red-500" />
                      <span className="sr-only md:not-sr-only md:inline-block">Google</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      className="h-12 w-full border-zinc-300 bg-white/50 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <Icons.github className="mr-2 h-5 w-5" />
                      <span className="sr-only md:not-sr-only md:inline-block">GitHub</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      className="h-12 w-full border-zinc-300 bg-white/50 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <Icons.facebook className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="sr-only md:not-sr-only md:inline-block">Facebook</span>
                    </Button>
                  </motion.div>
                </div> */}

                <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    onClick={handleSignUpClick}
                  >
                    Sign up
                  </Button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
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
