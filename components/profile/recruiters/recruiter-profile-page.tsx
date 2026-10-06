"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecruiterProfileHeader } from "@/components/profile/recruiters/recruiter-profile-header"
import { RecruiterAbout } from "@/components/profile/recruiters/recruiter-about"
import { RecruiterCompany } from "@/components/profile/recruiters/recruiter-company"
import { RecruiterHiringNeeds } from "@/components/profile/recruiters/recruiter-hiring-needs"
import { RecruiterActivity } from "@/components/profile/recruiters/recruiter-activity"
import { RecruiterTestimonials } from "@/components/profile/recruiters/recruiter-testimonials"
import { RecruiterStats } from "@/components/profile/recruiters/recruiter-stats"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RecruiterProfilePageProps {
  recruiter: any
  isEditable?: boolean
  onUpdate?: (section: string, data: any) => void
}

export function RecruiterProfilePage({ recruiter, isEditable = false, onUpdate }: RecruiterProfilePageProps) {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <RecruiterProfileHeader recruiter={recruiter} isEditable={isEditable} onUpdate={onUpdate} />

      {/* Verification Warning Badge - Only show when user is not verified */}
      {recruiter.verified !== true && isEditable && (
        <div className="my-4 relative overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md dark:border-amber-900/50 dark:from-amber-900/20 dark:to-amber-800/20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
          </div>

          <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-600 dark:bg-amber-900/50 dark:text-amber-500">
                <Icons.alertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-300">
                  Your recruiter profile is not verified
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Verified recruiter profiles get more candidate applications and trust
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                toast.info("Verification feature coming soon!")
              }}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
            >
              <Icons.shieldCheck className="mr-1.5 h-4 w-4" />
              Get Verified
            </Button>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        </div>
      )}

      {/* Success badge when user is verified */}
      {recruiter.verified === true && isEditable && (
        <div className="my-4 relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-md dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
          </div>

          <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-green-600 dark:bg-green-900/50 dark:text-green-500">
                <Icons.checkCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-300">Your recruiter profile is verified</h3>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Your profile has increased visibility and credibility with candidates
                </p>
              </div>
            </div>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
        </div>
      )}

      {isEditable && (
        <div className="mx-auto mb-6 mt-2 flex items-center justify-center">
          <div className="rounded-full bg-amber-100 px-4 py-1 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <span className="flex items-center">
              <Icons.edit className="mr-1.5 h-3.5 w-3.5" />
              You are editing your own profile
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="hiring">Hiring Needs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <RecruiterAbout recruiter={recruiter} isEditable={isEditable} onUpdate={onUpdate} />
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <RecruiterCompany recruiter={recruiter} isEditable={isEditable} onUpdate={onUpdate} />
            </TabsContent>

            <TabsContent value="hiring" className="mt-0">
              <RecruiterHiringNeeds recruiter={recruiter} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <RecruiterActivity recruiter={recruiter} />
            </TabsContent>

            <TabsContent value="testimonials" className="mt-0">
              <RecruiterTestimonials testimonials={recruiter.testimonials} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <RecruiterStats recruiter={recruiter} />
        </div>
      </div>
    </div>
  )
}
