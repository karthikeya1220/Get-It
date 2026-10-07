"use client"

import { motion } from "framer-motion"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Activity {
  type: string
  action: string
  target: string
  date: string
}

interface Analytics {
  profileViews: number
  jobApplications: number
  projectInquiries: number
  endorsementsReceived: number
}

interface ProfileActivityProps {
  activity: Activity[]
  analytics: Analytics
  showAll?: boolean
}

export function ProfileActivity({ activity, analytics, showAll = false }: ProfileActivityProps) {
  const displayedActivity = showAll ? activity : activity.slice(0, 5)

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Icons.briefcase className="h-4 w-4" />
      case "skill":
        return <Icons.code className="h-4 w-4" />
      case "endorsement":
        return <Icons.thumbsUp className="h-4 w-4" />
      case "job":
        return <Icons.fileText className="h-4 w-4" />
      default:
        return <Icons.activity className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Icons.activity className="h-5 w-5 text-primary" />
          <CardTitle>Activity & Engagement</CardTitle>
        </div>
        <CardDescription>Your recent activity and profile analytics</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <div className="mb-1 text-xl font-bold text-foreground">{analytics.profileViews}</div>
            <div className="text-xs text-muted-foreground">Profile Views</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <div className="mb-1 text-xl font-bold text-foreground">{analytics.jobApplications}</div>
            <div className="text-xs text-muted-foreground">Job Applications</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <div className="mb-1 text-xl font-bold text-foreground">{analytics.projectInquiries}</div>
            <div className="text-xs text-muted-foreground">Project Inquiries</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <div className="mb-1 text-xl font-bold text-foreground">{analytics.endorsementsReceived}</div>
            <div className="text-xs text-muted-foreground">Endorsements</div>
          </div>
        </div>

        <h3 className="mb-4 text-sm font-medium text-foreground">Recent Activity</h3>

        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-primary/5 p-8 text-center">
            <Icons.activity className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium text-foreground">No activity yet</h3>
            <p className="text-sm text-muted-foreground">Your recent actions on the platform will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivity.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.action}</span> {item.target}
                    </p>
                    <p className="text-xs text-primary">{item.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!showAll && activity.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary hover:text-primary/70">
              View all activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
