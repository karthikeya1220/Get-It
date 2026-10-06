"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Icons } from "@/components/icons"

export function PremiumFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <Icons.users className="h-10 w-10" />,
      title: "Skill Showcase",
      description:
        "Create a professional profile highlighting your skills, experience, and portfolio to stand out to potential clients.",
      color: "from-violet-600 to-violet-400",
      lightBg: "from-violet-100 to-violet-50",
      darkBg: "from-violet-900/40 to-violet-800/40",
    },
    {
      icon: <Icons.briefcase className="h-10 w-10" />,
      title: "Find Paid Gigs",
      description:
        "Browse and apply to paid opportunities from startups and peers that match your skills and interests.",
      color: "from-blue-600 to-blue-400",
      lightBg: "from-blue-100 to-blue-50",
      darkBg: "from-blue-900/40 to-blue-800/40",
    },
    {
      icon: <Icons.lightbulb className="h-10 w-10" />,
      title: "AI-Powered Matching",
      description:
        "Our intelligent algorithm suggests the most relevant opportunities based on your skills and preferences.",
      color: "from-amber-600 to-amber-400",
      lightBg: "from-amber-100 to-amber-50",
      darkBg: "from-amber-900/40 to-amber-800/40",
    },
    {
      icon: <Icons.dollar className="h-10 w-10" />,
      title: "Secure Payments",
      description:
        "Get paid safely and on time with our secure payment system designed specifically for student freelancers.",
      color: "from-green-600 to-green-400",
      lightBg: "from-green-100 to-green-50",
      darkBg: "from-green-900/40 to-green-800/40",
    },
    {
      icon: <Icons.star className="h-10 w-10" />,
      title: "Build Your Reputation",
      description: "Earn reviews and ratings to build a strong professional reputation while still in college.",
      color: "from-pink-600 to-pink-400",
      lightBg: "from-pink-100 to-pink-50",
      darkBg: "from-pink-900/40 to-pink-800/40",
    },
    {
      icon: <Icons.compass className="h-10 w-10" />,
      title: "Career Guidance",
      description: "Receive personalized recommendations for skill development and career advancement opportunities.",
      color: "from-purple-600 to-purple-400",
      lightBg: "from-purple-100 to-purple-50",
      darkBg: "from-purple-900/40 to-purple-800/40",
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="relative py-20">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-fixed bg-center opacity-5"></div>
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
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-violet-800 dark:text-violet-300">
            GetIT provides all the tools and resources you need to showcase your talents, find opportunities, and build
            your professional career.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-violet-800/30 dark:bg-zinc-900/80"
              variants={itemVariants}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.lightBg} opacity-50 dark:${feature.darkBg}`}
              ></div>
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-600/10 to-amber-600/10 blur-3xl transition-all duration-500 group-hover:scale-150 dark:from-violet-600/20 dark:to-amber-600/20"></div>
              <div className="relative z-10 p-8">
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-${feature.color.split(" ")[0]}/20`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-violet-900 dark:text-white">{feature.title}</h3>
                <p className="text-violet-700 dark:text-violet-300">{feature.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
