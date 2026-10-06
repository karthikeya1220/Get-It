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
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center gap-2">
          <Icons.activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <CardTitle>Activity & Engagement</CardTitle>
        </div>
        <CardDescription>Your recent activity and profile analytics</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-violet-800/30 dark:bg-zinc-900/80">
            <div className="mb-1 text-xl font-bold text-violet-900 dark:text-white">{analytics.profileViews}</div>
            <div className="text-xs text-violet-700 dark:text-violet-300">Profile Views</div>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-violet-800/30 dark:bg-zinc-900/80">
            <div className="mb-1 text-xl font-bold text-violet-900 dark:text-white">{analytics.jobApplications}</div>
            <div className="text-xs text-violet-700 dark:text-violet-300">Job Applications</div>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-violet-800/30 dark:bg-zinc-900/80">
            <div className="mb-1 text-xl font-bold text-violet-900 dark:text-white">{analytics.projectInquiries}</div>
            <div className="text-xs text-violet-700 dark:text-violet-300">Project Inquiries</div>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-violet-800/30 dark:bg-zinc-900/80">
            <div className="mb-1 text-xl font-bold text-violet-900 dark:text-white">
              {analytics.endorsementsReceived}
            </div>
            <div className="text-xs text-violet-700 dark:text-violet-300">Endorsements</div>
          </div>
        </div>

        <h3 className="mb-4 text-sm font-medium text-violet-800 dark:text-violet-200">Recent Activity</h3>

        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
            <Icons.activity className="mb-2 h-10 w-10 text-violet-400 dark:text-violet-500" />
            <h3 className="mb-1 text-lg font-medium text-violet-900 dark:text-white">No activity yet</h3>
            <p className="text-sm text-violet-700 dark:text-violet-300">
              Your recent actions on the platform will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivity.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-violet-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-violet-800/30 dark:bg-zinc-900/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm text-violet-800 dark:text-violet-200">
                      <span className="font-medium">{item.action}</span> {item.target}
                    </p>
                    <p className="text-xs text-violet-600 dark:text-violet-400">{item.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!showAll && activity.length > 5 && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              View all activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
