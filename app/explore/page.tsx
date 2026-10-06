import { redirect } from "next/navigation"

// /explore is a legacy bookmark target; the real student explorer is /explore/students.
export default function ExploreRedirect() {
  redirect("/explore/students")
}
