import type { Post } from "@/components/feed/types"

export const mockFeedData: Post[] = [
  {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Emma Wilson",
      role: "UX Designer at Adobe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just finished my latest UI design project for a healthcare app. The challenge was creating an interface that's accessible for elderly users while maintaining a modern look. What do you think? #UXDesign #Accessibility",
    image: "/placeholder.svg?height=400&width=600",
    imageAlt: "Healthcare app UI design",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 128,
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-2",
          name: "Michael Chen",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "This looks amazing! I love how you've used high contrast for better readability.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        likes: 8,
        isLiked: false,
      },
      {
        id: "comment-2",
        author: {
          id: "user-3",
          name: "Sophia Rodriguez",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "The color scheme is perfect for healthcare. Calming but professional!",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        likes: 4,
        isLiked: false,
      },
    ],
    shares: 42,
    isLiked: true,
  },
  {
    id: "post-2",
    author: {
      id: "user-4",
      name: "Alex Johnson",
      role: "Computer Science Student",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I just completed my first machine learning project using TensorFlow! It's a model that predicts student performance based on various factors. Looking for feedback from anyone with ML experience. #MachineLearning #AI #StudentProject",
    image: "/placeholder.svg?height=400&width=600",
    imageAlt: "Machine learning project dashboard",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 95,
    comments: [
      {
        id: "comment-3",
        author: {
          id: "user-5",
          name: "David Kim",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content:
          "This is impressive for a first ML project! Have you tried using different algorithms to compare performance?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 12,
        isLiked: true,
      },
    ],
    shares: 28,
    isLiked: false,
  },
  {
    id: "post-3",
    author: {
      id: "user-6",
      name: "Olivia Martinez",
      role: "Frontend Developer at Twitter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just published my article on 'Optimizing React Performance in Large Applications'. Check it out and let me know your thoughts! #React #WebDevelopment #Performance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    likes: 210,
    comments: [
      {
        id: "comment-4",
        author: {
          id: "user-7",
          name: "James Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Great article! Your tips on memoization saved our dashboard load time by 40%.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        likes: 18,
        isLiked: false,
      },
      {
        id: "comment-5",
        author: {
          id: "user-8",
          name: "Ethan Brown",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Would love to see a follow-up on server-side rendering optimization!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        likes: 7,
        isLiked: false,
      },
      {
        id: "comment-6",
        author: {
          id: "user-9",
          name: "Ava Garcia",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "I implemented your virtual list suggestion and it works like a charm for our data-heavy pages.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 5,
        isLiked: false,
      },
    ],
    shares: 78,
    isLiked: false,
  },
  {
    id: "post-4",
    author: {
      id: "user-10",
      name: "Noah Thompson",
      role: "Product Manager at Spotify",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "We're hiring junior developers with experience in React and Node.js! Great opportunity to work on products used by millions. DM me if interested or for more details. #Hiring #TechJobs #ReactJS #NodeJS",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    likes: 325,
    comments: [
      {
        id: "comment-7",
        author: {
          id: "user-11",
          name: "Isabella Clark",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Is this position remote-friendly or on-site only?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
        likes: 2,
        isLiked: false,
      },
      {
        id: "comment-8",
        author: {
          id: "user-10",
          name: "Noah Thompson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "@Isabella Clark We offer hybrid options with 2-3 days in office per week!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), // 9 hours ago
        likes: 1,
        isLiked: false,
        replyTo: "comment-7",
      },
    ],
    shares: 156,
    isLiked: false,
  },
  {
    id: "post-5",
    author: {
      id: "user-12",
      name: "Liam Wilson",
      role: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just gave a talk at the CyberSec Conference about common vulnerabilities in web applications. Here's a summary of the key points for those who couldn't attend. #Cybersecurity #WebSecurity #InfoSec",
    image: "/placeholder.svg?height=400&width=600",
    imageAlt: "Cybersecurity presentation slide",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
    likes: 187,
    comments: [
      {
        id: "comment-9",
        author: {
          id: "user-13",
          name: "Charlotte Davis",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Great presentation! Do you have any recommended resources for learning more about XSS prevention?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
        likes: 8,
        isLiked: true,
      },
      {
        id: "comment-10",
        author: {
          id: "user-12",
          name: "Liam Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content:
          "@Charlotte Davis Absolutely! Check out OWASP's XSS Prevention Cheat Sheet and Mozilla's Web Security guide. I'll DM you some more resources.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
        likes: 6,
        isLiked: false,
        replyTo: "comment-9",
      },
    ],
    shares: 92,
    isLiked: true,
  },
  {
    id: "post-6",
    author: {
      id: "user-14",
      name: "Mia Johnson",
      role: "Data Science Student",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm working on a project analyzing social media sentiment around climate change. Looking for volunteers to help with data labeling. Great opportunity to gain experience in NLP! #DataScience #NLP #ClimateChange #StudentProject",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    likes: 76,
    comments: [
      {
        id: "comment-11",
        author: {
          id: "user-15",
          name: "Benjamin Moore",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "This sounds interesting! I'm a CS student with some NLP experience. How can I get involved?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
        likes: 3,
        isLiked: false,
      },
    ],
    shares: 34,
    isLiked: false,
  },
]

export const trendingTopics = [
  { id: 1, name: "AI in Education", count: 1243 },
  { id: 2, name: "Remote Work", count: 986 },
  { id: 3, name: "Web3 Development", count: 754 },
  { id: 4, name: "UX Design Trends", count: 621 },
  { id: 5, name: "Tech Interviews", count: 512 },
  { id: 6, name: "Cybersecurity", count: 498 },
  { id: 7, name: "Cloud Computing", count: 475 },
  { id: 8, name: "Data Science", count: 432 },
]

export const suggestedConnections = [
  {
    id: "user-1",
    name: "Emma Wilson",
    role: "UX Designer at Adobe",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 4,
  },
  {
    id: "user-2",
    name: "Michael Chen",
    role: "Software Engineer at Google",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 2,
  },
  {
    id: "user-3",
    name: "Sophia Rodriguez",
    role: "Data Scientist at Microsoft",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 3,
  },
  {
    id: "user-4",
    name: "David Park",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 5,
  },
  {
    id: "user-5",
    name: "Aisha Johnson",
    role: "Product Manager at Shopify",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 1,
  },
]

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
