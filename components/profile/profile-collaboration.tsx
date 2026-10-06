"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CollaborationProject {
  title: string
  description: string
  seeking: string[]
  status: string
}

interface ProfileCollaborationProps {
  projects: CollaborationProject[]
}

export function ProfileCollaboration({ projects }: ProfileCollaborationProps) {
  return (
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center gap-2">
          <Icons.users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <CardTitle>Collaboration</CardTitle>
        </div>
        <CardDescription>Projects seeking collaborators and funding</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
            <Icons.users className="mb-2 h-10 w-10 text-violet-400 dark:text-violet-500" />
            <h3 className="mb-1 text-lg font-medium text-violet-900 dark:text-white">No collaboration projects</h3>
            <p className="mb-4 text-sm text-violet-700 dark:text-violet-300">
              Start a project and find collaborators to help bring your ideas to life
            </p>
            <Button
              className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
              size="sm"
            >
              <Icons.plus className="mr-1 h-4 w-4" />
              Start a Project
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="rounded-lg border border-violet-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-violet-800/30 dark:bg-zinc-900/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-violet-900 dark:text-white">{project.title}</h3>
                  <Badge
                    className={
                      project.status === "In Progress"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="mb-4 text-sm text-violet-800 dark:text-violet-200">{project.description}</p>

                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-medium uppercase text-violet-700 dark:text-violet-300">Seeking:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.seeking.map((role, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-violet-200 bg-white/80 text-violet-800 shadow-sm backdrop-blur-sm hover:bg-white hover:text-violet-900 dark:border-violet-800/30 dark:bg-zinc-900/80 dark:text-violet-300 dark:hover:bg-zinc-800/80 dark:hover:text-violet-200"
                  >
                    Learn More
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                  >
                    Request to Join
                  </Button>
                </div>
              </motion.div>
            ))}

            <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-800/30 dark:bg-violet-900/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                  <Icons.lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-violet-900 dark:text-white">Have a Project Idea?</h3>
                  <p className="mb-3 text-sm text-violet-700 dark:text-violet-300">
                    Start a new project and find talented collaborators to help bring your vision to life.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                    size="sm"
                  >
                    Start a Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
