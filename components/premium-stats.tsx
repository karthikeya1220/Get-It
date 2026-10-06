"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Icons } from "@/components/icons"

export function PremiumStats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      value: "10,000+",
      label: "Students",
      icon: <Icons.users className="h-6 w-6" />,
      color: "from-violet-600 to-violet-400",
      lightBg: "from-violet-100 to-violet-50",
      darkBg: "from-violet-900/40 to-violet-800/40",
    },
    {
      value: "5,000+",
      label: "Completed Gigs",
      icon: <Icons.briefcase className="h-6 w-6" />,
      color: "from-blue-600 to-blue-400",
      lightBg: "from-blue-100 to-blue-50",
      darkBg: "from-blue-900/40 to-blue-800/40",
    },
    {
      value: "1,000+",
      label: "Partner Companies",
      icon: <Icons.building className="h-6 w-6" />,
      color: "from-amber-600 to-amber-400",
      lightBg: "from-amber-100 to-amber-50",
      darkBg: "from-amber-900/40 to-amber-800/40",
    },
    {
      value: "$500K+",
      label: "Paid to Students",
      icon: <Icons.dollar className="h-6 w-6" />,
      color: "from-green-600 to-green-400",
      lightBg: "from-green-100 to-green-50",
      darkBg: "from-green-900/40 to-green-800/40",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-zinc-900 dark:via-black dark:to-black"></div>

      <div className="container relative z-10 px-4 md:px-8 lg:px-12">
        <motion.div
          ref={ref}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-violet-800/30 dark:bg-zinc-900/80"
              variants={itemVariants}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.lightBg} opacity-50 dark:${stat.darkBg}`}
              ></div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-600/10 to-amber-600/10 blur-2xl transition-all duration-500 group-hover:scale-150 dark:from-violet-600/20 dark:to-amber-600/20"></div>
              <div className="relative z-10 p-6">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-${stat.color.split(" ")[0]}/20`}
                >
                  {stat.icon}
                </div>
                <h3 className="mb-1 text-3xl font-bold text-violet-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
