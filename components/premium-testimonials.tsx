"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function PremiumTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "GetIT helped me land my first paid web development gig while still in my sophomore year. The experience I gained was invaluable for my resume.",
      name: "David Chen",
      role: "Computer Science Student",
      university: "Stanford University",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "As a design student, I was looking for real-world projects to build my portfolio. Through GetIT, I've worked with three startups and even secured an internship!",
      name: "Sophia Martinez",
      role: "Graphic Design Student",
      university: "Rhode Island School of Design",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "The AI-powered matching on GetIT is spot-on! It connected me with projects that perfectly matched my marketing skills, and I've been able to earn while learning.",
      name: "James Wilson",
      role: "Marketing Student",
      university: "NYU Stern",
      avatar: "/placeholder.svg?height=100&width=100",
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

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="relative py-20">
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
            What Students Are Saying
          </h2>
          <p className="text-lg text-violet-800 dark:text-violet-300">
            Join thousands of students who are already building their careers and earning while studying.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <div className="relative mx-auto mb-12 h-[400px] max-w-4xl overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-xl dark:border-violet-800/30 dark:bg-zinc-900/80">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-amber-600/5 dark:from-violet-600/10 dark:via-transparent dark:to-amber-600/10"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0 flex items-center justify-center p-8"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="mb-6 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star key={i} className="inline-block h-6 w-6 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mb-8 text-2xl font-medium italic text-violet-900 dark:text-white">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-amber-500 shadow-lg">
                      <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                      <AvatarFallback className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                        {testimonials[activeIndex].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-bold text-violet-900 dark:text-white">{testimonials[activeIndex].name}</div>
                      <div className="text-sm text-violet-700 dark:text-violet-300">
                        {testimonials[activeIndex].role}
                      </div>
                      <div className="text-xs text-violet-600 dark:text-violet-400">
                        {testimonials[activeIndex].university}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-violet-200 bg-white/80 text-violet-800 shadow-md hover:bg-white hover:text-violet-900 dark:border-violet-800/30 dark:bg-zinc-900/80 dark:text-violet-300 dark:hover:bg-zinc-800/80 dark:hover:text-violet-200"
              onClick={prevTestimonial}
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-violet-200 bg-white/80 text-violet-800 shadow-md hover:bg-white hover:text-violet-900 dark:border-violet-800/30 dark:bg-zinc-900/80 dark:text-violet-300 dark:hover:bg-zinc-800/80 dark:hover:text-violet-200"
              onClick={nextTestimonial}
            >
              <Icons.chevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-amber-500" : "bg-violet-300 dark:bg-violet-700"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
