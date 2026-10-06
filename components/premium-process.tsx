"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Icons } from "@/components/icons"

export function PremiumProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const steps = [
    {
      icon: <Icons.user className="h-10 w-10" />,
      title: "Create Your Profile",
      description: "Sign up and build your professional profile showcasing your skills, education, and portfolio.",
      color: "from-violet-600 to-violet-400",
      lightBg: "from-violet-100 to-violet-50",
      darkBg: "from-violet-900/40 to-violet-800/40",
    },
    {
      icon: <Icons.compass className="h-10 w-10" />,
      title: "Discover Opportunities",
      description: "Browse through available gigs or receive AI-matched opportunities based on your skills.",
      color: "from-blue-600 to-blue-400",
      lightBg: "from-blue-100 to-blue-50",
      darkBg: "from-blue-900/40 to-blue-800/40",
    },
    {
      icon: <Icons.message className="h-10 w-10" />,
      title: "Connect & Collaborate",
      description: "Apply to projects, communicate with clients, and agree on project details and payment terms.",
      color: "from-amber-600 to-amber-400",
      lightBg: "from-amber-100 to-amber-50",
      darkBg: "from-amber-900/40 to-amber-800/40",
    },
    {
      icon: <Icons.code className="h-10 w-10" />,
      title: "Complete the Work",
      description: "Deliver high-quality work on time and build your professional reputation with positive reviews.",
      color: "from-green-600 to-green-400",
      lightBg: "from-green-100 to-green-50",
      darkBg: "from-green-900/40 to-green-800/40",
    },
    {
      icon: <Icons.dollar className="h-10 w-10" />,
      title: "Get Paid",
      description: "Receive secure payments for your completed work directly to your preferred payment method.",
      color: "from-pink-600 to-pink-400",
      lightBg: "from-pink-100 to-pink-50",
      darkBg: "from-pink-900/40 to-pink-800/40",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, type: "spring" } },
  }

  return (
    <section id="how-it-works" className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white dark:from-black dark:via-zinc-900 dark:to-black"></div>

      <div className="container relative z-10 px-4 md:px-8 lg:px-12">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 bg-gradient-to-r from-violet-900 to-violet-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl dark:from-white dark:to-violet-300">
            How GetIT Works
          </h2>
          <p className="text-lg text-violet-800 dark:text-violet-300">
            Getting started is easy. Follow these simple steps to begin your freelancing journey while still in college.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-violet-200 dark:bg-violet-800/30 md:block"></div>

          <motion.div
            ref={ref}
            className="relative z-10 space-y-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="relative" variants={itemVariants}>
                <div
                  className={`flex flex-col items-center gap-8 md:flex-row ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="md:w-1/2">
                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                      <div
                        className={`absolute h-full w-full rounded-full bg-gradient-to-br ${step.lightBg} dark:${step.darkBg} blur-xl`}
                      ></div>
                      <div
                        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg shadow-${step.color.split(" ")[0]}/20`}
                      >
                        {step.icon}
                      </div>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-violet-300 dark:text-violet-700">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-lg dark:border-violet-800/30 dark:bg-zinc-900/80">
                      <h3 className="mb-3 text-xl font-bold text-violet-900 dark:text-white">{step.title}</h3>
                      <p className="text-violet-700 dark:text-violet-300">{step.description}</p>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-full h-20 w-0.5 -translate-x-1/2 bg-violet-200 dark:bg-violet-800/30 md:block"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
