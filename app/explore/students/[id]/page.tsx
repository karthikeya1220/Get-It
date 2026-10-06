"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PremiumNavbar } from "@/components/premium-navbar"
import { PremiumFooter } from "@/components/premium-footer"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  getJobById,
  applyForJob,
  JobData,
  toggleSaveJob as toggleSaveJobFn,
  submitJobApplication,
  hasStudentAppliedToJob,
  getStudentJobPreferences,
} from "@/lib/firebase-service"
import { format } from "date-fns"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const jobId = id as string

  const [studentId, setStudentId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Application modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: "",
    phoneNumber: "",
    availability: "",
    portfolioLink: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      setStudentId(user.uid)
    })

    return () => unsubscribe()
  }, [router])

  const { data: job = null, isPending: isJobPending } = useQuery<JobData | null>({
    queryKey: ["job", jobId],
    queryFn: async () => {
      try {
        const jobData = await getJobById(jobId)

        if (!jobData) {
          toast.error("Job not found")
          router.push("/explore/students")
        }

        return jobData
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch job details. Please try again.")
        return null
      }
    },
    enabled: !!studentId,
  })

  const { data: hasApplied = false, isPending: isAppliedPending } = useQuery<boolean>({
    queryKey: ["job", jobId, "application", studentId],
    queryFn: async () => {
      try {
        return await hasStudentAppliedToJob(studentId!, jobId)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch job details. Please try again.")
        return false
      }
    },
    enabled: !!studentId,
  })

  const { data: isSaved = false, isPending: isSavedPending } = useQuery<boolean>({
    queryKey: ["job", jobId, "saved", studentId],
    queryFn: async () => {
      try {
        const preferences = await getStudentJobPreferences(studentId!)
        return preferences.savedJobs.includes(jobId)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch job details. Please try again.")
        return false
      }
    },
    enabled: !!studentId,
  })

  const isLoading = isJobPending || isAppliedPending || isSavedPending

  const handleToggleSaveJob = async () => {
    if (!studentId || !jobId) return

    try {
      await toggleSaveJobFn(studentId, jobId, !isSaved)
      queryClient.setQueryData(["job", jobId, "saved", studentId], !isSaved)
      toast.success(isSaved ? "Job removed from saved jobs" : "Job saved successfully")
      queryClient.invalidateQueries({ queryKey: ["job", jobId] })
    } catch (error) {
      console.error("Error saving job:", error)
      toast.error("Failed to save job")
    }
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !jobId) return

    try {
      setIsSubmitting(true)

      // Submit application with all details
      await submitJobApplication({
        studentId,
        jobId,
        ...applicationForm,
        appliedAt: new Date(),
      })

      queryClient.setQueryData(["job", jobId, "application", studentId], true)
      toast.success("Application submitted successfully!")
      setIsApplyModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ["job", jobId] })
    } catch (error) {
      console.error("Error applying for job:", error)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Icons.spinner className="h-8 w-8 animate-spin text-violet-600" />
            </div>
          ) : job ? (
            <>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/explore/students")}
                  className="p-0 h-auto mb-4"
                >
                  <Icons.arrowLeft className="h-4 w-4 mr-1" />
                  Back to jobs
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold">{job.title}</h1>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                      {job.payment} {job.currency}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className={isSaved ? "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100" : ""}
                      onClick={handleToggleSaveJob}
                    >
                      {isSaved ? (
                        <>
                          <Icons.bookmark className="mr-2 h-4 w-4 fill-current" />
                          Saved
                        </>
                      ) : (
                        <>
                          {/* <Icons.bookmarkEmpty className="mr-2 h-4 w-4" /> */}
                          Save Job
                        </>
                      )}
                    </Button>

                    {job.status === "open" && (
                      <Button disabled={hasApplied} onClick={() => setIsApplyModalOpen(true)}>
                        {hasApplied ? (
                          <>
                            <Icons.check className="mr-2 h-4 w-4" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Icons.send className="mr-2 h-4 w-4" />
                            Apply Now
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-zinc-950 rounded-lg border border-violet-200 dark:border-zinc-800 p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">{job.description}</p>

                    <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                    {job.requirements && job.requirements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {job.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No specific requirements listed</p>
                    )}
                  </div>

                  {hasApplied && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <Icons.check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-green-700 dark:text-green-400">You've applied to this job</h3>
                          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                            The recruiter will review your application and reach out if there's a match.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="bg-white dark:bg-zinc-950 rounded-lg border border-violet-200 dark:border-zinc-800 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Job Details</h2>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posted On</p>
                        <p className="font-medium">{format(job.createdAt, "MMMM d, yyyy")}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <p className={`font-medium ${job.status === "open" ? "text-green-600" : "text-red-600"}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                        <p className="font-medium">
                          {job.payment} {job.currency}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No. of Applicants</p>
                        <p className="font-medium">{job.applicants?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {job.status === "open" && !hasApplied && (
                    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800/40">
                      <h3 className="font-medium text-lg mb-2">Ready to apply?</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Submit your application now to express your interest in this opportunity.
                      </p>
                      <Button className="w-full" onClick={() => setIsApplyModalOpen(true)}>
                        Apply for this Job
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Icons.x className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/explore/students")}>Browse All Jobs</Button>
            </div>
          )}
        </div>
      </main>

      {/* Apply to Job Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {job?.title}</DialogTitle>
            <DialogDescription>
              Fill out this form to apply for the position. A complete application increases your chances of getting
              noticed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Describe why you're a good fit for this position..."
                rows={5}
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Your contact number"
                value={applicationForm.phoneNumber}
                onChange={(e) => setApplicationForm({ ...applicationForm, phoneNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                placeholder="When can you start? Are there any constraints to your availability?"
                value={applicationForm.availability}
                onChange={(e) => setApplicationForm({ ...applicationForm, availability: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioLink">Portfolio/LinkedIn/GitHub Link (Optional)</Label>
              <Input
                id="portfolioLink"
                placeholder="https://"
                value={applicationForm.portfolioLink}
                onChange={(e) => setApplicationForm({ ...applicationForm, portfolioLink: e.target.value })}
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-md p-4 text-sm text-amber-800 dark:text-amber-300">
              <p className="flex items-center">
                <Icons.info className="h-4 w-4 mr-2" />
                Your profile information will automatically be shared with the recruiter.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !applicationForm.coverLetter ||
                  !applicationForm.phoneNumber ||
                  !applicationForm.availability ||
                  isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PremiumFooter />
      <Toaster />
    </div>
  )
}
