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
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 dark:bg-zinc-900">
        <DialogHeader className="sticky top-0 z-10 border-b border-amber-100 bg-white/80 p-4 backdrop-blur-md dark:border-amber-800/30 dark:bg-black/80">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-amber-900 dark:text-white">Student Profile</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSave()
                }}
                className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
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
              <Button
                size="sm"
                onClick={onContact}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
              >
                <Icons.mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center rounded-lg border border-amber-100 bg-white p-4 text-center dark:border-amber-800/30 dark:bg-black/20">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-amber-200 dark:border-amber-700">
                  <img
                    src={student.profileImage || "/placeholder.svg"}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-3 text-xl font-bold text-amber-900 dark:text-white">{student.fullName}</h2>
                <p className="text-amber-600 dark:text-amber-400">{student.major}</p>
                <p className="text-sm text-amber-500 dark:text-amber-500">{student.university}</p>

                <div className="mt-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-600 dark:text-amber-400">Match Score</span>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      {student.matchScore}%
                    </span>
                  </div>
                  <Progress
                    value={student.matchScore}
                    className="mt-1 h-2 bg-amber-100 dark:bg-amber-900/30 [&>div]:bg-gradient-to-r [&>div]:from-amber-600 [&>div]:to-amber-500"
                  />
                </div>

                <div className="mt-4 grid w-full grid-cols-2 gap-2">
                  <a
                    href={student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20"
                  >
                    <Icons.fileText className="mr-1 h-3 w-3" />
                    Resume
                  </a>
                  <a
                    href={student.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20"
                  >
                    <Icons.globe className="mr-1 h-3 w-3" />
                    Portfolio
                  </a>
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20"
                  >
                    <Icons.github className="mr-1 h-3 w-3" />
                    GitHub
                  </a>
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20"
                  >
                    <Icons.linkedin className="mr-1 h-3 w-3" />
                    LinkedIn
                  </a>
                </div>

                <div className="mt-4 w-full">
                  <h3 className="mb-2 text-left text-sm font-medium text-amber-800 dark:text-amber-300">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-left text-sm">
                    <p className="flex items-center text-amber-600 dark:text-amber-400">
                      <Icons.mail className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-500" />
                      {student.email}
                    </p>
                    <p className="flex items-center text-amber-600 dark:text-amber-400">
                      <Icons.phone className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-500" />
                      {student.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-amber-50 dark:bg-amber-900/20">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
                  >
                    Experience
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="about"
                  className="mt-4 rounded-lg border border-amber-100 bg-white p-4 dark:border-amber-800/30 dark:bg-black/20"
                >
                  <h3 className="text-lg font-medium text-amber-900 dark:text-white">Bio</h3>
                  <p className="mt-2 text-amber-700 dark:text-amber-400">{student.bio}</p>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Education</h4>
                      <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{student.university}</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        {student.major}, Class of {student.graduationYear}
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">GPA: {student.gpa}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Availability</h4>
                      <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{student.availability}</p>

                      <h4 className="mt-3 text-sm font-medium text-amber-800 dark:text-amber-300">Preferred Roles</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.preferredRoles.map((role: string) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className="border-amber-300 bg-transparent text-amber-700 dark:border-amber-700 dark:text-amber-400"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>

                      <h4 className="mt-3 text-sm font-medium text-amber-800 dark:text-amber-300">
                        Preferred Locations
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.preferredLocations.map((location: string) => (
                          <Badge
                            key={location}
                            variant="outline"
                            className="border-amber-300 bg-transparent text-amber-700 dark:border-amber-700 dark:text-amber-400"
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="skills"
                  className="mt-4 rounded-lg border border-amber-100 bg-white p-4 dark:border-amber-800/30 dark:bg-black/20"
                >
                  <h3 className="text-lg font-medium text-amber-900 dark:text-white">Skills</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {student.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        className="bg-amber-100 px-3 py-1 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-amber-900 dark:text-white">Projects</h3>

                  {student.projects.map((project: any) => (
                    <div
                      key={project.title}
                      className="rounded-lg border border-amber-100 bg-white p-4 dark:border-amber-800/30 dark:bg-black/20"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">{project.title}</h4>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          <Icons.externalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{project.description}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="experience" className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-amber-900 dark:text-white">Experience</h3>

                  {student.experience.map((exp: any) => (
                    <div
                      key={exp.title}
                      className="rounded-lg border border-amber-100 bg-white p-4 dark:border-amber-800/30 dark:bg-black/20"
                    >
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">{exp.title}</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {exp.company} • {exp.duration}
                      </p>
                      <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{exp.description}</p>
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
