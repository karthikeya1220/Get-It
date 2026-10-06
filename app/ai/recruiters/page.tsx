import { redirect } from "next/navigation"

export default function AiRecruitersPage() {
  // In a real app, you would check if the user is logged in and get their ID
  // For now, we'll redirect to a demo recruiter profile
  const demoRecruiterId = "recruiter-123"
  redirect(`/ai/recruiters/${demoRecruiterId}`)
}
