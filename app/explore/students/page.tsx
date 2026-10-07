"use client"

import { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
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
import {
  StudentJobPreferences,
  getAllJobs,
  getStudentJobPreferences,
  toggleSaveJob as toggleSaveJobFn,
} from "@/lib/firebase-service"

export default function StudentJobsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

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

  const jobsQuery = useInfiniteQuery({
    queryKey: ["jobs", "open"],
    queryFn: ({ pageParam }) => getAllJobs(pageParam, pageParam ? 20 : 50),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.hasMore ? last.lastVisible : undefined),
    enabled: !!studentId,
  })

  const preferencesQuery = useQuery({
    queryKey: ["student", "jobPreferences", studentId],
    queryFn: () => getStudentJobPreferences(studentId as string),
    enabled: !!studentId,
  })

  const allJobs = useMemo(() => jobsQuery.data?.pages.flatMap((page) => page.jobs) ?? [], [jobsQuery.data])
  const appliedJobs = useMemo(() => preferencesQuery.data?.appliedJobs ?? [], [preferencesQuery.data])
  const savedJobs = useMemo(() => preferencesQuery.data?.savedJobs ?? [], [preferencesQuery.data])
  const hasMore = jobsQuery.data?.pages.at(-1)?.hasMore ?? false
  const isLoading = jobsQuery.isPending || preferencesQuery.isPending
  const isLoadingMore = jobsQuery.isFetchingNextPage

  const filteredJobs = useMemo(() => {
    let filtered = allJobs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.requirements.some((req) => req.toLowerCase().includes(query)),
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.requirements.some((requirement) =>
          selectedSkills.some((skill) => requirement.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    if (activeTab === "applied") {
      filtered = filtered.filter((job) => appliedJobs.includes(job.jobId || ""))
    } else if (activeTab === "saved") {
      filtered = filtered.filter((job) => savedJobs.includes(job.jobId || ""))
    }

    return filtered
  }, [allJobs, searchQuery, selectedSkills, activeTab, appliedJobs, savedJobs])

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const saveJob = async (jobId: string) => {
    if (!studentId) return

    const preferencesKey = ["student", "jobPreferences", studentId]
    const isSaved = savedJobs.includes(jobId)

    try {
      queryClient.setQueryData<StudentJobPreferences>(preferencesKey, (previous) =>
        previous
          ? {
              ...previous,
              savedJobs: isSaved ? previous.savedJobs.filter((id) => id !== jobId) : [...previous.savedJobs, jobId],
            }
          : previous,
      )
      await toggleSaveJobFn(studentId, jobId, !isSaved)
      await queryClient.invalidateQueries({ queryKey: preferencesKey })
      toast.success(isSaved ? "Job removed from saved jobs" : "Job saved successfully")
    } catch (error) {
      console.error("Error saving job:", error)
      await queryClient.invalidateQueries({ queryKey: preferencesKey })
      toast.error("Failed to save job")
    }
  }

  const loadMoreJobs = () => {
    if (jobsQuery.hasNextPage && !jobsQuery.isFetchingNextPage) void jobsQuery.fetchNextPage()
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <PremiumNavbar />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">Explore Job Opportunities</h1>
            <p className="text-muted-foreground">Find and apply to jobs that match your skills and interests</p>

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
                    selectedSkills.includes(skill) ? "bg-primary text-white" : "bg-muted text-foreground"
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
                    <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJobs.map((job) => (
                        <div
                          key={job.jobId}
                          className="border border-border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3
                                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary"
                                onClick={() => router.push(`/explore/students/${job.jobId}`)}
                              >
                                {job.title}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  job.status === "open"
                                    ? "bg-success/10 text-success"
                                    : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{job.description}</p>

                            {/* Requirements/Skills */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {job.requirements.slice(0, 3).map((req, i) => (
                                  <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                    {req}
                                  </span>
                                ))}
                                {job.requirements.length > 3 && (
                                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                                    +{job.requirements.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Payment */}
                            <div className="text-lg font-medium text-foreground">
                              {job.payment} {job.currency}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex border-t border-border">
                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
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

                            <div className="w-px bg-primary/10" />

                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
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
                        <Button onClick={loadMoreJobs} disabled={isLoadingMore} variant="outline">
                          {isLoadingMore ? (
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
                    <Icons.search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground max-w-md">
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
