"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PremiumNavbar } from "@/components/premium-navbar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getRecruiterJobs, JobData, createJob } from "@/lib/firebase-service"
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
import { format } from "date-fns"

export default function RecruiterJobsPage() {
  const router = useRouter()
  const [recruiterId, setRecruiterId] = useState<string | null>(null)
  const [recruiter, setRecruiter] = useState<any>(null)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOption, setSortOption] = useState<"recent" | "applicants" | "payment">("recent")
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Job creation state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [jobFormData, setJobFormData] = useState<Omit<JobData, "postedBy" | "createdAt" | "updatedAt" | "applicants">>({
    title: "",
    description: "",
    requirements: [],
    payment: 0,
    currency: "INR",
    status: "open",
  })
  const [requirementInput, setRequirementInput] = useState("")
  const [isSubmittingJob, setIsSubmittingJob] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      setRecruiterId(user.uid)

      try {
        setIsLoading(true)
        const jobsData = await getRecruiterJobs(user.uid)
        setJobs(jobsData)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch jobs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recruiterId) {
      toast.error("Please login first")
      return
    }

    try {
      setIsSubmittingJob(true)
      await createJob({
        ...jobFormData,
        postedBy: recruiterId,
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Refresh jobs list
      const updatedJobs = await getRecruiterJobs(recruiterId)
      setJobs(updatedJobs)

      toast.success("Job created successfully!")
      setIsJobModalOpen(false)

      // Reset form
      setJobFormData({
        title: "",
        description: "",
        requirements: [],
        payment: 0,
        currency: "INR",
        status: "open",
      })
    } catch (error) {
      console.error("Error creating job:", error)
      toast.error("Failed to create job. Please try again.")
    } finally {
      setIsSubmittingJob(false)
    }
  }

  const handleAddRequirement = () => {
    if (requirementInput.trim() && !jobFormData.requirements.includes(requirementInput.trim())) {
      setJobFormData({
        ...jobFormData,
        requirements: [...jobFormData.requirements, requirementInput.trim()],
      })
      setRequirementInput("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setJobFormData({
      ...jobFormData,
      requirements: jobFormData.requirements.filter((_, i) => i !== index),
    })
  }

  const filteredJobs = jobs
    .filter((job) => {
      // Filter by status
      if (filterStatus !== "all" && job.status !== filterStatus) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.requirements.some((req) => req.toLowerCase().includes(query))
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortOption === "recent") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else if (sortOption === "applicants") {
        return b.applicants.length - a.applicants.length
      } else {
        return b.payment - a.payment
      }
    })

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar recruiterId={recruiterId || ""} />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Job Postings</h1>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setIsJobModalOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search jobs by title, description or requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "open" | "closed")}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as "recent" | "applicants" | "payment")}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="recent">Most Recent</option>
                <option value="applicants">Most Applicants</option>
                <option value="payment">Highest Payment</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin text-violet-600">
                <Icons.spinner className="h-8 w-8" />
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="border border-violet-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                  onClick={() => router.push(`/explore/recruiters/job/${job.jobId}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold truncate">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{job.description}</p>

                  {job.requirements.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 text-xs px-2 py-1 rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Icons.users className="h-4 w-4" />
                      <span>{job.applicants.length} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-lg">{job.payment}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{job.currency}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Posted {format(job.createdAt, "MMM d, yyyy")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <Icons.briefcase className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first job posting to get started"}
              </p>
              <Button onClick={() => setIsJobModalOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
                <Icons.plus className="mr-2 h-4 w-4" /> Create New Job
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Job Creation Modal */}
      <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>Fill in the details to post a new job opportunity.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJob} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Frontend Developer"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities and expectations..."
                  rows={4}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <div className="flex space-x-2">
                  <Input
                    id="requirements"
                    placeholder="e.g. React, Next.js, Tailwind"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddRequirement()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddRequirement} className="w-[80px]">
                    Add
                  </Button>
                </div>

                {jobFormData.requirements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {jobFormData.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="ml-1 rounded-full hover:bg-violet-200 p-1"
                        >
                          <Icons.close className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Amount</Label>
                  <Input
                    id="payment"
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={jobFormData.payment}
                    onChange={(e) => setJobFormData({ ...jobFormData, payment: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={jobFormData.currency}
                    onChange={(e) => setJobFormData({ ...jobFormData, currency: e.target.value })}
                    required
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={jobFormData.status}
                  onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value as "open" | "closed" })}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsJobModalOpen(false)}
                disabled={isSubmittingJob}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!jobFormData.title || !jobFormData.description || isSubmittingJob}>
                {isSubmittingJob ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
