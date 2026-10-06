import type { Metadata } from "next"
import { FeedContainer } from "@/components/feed/feed-container"

export const metadata: Metadata = {
  title: "GetIT | Feed",
  description: "What students and recruiters are building, hiring for and learning",
}

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <FeedContainer />
    </div>
  )
}
