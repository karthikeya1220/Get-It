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
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Icons.users className="h-5 w-5 text-primary" />
          <CardTitle>Collaboration</CardTitle>
        </div>
        <CardDescription>Projects seeking collaborators and funding</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-primary/5 p-8 text-center">
            <Icons.users className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium text-foreground">No collaboration projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start a project and find collaborators to help bring your ideas to life
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
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
                className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{project.title}</h3>
                  <Badge
                    className={
                      project.status === "In Progress" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="mb-4 text-sm text-foreground">{project.description}</p>

                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Seeking:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.seeking.map((role, idx) => (
                      <Badge key={idx} variant="outline" className="bg-primary/5 text-primary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background"
                  >
                    Learn More
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Request to Join
                  </Button>
                </div>
              </motion.div>
            ))}

            <div className="rounded-lg border border-border bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icons.lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-foreground">Have a Project Idea?</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Start a new project and find talented collaborators to help bring your vision to life.
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
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
