"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecruiterActivityProps {
  recruiter: any
}

export function RecruiterActivity({ recruiter }: RecruiterActivityProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Mock activity data
  const recentActivity = [
    {
      id: "act1",
      type: "job_posted",
      title: "Senior Frontend Developer",
      date: "2023-11-25",
      details: {
        company: recruiter.companyName,
        location: "Remote",
        type: "Full-time",
      },
    },
    {
      id: "act2",
      type: "candidate_contacted",
      title: "Reached out to Michael Chen",
      date: "2023-11-22",
      details: {
        role: "Data Scientist",
        candidate: {
          name: "Michael Chen",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    },
    {
      id: "act3",
      type: "job_posted",
      title: "Product Manager",
      date: "2023-11-18",
      details: {
        company: recruiter.companyName,
        location: recruiter.companyLocation,
        type: "Full-time",
      },
    },
    {
      id: "act4",
      type: "candidate_hired",
      title: "Hired Emily Rodriguez",
      date: "2023-11-15",
      details: {
        role: "UX Designer",
        candidate: {
          name: "Emily Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    },
    {
      id: "act5",
      type: "profile_updated",
      title: "Updated company information",
      date: "2023-11-10",
      details: {},
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "job_posted":
        return <Icons.fileText className="h-4 w-4" />
      case "candidate_contacted":
        return <Icons.mail className="h-4 w-4" />
      case "candidate_hired":
        return <Icons.userCheck className="h-4 w-4" />
      case "profile_updated":
        return <Icons.refresh className="h-4 w-4" />
      default:
        return <Icons.activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "job_posted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "candidate_contacted":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "candidate_hired":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "profile_updated":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
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
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates from this recruiter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className={`mb-6 ${index === recentActivity.length - 1 ? "" : ""}`}>
                  <div className="absolute -left-2">
                    <div
                      className={`h-4 w-4 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {activity.type === "job_posted" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{activity.details.company}</span>
                        <span>•</span>
                        <span>{activity.details.location}</span>
                        <span>•</span>
                        <span>{activity.details.type}</span>
                      </div>
                    )}

                    {(activity.type === "candidate_contacted" || activity.type === "candidate_hired") && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={activity.details.candidate?.avatar}
                            alt={activity.details.candidate?.name ?? ""}
                          />
                          <AvatarFallback className="text-xs">
                            {activity.details.candidate?.name ??
                              ""
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{activity.details.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Active Job Listings</CardTitle>
            <CardDescription>Currently open positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">
                        {index === 0 ? "Senior Frontend Developer" : index === 1 ? "Product Manager" : "Data Scientist"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{recruiter.companyName}</span>
                        <span>•</span>
                        <span>{index === 0 ? "Remote" : recruiter.companyLocation}</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {index === 0 ? (
                      <>
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">TypeScript</Badge>
                        <Badge variant="outline">Next.js</Badge>
                      </>
                    ) : index === 1 ? (
                      <>
                        <Badge variant="outline">Product Management</Badge>
                        <Badge variant="outline">Agile</Badge>
                        <Badge variant="outline">UX</Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline">Python</Badge>
                        <Badge variant="outline">Machine Learning</Badge>
                        <Badge variant="outline">SQL</Badge>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Posted {index === 0 ? "3 days ago" : index === 1 ? "10 days ago" : "2 weeks ago"}
                    </p>
                    <button className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
