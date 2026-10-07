"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useState, useEffect } from "react"

export function RecruiterSignupComplete() {
  const [redirectCounter, setRedirectCounter] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCounter((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center text-center space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl"></div>
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary">
          <Icons.check className="h-14 w-14 text-white" />
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.h2
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Registration Complete!
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your recruiter account has been created successfully. You're now ready to find talented students for your
          team.
        </motion.p>
      </div>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 font-medium text-foreground">What's Next?</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs">1</span>
              </div>
              <span className="text-foreground">Complete your company profile by adding more details and a logo</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs">2</span>
              </div>
              <span className="text-foreground">
                Post your first job or project to start attracting talented students
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs">3</span>
              </div>
              <span className="text-foreground">
                Browse student profiles and discover talent that matches your needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs">4</span>
              </div>
              <span className="text-foreground">Set up your team members and customize your recruitment workflow</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/recruiter-dashboard">
            <Button className="w-full">
              Go to Dashboard
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border border-border bg-transparent text-foreground hover:bg-secondary"
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.p
        className="text-sm italic text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Redirecting to dashboard {redirectCounter > 0 ? `in ${redirectCounter}...` : "now..."}
      </motion.p>
    </motion.div>
  )
}
