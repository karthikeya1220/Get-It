"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TestimonialProps {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  date: string
}

interface RecruiterTestimonialsProps {
  testimonials: TestimonialProps[]
}

export function RecruiterTestimonials({ testimonials }: RecruiterTestimonialsProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Candidate Testimonials</CardTitle>
            <CardDescription>Feedback from candidates who worked with this recruiter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-6 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.position} at {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "text-primary fill-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="relative">
                    <Icons.quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/50 opacity-50" />
                    <p className="text-sm leading-relaxed pl-4">{testimonial.content}</p>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 text-right">
                    {new Date(testimonial.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}

              {testimonials.length === 0 && (
                <div className="text-center py-8">
                  <Icons.messageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="mt-4 text-muted-foreground">No testimonials yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
