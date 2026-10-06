import { redirect } from "next/navigation"

export default function AiStudentsPage() {
  // In a real app, you would check if the user is logged in and get their ID
  // For now, we'll redirect to a demo student profile
  const demoStudentId = "student-123"
  redirect(`/ai/students/${demoStudentId}`)
}
