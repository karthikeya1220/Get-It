"use client"

import { useParams } from "next/navigation"
import { AiStudentDashboard } from "@/components/ai/students/ai-student-dashboard"
import { PremiumNavbar } from "@/components/premium-navbar"

export default function StudentAIPage() {
  const params = useParams()
  const studentId = params.studentId as string

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-zinc-900 dark:to-black">
      <PremiumNavbar />
      <div className="container max-w-6xl py-14 mx-auto">
        <AiStudentDashboard studentId={studentId} />
      </div>
    </div>
  )
}
