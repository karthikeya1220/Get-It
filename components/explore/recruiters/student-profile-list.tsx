"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

interface StudentProfileListProps {
  students: any[]
  onStudentClick: (student: any) => void
  savedStudents: string[]
  onSaveStudent: (studentId: string) => void
  contactedStudents: string[]
}

export function StudentProfileList({
  students,
  onStudentClick,
  savedStudents,
  onSaveStudent,
  contactedStudents,
}: StudentProfileListProps) {
  if (students.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-amber-100 bg-white p-6 text-center dark:border-amber-800/30 dark:bg-black/20">
        <Icons.search className="mb-4 h-12 w-12 text-amber-300 dark:text-amber-700" />
        <h3 className="text-lg font-medium text-amber-900 dark:text-amber-300">No candidates found</h3>
        <p className="mt-2 text-amber-600 dark:text-amber-400">
          Try adjusting your filters or search criteria to find more candidates.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {students.map((student) => (
        <Card
          key={student.id}
          className="cursor-pointer overflow-hidden border border-amber-100 transition-all hover:border-amber-300 hover:shadow-md dark:border-amber-800/30 dark:hover:border-amber-700"
          onClick={() => onStudentClick(student)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-amber-200 dark:border-amber-800">
                  <img
                    src={student.profileImage || "/placeholder.svg"}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-amber-900 dark:text-white">{student.fullName}</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400">{student.university}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onSaveStudent(student.id)
                }}
              >
                {savedStudents.includes(student.id) ? (
                  <Icons.bookmarkFilled className="h-5 w-5" />
                ) : (
                  <Icons.bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-600 dark:text-amber-400">Match Score</span>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{student.matchScore}%</span>
              </div>
              <Progress
                value={student.matchScore}
                className="mt-1 h-2 bg-amber-100 dark:bg-amber-900/30 [&>div]:bg-gradient-to-r [&>div]:from-amber-600 [&>div]:to-amber-500"
              />
            </div>

            <div className="mb-3">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {student.major} • Class of {student.graduationYear}
              </p>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">{student.availability}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 4).map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                >
                  {skill}
                </Badge>
              ))}
              {student.skills.length > 4 && (
                <Badge variant="outline" className="bg-transparent text-amber-600 dark:text-amber-400">
                  +{student.skills.length - 4} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-amber-100 bg-amber-50/50 pt-2 dark:border-amber-800/30 dark:bg-amber-900/10">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                {student.preferredRoles.slice(0, 1).map((role: string) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="border-amber-300 bg-transparent text-amber-700 dark:border-amber-700 dark:text-amber-400"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              <div>
                {contactedStudents.includes(student.id) && (
                  <span className="flex items-center text-xs text-amber-600 dark:text-amber-500">
                    <Icons.mail className="mr-1 h-3 w-3" />
                    Contacted
                  </span>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
