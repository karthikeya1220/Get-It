"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PremiumNavbar } from "@/components/premium-navbar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getJobById, getStudentsByIds, updateJobStatus, JobData, StudentData, updateJob } from "@/lib/firebase-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const jobId = id as string

  const [recruiterId, setRecruiterId] = useState<string | null>(null)
  const [job, setJob] = useState<JobData | null>(null)
  const [applicants, setApplicants] = useState<StudentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  // Message modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<StudentData | null>(null)
  const [messageText, setMessageText] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Edit job modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editedJob, setEditedJob] = useState<JobData | null>(null)
  const [requirementInput, setRequirementInput] = useState("")
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

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
        const jobData = await getJobById(jobId)
        console.log("job id", jobData)

        // Make sure the job exists and belongs to this recruiter
        if (!jobData) {
          toast.error("Job not found")
          router.push("/explore/recruiters/job")
          return
        }

        if (jobData.postedBy !== user.uid) {
          toast.error("You don't have permission to view this job")
          router.push("/explore/recruiters/job")
          return
        }

        setJob(jobData)
        setEditedJob({ ...jobData }) // Clone for edit form

        // Fetch applicant details if there are any
        if (jobData.applicants.length > 0) {
          const applicantData = await getStudentsByIds(jobData.applicants)
          console.log("applicant data", applicantData)
          setApplicants(applicantData)
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch job details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [jobId, router])

  const handleStatusChange = async (newStatus: "open" | "closed") => {
    if (!job || !job.jobId) return

    try {
      await updateJobStatus(job.jobId, newStatus)
      setJob({ ...job, status: newStatus })
      toast.success(`Job ${newStatus === "open" ? "opened" : "closed"} successfully`)
    } catch (error) {
      console.error("Error updating job status:", error)
      toast.error("Failed to update job status")
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplicant || !messageText.trim()) return

    setIsSendingMessage(true)

    // In a real app, you'd send the message to the student through your backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`Message sent to ${selectedApplicant.fullName}`)
      setMessageModalOpen(false)
      setMessageText("")
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedJob || !job?.jobId) return

    setIsSubmittingEdit(true)

    try {
      // Update job in the database
      await updateJob(job.jobId, editedJob)

      // Update local state
      setJob(editedJob)
      toast.success("Job updated successfully")
      setEditModalOpen(false)
    } catch (error) {
      console.error("Error updating job:", error)
      toast.error("Failed to update job")
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const handleAddRequirement = () => {
    if (!editedJob || !requirementInput.trim()) return

    if (!editedJob.requirements.includes(requirementInput.trim())) {
      setEditedJob({
        ...editedJob,
        requirements: [...editedJob.requirements, requirementInput.trim()],
      })
      setRequirementInput("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    if (!editedJob) return

    setEditedJob({
      ...editedJob,
      requirements: editedJob.requirements.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar recruiterId={recruiterId || ""} />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin text-violet-600">
                <Icons.spinner className="h-8 w-8" />
              </div>
            </div>
          ) : job ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/explore/recruiters/job")}
                      className="p-0 h-auto"
                    >
                      <Icons.arrowLeft className="h-4 w-4 mr-1" />
                      Back to jobs
                    </Button>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                    <Icons.edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </Button>

                  {job.status === "open" ? (
                    <Button
                      variant="outline"
                      className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                      onClick={() => handleStatusChange("closed")}
                    >
                      <Icons.x className="h-4 w-4 mr-2" />
                      Close Job
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-green-200 hover:border-green-300 hover:bg-green-50 text-green-600"
                      onClick={() => handleStatusChange("open")}
                    >
                      <Icons.check className="h-4 w-4 mr-2" />
                      Reopen Job
                    </Button>
                  )}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="applicants">Applicants ({applicants.length})</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="details"
                  className="p-6 bg-white dark:bg-zinc-950 rounded-lg border border-violet-200 dark:border-zinc-800 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">{job.description}</p>

                      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                      {job.requirements.length > 0 ? (
                        <ul className="list-disc pl-5 mb-6 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              {req}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 mb-6">No specific requirements listed.</p>
                      )}
                    </div>

                    <div>
                      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Job Details</h3>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                            <p className="font-medium text-lg">
                              {job.payment} {job.currency}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <p className={`font-medium ${job.status === "open" ? "text-green-600" : "text-red-600"}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Posted on</p>
                            <p className="font-medium">{format(job.createdAt, "MMMM d, yyyy")}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
                            <p className="font-medium">{format(job.updatedAt, "MMMM d, yyyy")}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Applicants</p>
                            <p className="font-medium">{job.applicants.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="applicants">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Icons.spinner className="h-8 w-8 animate-spin text-violet-600" />
                    </div>
                  ) : job?.applicants && job.applicants.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">
                          {job.applicants.length} {job.applicants.length === 1 ? "Applicant" : "Applicants"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Review applicant profiles and contact qualified candidates.
                        </p>
                      </div>

                      {applicants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {applicants.map((applicant) => (
                            <div
                              key={applicant.id}
                              className="border border-violet-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm p-6"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold mb-1">
                                    {applicant.fullName || "Unnamed Student"}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {applicant.university || "University not specified"}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  {applicant.matchScore !== undefined && (
                                    <div className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 text-xs px-2 py-1 rounded-full">
                                      <Icons.star className="h-3 w-3" />
                                      <span>{applicant.matchScore}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Skills</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {applicant.skills && applicant.skills.length > 0 ? (
                                    <>
                                      {applicant.skills.slice(0, 5).map((skill, index) => (
                                        <span
                                          key={index}
                                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                                        >
                                          {skill.name}
                                        </span>
                                      ))}
                                      {applicant.skills.length > 5 && (
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                                          +{applicant.skills.length - 5} more
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">No skills listed</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                                <Button
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedApplicant(applicant)
                                    setMessageModalOpen(true)
                                  }}
                                >
                                  <Icons.mail className="mr-2 h-4 w-4" />
                                  Contact
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => {
                                    // Navigate to student profile
                                    router.push(`/profiles/students/${applicant.id}`)
                                  }}
                                >
                                  <Icons.user className="mr-2 h-4 w-4" />
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
                          <Icons.alertTriangle className="h-8 w-8 text-amber-500 mb-4" />
                          <h3 className="text-xl font-medium text-amber-700 dark:text-amber-500 mb-2">
                            Applicant Details Unavailable
                          </h3>
                          <p className="text-amber-600 dark:text-amber-400 text-center mb-4">
                            There are {job.applicants.length} applicant(s), but we couldn't load their details.
                          </p>
                          <Button variant="outline" onClick={() => window.location.reload()}>
                            <Icons.refresh className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                      <Icons.users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No applicants yet</h3>
                      <p className="text-gray-500 dark:text-gray-500 mb-6">
                        {job?.status === "open"
                          ? "When students apply for this job, they'll appear here."
                          : "This job is currently closed. Reopen it to receive more applications."}
                      </p>
                      {job?.status === "closed" && (
                        <Button
                          onClick={() => handleStatusChange("open")}
                          className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          <Icons.check className="mr-2 h-4 w-4" /> Reopen Job
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Icons.warning className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Job not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The job you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => router.push("/explore/recruiters/job")}>Go to My Jobs</Button>
            </div>
          )}
        </div>
      </main>

      {/* Message Applicant Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Applicant</DialogTitle>
            <DialogDescription>
              {selectedApplicant && `Send a message to ${selectedApplicant.fullName}`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMessageSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                rows={5}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMessageModalOpen(false)}
                disabled={isSendingMessage}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!messageText.trim() || isSendingMessage}>
                {isSendingMessage ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Make changes to your job posting.</DialogDescription>
          </DialogHeader>

          {editedJob && (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    placeholder="e.g. Frontend Developer"
                    value={editedJob.title}
                    onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Job Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Describe the job responsibilities and expectations..."
                    rows={4}
                    value={editedJob.description}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-requirements">Requirements</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="edit-requirements"
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

                  {editedJob.requirements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {editedJob.requirements.map((req, index) => (
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
                    <Label htmlFor="edit-payment">Payment Amount</Label>
                    <Input
                      id="edit-payment"
                      type="number"
                      min="0"
                      placeholder="e.g. 5000"
                      value={editedJob.payment}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          payment: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-currency">Currency</Label>
                    <select
                      id="edit-currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editedJob.currency}
                      onChange={(e) => setEditedJob({ ...editedJob, currency: e.target.value })}
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
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editedJob.status}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        status: e.target.value as "open" | "closed",
                      })
                    }
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
                  onClick={() => setEditModalOpen(false)}
                  disabled={isSubmittingEdit}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!editedJob.title || !editedJob.description || isSubmittingEdit}>
                  {isSubmittingEdit ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
