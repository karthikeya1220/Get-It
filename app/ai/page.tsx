import { redirect } from "next/navigation"

export default function AiPage() {
  // In a real app, you would check if the user is logged in and their role
  // For now, we'll redirect to the students AI page
  redirect("/ai/students")
}
