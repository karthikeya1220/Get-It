import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI-Powered Recruiting | GetIT",
  description: "AI tools for recruiters to find and evaluate talent more effectively",
}

interface AiRecruiterPageProps {
  params: Promise<{
    recruiterId: string
  }>
}

export default async function AiRecruiterPage({ params }: AiRecruiterPageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:px-8 lg:px-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-violet-900 dark:text-white">AI-Powered Recruiting Tools</h1>
          <p className="mt-2 text-lg text-violet-700 dark:text-violet-300">
            Coming soon: Advanced AI tools to help you find and evaluate talent more effectively.
          </p>
        </div>

        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-amber-50 dark:from-violet-950/50 dark:to-amber-950/50">
            <CardTitle className="text-violet-900 dark:text-white">AI Recruiting Assistant</CardTitle>
            <CardDescription>This feature is currently under development</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-violet-100 p-4 dark:bg-violet-900/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-violet-600 dark:text-violet-400"
                >
                  <path d="M12 2a8 8 0 0 1 8 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a8 8 0 0 1 8-8z"></path>
                  <path d="M20 10a8 8 0 0 0-16 0"></path>
                  <path d="M8 16v-4"></path>
                  <path d="M16 16v-4"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-violet-900 dark:text-white">Coming Soon</h3>
              <p className="mb-6 max-w-md text-violet-700 dark:text-violet-300">
                We're working on powerful AI tools to help recruiters find, evaluate, and engage with talent more
                effectively.
              </p>
              <Button>Join Waitlist</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
