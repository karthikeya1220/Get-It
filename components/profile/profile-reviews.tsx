"use client"

import { motion } from "framer-motion"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
  name: string
  role: string
  rating: number
  comment: string
  date: string
  avatar: string
}

interface ProfileReviewsProps {
  reviews: Review[]
}

export function ProfileReviews({ reviews }: ProfileReviewsProps) {
  return (
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center gap-2">
          <Icons.star className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <CardTitle>Reviews & Ratings</CardTitle>
        </div>
        <CardDescription>Feedback from clients and collaborators</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
            <Icons.star className="mb-2 h-10 w-10 text-violet-400 dark:text-violet-500" />
            <h3 className="mb-1 text-lg font-medium text-violet-900 dark:text-white">No reviews yet</h3>
            <p className="text-sm text-violet-700 dark:text-violet-300">
              Complete projects to receive feedback from clients and collaborators
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="rounded-lg border border-violet-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-violet-800/30 dark:bg-zinc-900/80"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-violet-900 dark:text-white">{review.name}</h3>
                      <p className="text-xs text-violet-700 dark:text-violet-300">{review.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-violet-600 dark:text-violet-400">{review.date}</div>
                </div>

                <div className="mb-3 flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1
                    return (
                      <Icons.star
                        key={i}
                        className={`h-4 w-4 ${
                          ratingValue <= review.rating
                            ? "fill-current"
                            : ratingValue - 0.5 <= review.rating
                              ? "fill-current opacity-50"
                              : "fill-none"
                        }`}
                      />
                    )
                  })}
                  <span className="ml-2 text-sm text-violet-800 dark:text-violet-200">{review.rating.toFixed(1)}</span>
                </div>

                <blockquote className="text-sm italic text-violet-800 dark:text-violet-200">
                  "{review.comment}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
