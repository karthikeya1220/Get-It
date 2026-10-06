"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 overflow-hidden rounded-full border-zinc-200 bg-white/80 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/90"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {resolvedTheme === "dark" ? (
            <Icons.sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Icons.moon className="h-5 w-5 text-violet-700" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
