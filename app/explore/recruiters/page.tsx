"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { PremiumNavbar } from "@/components/premium-navbar"
import { RecruiterExploreHeader } from "@/components/explore/recruiters/recruiter-explore-header"
import { RecruiterFilters } from "@/components/explore/recruiters/recruiter-filters"
import { StudentProfileList } from "@/components/explore/recruiters/student-profile-list"
import { StudentDetailModal } from "@/components/explore/recruiters/student-detail-modal"
import { ContactStudentModal } from "@/components/explore/recruiters/contact-student-modal"
import { SavedSearchModal } from "@/components/explore/recruiters/saved-search-modal"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getAllStudents, calculateMatchScore } from "@/lib/firebase-service"
import { useRouter } from "next/navigation"
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
import { createJob, JobData } from "@/lib/firebase-service"

// Add interface for Student type
interface Student {
  id: string
  fullName: string
  email: string
  university: string
  degree: string
  year: string
  skills: string[]
  interests: string[]
  jobType: string
  portfolioLinks: {
    github?: string
    linkedin?: string
    behance?: string
    dribbble?: string
  }
  preferences: {
    notifications: boolean
    updates: boolean
  }
  certifications?: string
  coursework?: string
  experience?: string
  preferredLocations?: string[]
  preferredRoles?: string[]
  availability?: string
  matchScore?: number
  createdAt: Date
  updatedAt: Date
}

export default function RecruiterExplorePage() {
  const router = useRouter()
  const [recruiterId, setRecruiterId] = useState<string | null>(null)

  const [recruiter, setRecruiter] = useState<any>(null)

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("recommended")
  const [filters, setFilters] = useState({
    skills: [] as string[],
    universities: [] as string[],
    graduationYears: [] as number[],
    locations: [] as string[],
    roles: [] as string[],
    searchQuery: "",
    availability: "all",
  })
  const [savedStudents, setSavedStudents] = useState<string[]>([])
  const [contactedStudents, setContactedStudents] = useState<string[]>([])

  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 10

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }
      setRecruiterId(user.uid)
    })

    return () => unsubscribe()
  }, [router])

  const {
    data: fetchedStudents,
    isPending: isLoading,
    isError,
    error,
  } = useQuery<Student[]>({
    queryKey: ["recruiter-explore", "students"],
    queryFn: () => getAllStudents(),
    enabled: !!recruiterId,
  })

  useEffect(() => {
    if (isError) {
      console.error("Error:", error)
      toast.error("Failed to fetch data. Please try again.")
    }
  }, [isError, error])

  const students = useMemo(
    () => (fetchedStudents ?? []).map((student) => ({ ...student, matchScore: calculateMatchScore(student) })),
    [fetchedStudents],
  )

  const filterOptions = useMemo(() => {
    if (!fetchedStudents) {
      return {
        availableSkills: [
          "web-dev",
          "ui-ux",
          "mobile-dev",
          "backend",
          "frontend",
          "fullstack",
          "cloud",
          "devops",
          "machine-learning",
          "data-science",
        ],
        universities: ["iiitdm", "iit-madras", "nit-trichy", "vit", "bits-pilani"],
        graduationYears: [2024, 2025, 2026, 2027],
        locations: ["bangalore", "hyderabad", "chennai", "mumbai", "delhi", "pune"],
        roles: [
          "software-engineer",
          "frontend-developer",
          "backend-developer",
          "full-stack-developer",
          "ui-ux-designer",
          "data-scientist",
          "devops-engineer",
        ],
      }
    }

    const uniqueSkills = new Set<string>()
    const uniqueUniversities = new Set<string>()
    const uniqueLocations = new Set<string>()
    const uniqueRoles = new Set<string>()

    students.forEach((student) => {
      student.skills?.forEach((skill) => uniqueSkills.add(skill))
      if (student.university) uniqueUniversities.add(student.university)
      if (student.preferredLocations) {
        student.preferredLocations.forEach((loc) => uniqueLocations.add(loc))
      }
      if (student.preferredRoles) {
        student.preferredRoles.forEach((role) => uniqueRoles.add(role))
      }
    })

    return {
      availableSkills: Array.from(uniqueSkills),
      universities: Array.from(uniqueUniversities),
      graduationYears: [2024, 2025, 2026, 2027],
      locations: Array.from(uniqueLocations),
      roles: Array.from(uniqueRoles),
    }
  }, [fetchedStudents, students])

  // Filter students based on selected filters
  const filteredStudents = useMemo(() => {
    let result = [...students]

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (student) =>
          student.fullName?.toLowerCase().includes(query) ||
          student.skills?.some((skill: string) => skill.toLowerCase().includes(query)) ||
          student.university?.toLowerCase().includes(query) ||
          student.degree?.toLowerCase().includes(query),
      )
    }

    // Filter by skills
    if (filters.skills.length > 0) {
      result = result.filter((student) => filters.skills.every((skill) => student.skills?.includes(skill)))
    }

    // Filter by universities
    if (filters.universities.length > 0) {
      result = result.filter((student) => filters.universities.includes(student.university))
    }

    // Filter by graduation years
    if (filters.graduationYears.length > 0) {
      result = result.filter((student) => filters.graduationYears.includes(parseInt(student.year)))
    }

    // Filter by preferred locations
    if (filters.locations.length > 0) {
      result = result.filter((student) =>
        student.preferredLocations?.some((location: string) => filters.locations.includes(location)),
      )
    }

    // Filter by preferred roles
    if (filters.roles.length > 0) {
      result = result.filter((student) => student.preferredRoles?.some((role: string) => filters.roles.includes(role)))
    }

    // Filter by availability
    if (filters.availability !== "all") {
      if (filters.availability === "immediate") {
        result = result.filter((student) => student.availability?.toLowerCase().includes("immediate"))
      } else if (filters.availability === "internship") {
        result = result.filter((student) => student.availability?.toLowerCase().includes("internship"))
      }
    }

    // Filter by active tab
    if (activeTab === "saved") {
      result = result.filter((student) => savedStudents.includes(student.id))
    } else if (activeTab === "contacted") {
      result = result.filter((student) => contactedStudents.includes(student.id))
    } else if (activeTab === "recommended") {
      // Sort by match score for recommended tab
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    }

    return result
  }, [filters, students, activeTab, savedStudents, contactedStudents])

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student)
    setIsDetailModalOpen(true)
  }

  const handleContactStudent = (student: any) => {
    setSelectedStudent(student)
    setIsDetailModalOpen(false)
    setIsContactModalOpen(true)
  }

  const handleSaveStudent = (studentId: string) => {
    if (savedStudents.includes(studentId)) {
      setSavedStudents(savedStudents.filter((id) => id !== studentId))
      toast.success("Student removed from saved list", {
        description: "You can add them back anytime.",
      })
    } else {
      setSavedStudents([...savedStudents, studentId])
      toast.success("Student saved to your list", {
        description: "You can view all saved students in the Saved tab.",
      })
    }
  }

  const handleContactSubmit = (message: string) => {
    if (selectedStudent) {
      setContactedStudents([...contactedStudents, selectedStudent.id])
      setIsContactModalOpen(false)
      toast.success("Message sent successfully", {
        description: `Your message has been sent to ${selectedStudent.fullName}.`,
      })
    }
  }

  const handleSaveSearch = (searchName: string) => {
    setIsSavedSearchModalOpen(false)
    toast.success("Search saved successfully", {
      description: `Your search "${searchName}" has been saved.`,
    })
  }

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <PremiumNavbar recruiterId={recruiterId || ""} />

      <main className="flex-1 pt-16">
        {recruiter && (
          <RecruiterExploreHeader
            recruiter={recruiter}
            totalResults={filteredStudents.length}
            onSaveSearch={() => setIsSavedSearchModalOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <div className="container mt-4 mb-8 text-right">
          <Button className="bg-primary hover:bg-primary text-white" onClick={() => setIsJobModalOpen(true)}>
            <Icons.plus className="mr-2 h-4 w-4" /> Create New Job
          </Button>
        </div>

        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <RecruiterFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                availableSkills={filterOptions.availableSkills}
                universities={filterOptions.universities}
                graduationYears={filterOptions.graduationYears}
                locations={filterOptions.locations}
                roles={filterOptions.roles}
              />
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="animate-spin text-primary">
                    <Icons.spinner className="h-8 w-8" />
                  </div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                  <Icons.search className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">No candidates found</h3>
                  <p className="text-sm text-muted-foreground">
                    {students.length === 0
                      ? "No students have registered yet. Please check back later."
                      : "Try adjusting your filters or search criteria to find more candidates."}
                  </p>
                </div>
              ) : (
                <StudentProfileList
                  students={filteredStudents}
                  onStudentClick={handleStudentClick}
                  savedStudents={savedStudents}
                  onSaveStudent={handleSaveStudent}
                  contactedStudents={contactedStudents}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedStudent && (
        <>
          <StudentDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            student={selectedStudent}
            onContact={() => handleContactStudent(selectedStudent)}
            isSaved={savedStudents.includes(selectedStudent.id)}
            onSave={() => handleSaveStudent(selectedStudent.id)}
          />

          <ContactStudentModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            student={selectedStudent}
            onSubmit={handleContactSubmit}
          />
        </>
      )}

      <SavedSearchModal
        isOpen={isSavedSearchModalOpen}
        onClose={() => setIsSavedSearchModalOpen(false)}
        onSave={handleSaveSearch}
        currentFilters={filters}
      />

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
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="ml-1 rounded-full hover:bg-primary/20 p-1"
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
                    onChange={(e) => setJobFormData({ ...jobFormData, payment: parseInt(e.target.value) })}
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
