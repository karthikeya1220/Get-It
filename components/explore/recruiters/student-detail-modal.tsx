"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

interface StudentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onContact: () => void
  isSaved: boolean
  onSave: () => void
}

export function StudentDetailModal({ isOpen, onClose, student, onContact, isSaved, onSave }: StudentDetailModalProps) {
  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-background/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">Student Profile</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSave()
                }}
                className="border-border text-primary hover:bg-primary/5 hover:text-primary"
              >
                {isSaved ? (
                  <>
                    <Icons.bookmarkFilled className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Icons.bookmark className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button size="sm" onClick={onContact} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Icons.mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border">
                  <img
                    src={student.profileImage || "/placeholder.svg"}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-3 text-xl font-bold text-foreground">{student.fullName}</h2>
                <p className="text-primary">{student.major}</p>
                <p className="text-sm text-primary">{student.university}</p>

                <div className="mt-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary">Match Score</span>
                    <span className="text-xs font-medium text-primary">{student.matchScore}%</span>
                  </div>
                  <Progress value={student.matchScore} className="mt-1 h-2 bg-primary/10 [&>div]:bg-primary" />
                </div>

                <div className="mt-4 grid w-full grid-cols-2 gap-2">
                  <a
                    href={student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-border bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10"
                  >
                    <Icons.fileText className="mr-1 h-3 w-3" />
                    Resume
                  </a>
                  <a
                    href={student.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-border bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10"
                  >
                    <Icons.globe className="mr-1 h-3 w-3" />
                    Portfolio
                  </a>
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-border bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10"
                  >
                    <Icons.github className="mr-1 h-3 w-3" />
                    GitHub
                  </a>
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-border bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10"
                  >
                    <Icons.linkedin className="mr-1 h-3 w-3" />
                    LinkedIn
                  </a>
                </div>

                <div className="mt-4 w-full">
                  <h3 className="mb-2 text-left text-sm font-medium text-foreground">Contact Information</h3>
                  <div className="space-y-2 text-left text-sm">
                    <p className="flex items-center text-primary">
                      <Icons.mail className="mr-2 h-4 w-4 text-primary" />
                      {student.email}
                    </p>
                    <p className="flex items-center text-primary">
                      <Icons.phone className="mr-2 h-4 w-4 text-primary" />
                      {student.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-primary/5">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Experience
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-4 rounded-lg border border-border bg-card p-4">
                  <h3 className="text-lg font-medium text-foreground">Bio</h3>
                  <p className="mt-2 text-primary">{student.bio}</p>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Education</h4>
                      <p className="mt-1 text-sm text-primary">{student.university}</p>
                      <p className="text-sm text-primary">
                        {student.major}, Class of {student.graduationYear}
                      </p>
                      <p className="text-sm text-primary">GPA: {student.gpa}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground">Availability</h4>
                      <p className="mt-1 text-sm text-primary">{student.availability}</p>

                      <h4 className="mt-3 text-sm font-medium text-foreground">Preferred Roles</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.preferredRoles.map((role: string) => (
                          <Badge key={role} variant="outline" className="border-border bg-transparent text-primary">
                            {role}
                          </Badge>
                        ))}
                      </div>

                      <h4 className="mt-3 text-sm font-medium text-foreground">Preferred Locations</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.preferredLocations.map((location: string) => (
                          <Badge key={location} variant="outline" className="border-border bg-transparent text-primary">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="mt-4 rounded-lg border border-border bg-card p-4">
                  <h3 className="text-lg font-medium text-foreground">Skills</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {student.skills.map((skill: string) => (
                      <Badge key={skill} className="bg-primary/10 px-3 py-1 text-sm text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Projects</h3>

                  {student.projects.map((project: any) => (
                    <div key={project.title} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-foreground">{project.title}</h4>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary"
                        >
                          <Icons.externalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-primary">{project.description}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="experience" className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Experience</h3>

                  {student.experience.map((exp: any) => (
                    <div key={exp.title} className="rounded-lg border border-border bg-card p-4">
                      <h4 className="font-medium text-foreground">{exp.title}</h4>
                      <p className="text-sm text-primary">
                        {exp.company} • {exp.duration}
                      </p>
                      <p className="mt-2 text-sm text-primary">{exp.description}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
