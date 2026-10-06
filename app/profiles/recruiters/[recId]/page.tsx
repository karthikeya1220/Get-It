"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { RecruiterProfilePage as RecruiterProfilePageComponent } from "@/components/profile/recruiters/recruiter-profile-page"
import { toast } from "sonner"
import { getRecruiterProfile, updateRecruiterProfile } from "@/lib/firebase-service"
import { PremiumNavbar } from "@/components/premium-navbar"
import { PremiumFooter } from "@/components/premium-footer"

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
}

export default function RecruiterProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { recId } = params

  // Default profile structure
  const defaultRecruiterProfile = useMemo(
    () => ({
      id: recId as string,
      fullName: "",
      email: "",
      jobTitle: "",
      phoneNumber: "",
      linkedinProfile: "",
      companyName: "",
      companyWebsite: "",
      industry: "",
      companySize: "",
      companyDescription: "",
      companyLocation: "",
      hiringRoles: [],
      skillsNeeded: [],
      hiringTimeline: "",
      employmentTypes: [],
      remoteOptions: [],
      companyValues: [],
      benefits: [],
      workEnvironment: "",
      teamStructure: "",
      marketingConsent: false,
      termsAgreed: false,
      howHeard: "",
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      profileViews: 0,
      candidatesPlaced: 0,
      activeJobs: 0,
      savedCandidates: 0,
      averageResponseTime: "24 hours",
      profileCompleteness: 0,
      verified: false,
      specializations: [],
      preferredCommunication: "email",
      testimonials: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [recId],
  )

  const [recruiterData, setRecruiterData] = useState(defaultRecruiterProfile)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Don't show an error when viewing someone else's profile
        console.log("User not logged in, viewing in read-only mode")
        setIsEditable(false)

        try {
          setIsLoading(true)
          // Always fetch the requested recruiter's profile data
          const profileData = await getRecruiterProfile(recId as string)

          // Log detailed info about verification status
          console.log("Fetched recruiter data, verified status:", profileData?.verified)
          console.log("Verified status type:", typeof profileData?.verified)

          setRecruiterData((prev) => ({
            ...defaultRecruiterProfile,
            ...profileData,
          }))
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to fetch recruiter profile:", error)
          toast.error("Failed to fetch recruiter profile data")
          setIsLoading(false)
        }
        return
      }

      setCurrentUserId(user.uid)

      // Determine if the current user is viewing their own profile
      const isOwnProfile = user.uid === (recId as string)
      setIsEditable(isOwnProfile)
      console.log(`Current user: ${user.uid}, Profile ID: ${recId}, Is own profile: ${isOwnProfile}`)

      try {
        setIsLoading(true)
        const profileData = await getRecruiterProfile(recId as string)

        // Log detailed info about verification status
        console.log("Fetched recruiter data for logged in user:", profileData)

        setRecruiterData((prev) => ({
          ...defaultRecruiterProfile,
          ...profileData,
        }))
      } catch (error) {
        console.error("Failed to fetch recruiter profile:", error)
        toast.error("Failed to fetch recruiter profile data")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [recId, router, defaultRecruiterProfile])

  // Handle updating recruiter data
  const handleUpdateRecruiterData = async (section: string, data: any) => {
    // Only allow updates if the user is viewing their own profile
    if (!isEditable || !currentUserId) {
      toast.error("You can only edit your own profile")
      return
    }

    try {
      // Update local state immediately for better UX
      setRecruiterData((prev) => {
        const newState = { ...prev }

        // If data is an object with key-value pairs and section is empty string
        if (typeof data === "object" && !Array.isArray(data) && data !== null && section === "") {
          // Merge the data directly into recruiterData
          return { ...newState, ...data }
        } else {
          // Update the specific section
          ;(newState as Record<string, unknown>)[section] = data
          return newState
        }
      })

      // Then update in Firebase
      let updateData: any = {}

      if (section === "") {
        // Update multiple fields directly
        updateData = data
      } else {
        // Update specific section
        updateData = {
          [section]: data,
        }
      }

      // Include the updated timestamp
      updateData.updatedAt = new Date()

      await updateRecruiterProfile(currentUserId, section, updateData)
      toast.success(`Your ${section || "profile"} has been updated successfully`)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error(`Failed to update ${section || "profile"}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-white via-amber-50/30 to-white text-amber-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
        <p className="mt-4 text-lg font-medium">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-amber-50/30 to-white text-amber-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar />
      <motion.main className="flex-1 pt-20" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <RecruiterProfilePageComponent
          recruiter={recruiterData}
          isEditable={isEditable}
          onUpdate={handleUpdateRecruiterData}
        />
      </motion.main>
      <PremiumFooter />
    </div>
  )
}
