"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Progress } from "@/components/ui/progress"

interface RecruiterStatsProps {
  recruiter: any
}

export function RecruiterStats({ recruiter }: RecruiterStatsProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stats = [
    {
      label: "Profile Views",
      value: recruiter.profileViews,
      icon: <Icons.eye className="h-4 w-4" />,
      color: "text-primary",
    },
    {
      label: "Candidates Placed",
      value: recruiter.candidatesPlaced,
      icon: <Icons.userCheck className="h-4 w-4" />,
      color: "text-success",
    },
    {
      label: "Active Jobs",
      value: recruiter.activeJobs,
      icon: <Icons.briefcase className="h-4 w-4" />,
      color: "text-muted-foreground",
    },
    {
      label: "Saved Candidates",
      value: recruiter.savedCandidates,
      icon: <Icons.bookmark className="h-4 w-4" />,
      color: "text-warning",
    },
  ]

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recruiter Stats</CardTitle>
            <CardDescription>Performance and activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span className={stat.color}>{stat.icon}</span>
                    <span>{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completeness</span>
                  <span className="font-medium">{recruiter.profileCompleteness}%</span>
                </div>
                <Progress value={recruiter.profileCompleteness} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Active</span>
                <span>
                  {new Date(recruiter.lastActive).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${recruiter.email}`} className="font-medium hover:text-primary transition-colors">
                    {recruiter.email}
                  </a>
                </div>
              </div>

              {recruiter.phoneNumber && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icons.phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${recruiter.phoneNumber}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {recruiter.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {recruiter.linkedinProfile && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icons.linkedin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a
                      href={`https://linkedin.com/in/${recruiter.linkedinProfile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{recruiter.companyName}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                Contact Recruiter
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
