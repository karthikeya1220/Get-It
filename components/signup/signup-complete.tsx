"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function SignupComplete() {
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
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/20 to-amber-600/20 blur-xl"></div>
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-600">
          <Icons.check className="h-14 w-14 text-white" />
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.h2
          className="text-2xl font-bold text-zinc-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Registration Complete!
        </motion.h2>
        <motion.p
          className="text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your account has been created successfully. You're now ready to start your journey on GetIT.
        </motion.p>
      </div>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50 p-6">
          <h3 className="mb-4 font-medium text-zinc-900 dark:text-white">What's Next?</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-600 text-white">
                <span className="text-xs">1</span>
              </div>
              <span className="text-zinc-700 dark:text-zinc-300">
                Complete your profile by adding a profile picture and more details
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-600 text-white">
                <span className="text-xs">2</span>
              </div>
              <span className="text-zinc-700 dark:text-zinc-300">
                Browse available opportunities that match your skills
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-600 text-white">
                <span className="text-xs">3</span>
              </div>
              <span className="text-zinc-700 dark:text-zinc-300">
                Connect with other students and potential clients
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-600 text-white">
                <span className="text-xs">4</span>
              </div>
              <span className="text-zinc-700 dark:text-zinc-300">
                Check out AI-recommended resources to improve your skills
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/profile">
            <Button className="w-full bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700">
              Go to Dashboard
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
