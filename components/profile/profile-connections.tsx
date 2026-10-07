"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAllStudents } from "@/lib/firebase-service" // Import the getAllStudents function
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton for loading state

interface ProfileConnectionsProps {
  connections: {
    followers: number
    following: number
  }
  showAll?: boolean
}

interface StudentUser {
  id: string
  fullName: string
  title: string
  avatar: string
  university?: string
}

export function ProfileConnections({ connections, showAll = false }: ProfileConnectionsProps) {
  const { data: students = [], isPending: loading } = useQuery<StudentUser[]>({
    queryKey: ["students", "all"],
    queryFn: async () => {
      const studentsData = await getAllStudents()
      return studentsData.map((student: any) => ({
        id: student.id,
        fullName: student.fullName || "Unnamed Student",
        title: student.title || "Student",
        avatar: student.avatar || "/placeholder.svg?height=50&width=50",
        university: student.university,
      }))
    },
  })

  const displayedUsers = showAll ? students : students.slice(0, 3)

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Icons.users className="h-5 w-5 text-primary" />
          <CardTitle>Students Network</CardTitle>
        </div>
        <CardDescription>Connect with other students</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 shadow-sm">
            <span className="text-2xl font-bold text-foreground">{connections.followers}</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 shadow-sm">
            <span className="text-2xl font-bold text-foreground">{connections.following}</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
        </div>

        <h3 className="mb-4 text-sm font-medium text-foreground">Student Network</h3>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          ) : displayedUsers.length > 0 ? (
            // Display the students
            displayedUsers.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.avatar} alt={student.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-foreground">{student.fullName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {student.title}
                      {student.university && ` at ${student.university}`}
                    </p>
                  </div>
                </div>
                <Link href={`/profiles/students/${student.id}`} passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background"
                  >
                    View
                  </Button>
                </Link>
              </motion.div>
            ))
          ) : (
            // No students found
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Icons.users className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No students found</p>
            </div>
          )}
        </div>

        {!showAll && students.length > 3 && (
          <div className="mt-4 text-center">
            <Link href="/explore/students" passHref>
              <Button variant="link" className="text-primary hover:text-primary/70">
                View all students
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
