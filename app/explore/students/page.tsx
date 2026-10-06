"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PremiumNavbar } from "@/components/premium-navbar"
import { PremiumFooter } from "@/components/premium-footer"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Toaster } from "@/components/ui/toaster"
import { JobData, getAllJobs, getStudentJobPreferences, toggleSaveJob as toggleSaveJobFn } from "@/lib/firebase-service"

export default function StudentJobsPage() {
  const router = useRouter()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [allJobs, setAllJobs] = useState<JobData[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastVisible, setLastVisible] = useState<string | null>(null)

  // Available skill options for filtering
  const skillOptions = [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "MongoDB",
    "Firebase",
    "AWS",
    "UI/UX",
    "Mobile Dev",
    "Data Science",
    "DevOps",
    "Cloud",
  ]

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      setStudentId(user.uid)

      try {
        setIsLoading(true)

        // Fetch all jobs directly from Firebase
        const jobsResult = await getAllJobs(null, 50)
        setAllJobs(jobsResult.jobs)
        setJobs(jobsResult.jobs)
        setFilteredJobs(jobsResult.jobs)
        setLastVisible(jobsResult.lastVisible)
        setHasMore(jobsResult.hasMore)

        // Get student preferences (saved and applied jobs)
        const preferences = await getStudentJobPreferences(user.uid)
        setAppliedJobs(preferences.appliedJobs || [])
        setSavedJobs(preferences.savedJobs || [])
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to fetch jobs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Filter jobs when filters change
  useEffect(() => {
    if (!allJobs.length) return

    let filtered = [...allJobs]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.requirements.some((req) => req.toLowerCase().includes(query)),
      )
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.requirements.some((requirement) =>
          selectedSkills.some((skill) => requirement.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    // Filter by active tab
    if (activeTab === "applied") {
      filtered = filtered.filter((job) => appliedJobs.includes(job.jobId || ""))
    } else if (activeTab === "saved") {
      filtered = filtered.filter((job) => savedJobs.includes(job.jobId || ""))
    }

    setFilteredJobs(filtered)
  }, [searchQuery, selectedSkills, activeTab, allJobs, appliedJobs, savedJobs])

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const saveJob = async (jobId: string) => {
    if (!studentId) return

    try {
      const isSaved = savedJobs.includes(jobId)

      // Use Firebase function directly
      await toggleSaveJobFn(studentId, jobId, !isSaved)

      // Update local state
      if (isSaved) {
        setSavedJobs((prev) => prev.filter((id) => id !== jobId))
        toast.success("Job removed from saved jobs")
      } else {
        setSavedJobs((prev) => [...prev, jobId])
        toast.success("Job saved successfully")
      }
    } catch (error) {
      console.error("Error saving job:", error)
      toast.error("Failed to save job")
    }
  }

  const loadMoreJobs = async () => {
    if (!hasMore || !lastVisible) return

    try {
      setIsLoading(true)
      const jobsResult = await getAllJobs(lastVisible, 20)

      setAllJobs((prev) => [...prev, ...jobsResult.jobs])
      setLastVisible(jobsResult.lastVisible)
      setHasMore(jobsResult.hasMore)
    } catch (error) {
      console.error("Error loading more jobs:", error)
      toast.error("Failed to load more jobs")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">Explore Job Opportunities</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and apply to jobs that match your skills and interests
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 my-4">
              <Input
                placeholder="Search jobs by title, skills, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSkills([])
                }}
              >
                <Icons.x className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2 my-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedSkills.includes(skill)
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {skill}
                  {selectedSkills.includes(skill) && <Icons.check className="ml-1 inline h-3 w-3" />}
                </button>
              ))}
            </div>

            {/* Job Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="animate-in fade-in-50">
                {isLoading && filteredJobs.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <Icons.spinner className="h-8 w-8 animate-spin text-violet-600" />
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJobs.map((job) => (
                        <div
                          key={job.jobId}
                          className="border border-violet-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3
                                className="text-xl font-semibold text-violet-800 dark:text-violet-300 cursor-pointer hover:text-violet-600 dark:hover:text-violet-400"
                                onClick={() => router.push(`/explore/students/${job.jobId}`)}
                              >
                                {job.title}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                              {job.description}
                            </p>

                            {/* Requirements/Skills */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {job.requirements.slice(0, 3).map((req, i) => (
                                  <span
                                    key={i}
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

                            {/* Payment */}
                            <div className="text-lg font-medium text-violet-800 dark:text-violet-300">
                              {job.payment} {job.currency}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex border-t border-violet-100 dark:border-zinc-800">
                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                saveJob(job.jobId || "")
                              }}
                            >
                              {savedJobs.includes(job.jobId || "") ? (
                                <>
                                  <Icons.bookmark className="mr-2 h-4 w-4 fill-current" />
                                  Saved
                                </>
                              ) : (
                                <>
                                  {/* <Icons.bookmarkEmpty className="mr-2 h-4 w-4" /> */}
                                  Save
                                </>
                              )}
                            </Button>

                            <div className="w-px bg-violet-100 dark:bg-zinc-800" />

                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                              onClick={() => router.push(`/explore/students/${job.jobId}`)}
                            >
                              <Icons.externalLink className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMore && activeTab === "all" && (
                      <div className="mt-8 flex justify-center">
                        <Button onClick={loadMoreJobs} disabled={isLoading} variant="outline">
                          {isLoading ? (
                            <>
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load More Jobs"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Icons.search className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      {activeTab === "all"
                        ? "Try adjusting your search or filter criteria."
                        : activeTab === "saved"
                          ? "You haven't saved any jobs yet."
                          : "You haven't applied to any jobs yet."}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <PremiumFooter />
      <Toaster />
    </div>
  )
}
