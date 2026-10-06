"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface RecruiterHiringNeedsProps {
  recruiter: any
}

export function RecruiterHiringNeeds({ recruiter }: RecruiterHiringNeedsProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Map role IDs to labels
  const roleOptions = [
    { id: "software-engineer", label: "Software Engineer" },
    { id: "web-developer", label: "Web Developer" },
    { id: "mobile-developer", label: "Mobile Developer" },
    { id: "ui-ux-designer", label: "UI/UX Designer" },
    { id: "graphic-designer", label: "Graphic Designer" },
    { id: "data-scientist", label: "Data Scientist" },
    { id: "data-analyst", label: "Data Analyst" },
    { id: "product-manager", label: "Product Manager" },
    { id: "project-manager", label: "Project Manager" },
    { id: "marketing-specialist", label: "Marketing Specialist" },
    { id: "content-writer", label: "Content Writer" },
    { id: "social-media-manager", label: "Social Media Manager" },
    { id: "sales-representative", label: "Sales Representative" },
    { id: "customer-support", label: "Customer Support" },
  ]

  // Map employment type IDs to labels
  const employmentTypeMap: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance/Project-based",
  }

  // Map remote option IDs to labels
  const remoteOptionMap: Record<string, string> = {
    "on-site": "On-site only",
    hybrid: "Hybrid",
    remote: "Fully remote",
    flexible: "Flexible",
  }

  // Map hiring timeline to label
  const timelineMap: Record<string, string> = {
    immediate: "Immediate (within 2 weeks)",
    soon: "Soon (within 1 month)",
    "next-quarter": "Next quarter",
    ongoing: "Ongoing/continuous hiring",
    future: "Future planning (3+ months)",
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
            <CardTitle className="text-xl">Roles & Positions</CardTitle>
            <CardDescription>Current hiring needs and open positions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Hiring Timeline</h3>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                  {timelineMap[recruiter.hiringTimeline] || recruiter.hiringTimeline}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Roles Hiring For</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recruiter.hiringRoles.map((roleId: string) => {
                    const role = roleOptions.find((r) => r.id === roleId)
                    return role ? (
                      <div key={roleId} className="flex items-center gap-2">
                        <Icons.briefcase className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">{role.label}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Employment Types</h3>
                <div className="flex flex-wrap gap-2">
                  {recruiter.employmentTypes.map((typeId: string) => (
                    <Badge
                      key={typeId}
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    >
                      {employmentTypeMap[typeId] || typeId}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Remote Work Options</h3>
                <div className="flex flex-wrap gap-2">
                  {recruiter.remoteOptions.map((optionId: string) => (
                    <Badge
                      key={optionId}
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    >
                      {remoteOptionMap[optionId] || optionId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Skills & Requirements</CardTitle>
            <CardDescription>Skills and qualifications being sought</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Skills Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {recruiter.skillsNeeded.map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Icons.lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">Looking for these skills?</p>
                    <p className="text-sm text-muted-foreground">
                      Browse our talent pool to find candidates with these qualifications
                    </p>
                  </div>
                  <button className="ml-auto text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
                    Browse Talent
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
