/**
 * Curated sidebar content. This is editorial copy, not user data —
 * trending topics and suggested people are derived from Firestore instead
 * (see components/feed/feed-sidebar.tsx).
 */

export const upcomingEvents = [
  {
    id: "event-1",
    title: "Tech Career Fair",
    date: "Mar 28",
    attendees: 156,
    image: "/placeholder.svg?height=64&width=96",
  },
  {
    id: "event-2",
    title: "Web Development Workshop",
    date: "Apr 5",
    attendees: 89,
    image: "/placeholder.svg?height=64&width=96",
  },
  {
    id: "event-3",
    title: "AI & Machine Learning Summit",
    date: "Apr 12",
    attendees: 213,
    image: "/placeholder.svg?height=80&width=120",
  },
]

export const learningResources = [
  {
    id: "resource-1",
    title: "Master Modern JavaScript",
    description: "Learn the latest ES6+ features and best practices",
    modules: 8,
    duration: "4 hours",
    level: "Intermediate",
    isPremium: false,
    image: "/placeholder.svg?height=48&width=80",
  },
  {
    id: "resource-2",
    title: "Technical Interview Prep",
    description: "Ace your next coding interview with confidence",
    modules: 12,
    duration: "6 hours",
    level: "Advanced",
    isPremium: true,
    image: "/placeholder.svg?height=48&width=80",
  },
  {
    id: "resource-3",
    title: "UX Research Fundamentals",
    description: "Learn essential user research methods and techniques",
    modules: 6,
    duration: "3 hours",
    level: "Beginner",
    isPremium: false,
    image: "/placeholder.svg?height=60&width=100",
  },
]
