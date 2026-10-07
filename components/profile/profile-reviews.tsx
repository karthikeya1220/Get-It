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
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Icons.star className="h-5 w-5 text-primary" />
          <CardTitle>Reviews & Ratings</CardTitle>
        </div>
        <CardDescription>Feedback from clients and collaborators</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-primary/5 p-8 text-center">
            <Icons.star className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium text-foreground">No reviews yet</h3>
            <p className="text-sm text-muted-foreground">
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
                className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground">{review.name}</h3>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-primary">{review.date}</div>
                </div>

                <div className="mb-3 flex items-center text-primary">
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
                  <span className="ml-2 text-sm text-foreground">{review.rating.toFixed(1)}</span>
                </div>

                <blockquote className="text-sm italic text-foreground">"{review.comment}"</blockquote>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
