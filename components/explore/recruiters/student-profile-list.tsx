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
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center">
        <Icons.search className="mb-4 h-12 w-12 text-primary" />
        <h3 className="text-lg font-medium text-foreground">No candidates found</h3>
        <p className="mt-2 text-primary">Try adjusting your filters or search criteria to find more candidates.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {students.map((student) => (
        <Card
          key={student.id}
          className="cursor-pointer overflow-hidden border border-border transition-all hover:border-border hover:shadow-md"
          onClick={() => onStudentClick(student)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-border">
                  <img
                    src={student.profileImage || "/placeholder.svg"}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{student.fullName}</h3>
                  <p className="text-sm text-primary">{student.university}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary"
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
                <span className="text-xs text-primary">Match Score</span>
                <span className="text-xs font-medium text-primary">{student.matchScore}%</span>
              </div>
              <Progress value={student.matchScore} className="mt-1 h-2 bg-primary/10 [&>div]:bg-primary" />
            </div>

            <div className="mb-3">
              <p className="text-sm text-primary">
                {student.major} • Class of {student.graduationYear}
              </p>
              <p className="mt-1 text-xs text-primary">{student.availability}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 4).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
              {student.skills.length > 4 && (
                <Badge variant="outline" className="bg-transparent text-primary">
                  +{student.skills.length - 4} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border bg-primary/5 pt-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                {student.preferredRoles.slice(0, 1).map((role: string) => (
                  <Badge key={role} variant="outline" className="border-border bg-transparent text-primary">
                    {role}
                  </Badge>
                ))}
              </div>
              <div>
                {contactedStudents.includes(student.id) && (
                  <span className="flex items-center text-xs text-primary">
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
