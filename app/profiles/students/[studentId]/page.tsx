"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileAbout } from "@/components/profile/profile-about"
import { ProfileSkills } from "@/components/profile/profile-skills"
import { ProfileProjects } from "@/components/profile/profile-projects"
import { ProfileExperience } from "@/components/profile/profile-experience"
import { ProfileConnections } from "@/components/profile/profile-connections"
import { ProfileAchievements } from "@/components/profile/profile-achievements"
import { ProfileGrowth } from "@/components/profile/profile-growth"
import { ProfileCollaboration } from "@/components/profile/profile-collaboration"
import { ProfileReviews } from "@/components/profile/profile-reviews"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PremiumNavbar } from "@/components/premium-navbar"
import { PremiumFooter } from "@/components/premium-footer"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getUserProfile, updateUserProfile } from "@/lib/firebase-service"
import { updateDoc } from "firebase/firestore"
import { findOrCreateStudentDocument } from "@/lib/firebase-service"

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any
  }
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

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

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: { opacity: 0, y: -20 },
}

// Load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.id = "razorpay-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { studentId } = params
  const viewingOwnProfile = true // We'll set this based on auth check

  // Default profile structure
  const defaultProfile = useMemo(
    () => ({
      id: studentId as string,
      fullName: "",
      email: "",
      title: "",
      university: "",
      about: "",
      phoneNumber: "",
      address: "",
      pincode: "",
      skills: [],
      projects: [], // Ensure this is initialized as an empty array
      experience: [],
      connections: { followers: 0, following: 0 },
      achievements: [],
      growthSuggestions: [],
      collaborationProjects: [],
      reviews: [],
      activity: [],
      analytics: { profileViews: 0, jobApplications: 0, projectInquiries: 0, endorsementsReceived: 0 },
      socialLinks: {},
      avatar: "/placeholder.svg?height=200&width=200",
      coverImage: "/placeholder.svg?height=400&width=1200",
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [studentId],
  )

  const [userData, setUserData] = useState(defaultProfile)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [viewAllSections, setViewAllSections] = useState<Record<string, boolean>>({
    skills: false,
    projects: false,
    experience: false,
  })
  const [isEditable, setIsEditable] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [verificationForm, setVerificationForm] = useState({
    fullName: userData.fullName || "",
    phoneNumber: userData.phoneNumber || "",
    address: userData.address || "",
    pincode: userData.pincode || "",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Don't show an error when viewing someone else's profile
        console.log("User not logged in, viewing in read-only mode")
        setIsEditable(false)
        return
      }

      setCurrentUserId(user.uid)

      // Determine if the current user is viewing their own profile
      const isOwnProfile = user.uid === (studentId as string)
      setIsEditable(isOwnProfile)
      console.log(`Current user: ${user.uid}, Profile ID: ${studentId}, Is own profile: ${isOwnProfile}`)
    })

    return () => unsubscribe()
  }, [studentId, router, defaultProfile])

  const {
    data: profileData,
    isPending: isLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", "student", studentId],
    queryFn: async () => {
      const data = await getUserProfile(studentId as string)

      console.log("Fetched profile data, verified status:", data?.verified)
      console.log("Verified status type:", typeof data?.verified)
      console.log("Is verified exactly true?", data?.verified === true)

      return data
    },
  })

  useEffect(() => {
    if (profileData) {
      setUserData({ ...defaultProfile, ...profileData })
    }
  }, [profileData, defaultProfile])

  useEffect(() => {
    if (profileError) {
      console.error("Failed to fetch profile:", profileError)
      toast.error("Failed to fetch profile data")
    }
  }, [profileError])

  const handleUpdateUserData = async (section: string, data: any) => {
    // Only allow updates if the user is viewing their own profile
    if (!isEditable || !currentUserId) {
      toast.error("You can only edit your own profile")
      return
    }

    try {
      // Update local state immediately for better UX
      setUserData((prev) => {
        const newState = { ...prev }

        // If data is an object with key-value pairs and section is empty string
        if (typeof data === "object" && !Array.isArray(data) && data !== null && section === "") {
          // Merge the data directly into userData
          return { ...newState, ...data }
        } else if (section === "socialLinks") {
          // Special handling for social links
          return {
            ...newState,
            socialLinks: { ...newState.socialLinks, ...data },
          }
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
      } else if (section === "socialLinks") {
        // Special handling for social links - we need to merge not replace
        updateData = {
          socialLinks: data,
        }
      } else {
        // Update specific section
        updateData = {
          [section]: data,
        }
      }

      // Include the updated timestamp
      updateData.updatedAt = new Date()

      await updateUserProfile(currentUserId, section, updateData)
      queryClient.invalidateQueries({ queryKey: ["profile", "student", studentId] })
      toast.success(`Your ${section || "profile"} has been updated successfully`)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error(`Failed to update ${section || "profile"}`)
    }
  }

  // Add a function to handle adding a new project
  const handleAddNewProject = () => {
    if (!isEditable) {
      toast.error("You can only edit your own profile")
      return
    }

    setActiveTab("projects")
    // Add a small delay to ensure the tab change is complete
    setTimeout(() => {
      // Find the "Add Project" button and click it
      const addProjectButton = document.querySelector('[aria-label="Add Project"]') as HTMLButtonElement
      if (addProjectButton) {
        addProjectButton.click()
      }
    }, 200)
  }

  // Add a function to handle adding a new experience
  const handleAddNewExperience = () => {
    if (!isEditable) {
      toast.error("You can only edit your own profile")
      return
    }

    setActiveTab("experience")
    // Add a small delay to ensure the tab change is complete
    setTimeout(() => {
      // Find the "Add Experience" button and click it
      const addExperienceButton = document.querySelector('[aria-label="Add Experience"]') as HTMLButtonElement
      if (addExperienceButton) {
        addExperienceButton.click()
      }
    }, 200)
  }

  const toggleViewAll = (section: string) => {
    setViewAllSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))

    // Switch to the appropriate tab when "View All" is clicked
    setActiveTab(section)
  }

  const handleGetVerified = () => {
    console.log(`User ${userData.fullName} (ID: ${userData.id}) requested verification`)
    // Open the verification dialog instead of directly calling buyNow
    setIsVerificationDialogOpen(true)
  }

  // Add a function to handle form changes
  const handleVerificationFormChange = (field: string, value: any) => {
    setVerificationForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add a function to handle form submission
  const handleVerificationSubmit = async () => {
    // Validate form
    if (!verificationForm.fullName.trim()) {
      toast.error("Please enter your full name")
      return
    }

    if (!verificationForm.phoneNumber.trim()) {
      toast.error("Please enter your phone number")
      return
    }

    if (!verificationForm.address.trim()) {
      toast.error("Please enter your address")
      return
    }

    if (!verificationForm.pincode.trim()) {
      toast.error("Please enter your pincode")
      return
    }

    if (!verificationForm.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      // Update the user data with the form information
      const updatedUserData = {
        ...userData,
        fullName: verificationForm.fullName,
        phoneNumber: verificationForm.phoneNumber,
        address: verificationForm.address,
        pincode: verificationForm.pincode,
      }

      // Update the userData state
      setUserData(updatedUserData)

      // Close the dialog
      setIsVerificationDialogOpen(false)

      // Proceed with payment
      await buyNow()
    } catch (error) {
      console.error("Verification submission error:", error)
      toast.error("An error occurred during verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const buyNow = async () => {
    const isRazorpayLoaded = await loadRazorpayScript()

    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK failed to load. Please try again later.")
      return
    }

    if (!isEditable || !currentUserId) {
      toast.error("You can only verify your own profile")
      return
    }

    try {
      const currentUser = getAuth().currentUser
      if (!currentUser) {
        toast.error("Please sign in to continue")
        return
      }
      const token = await currentUser.getIdToken()

      // Order + amount are created server-side so the price can't be tampered with
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ purpose: "profile_verification" }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok || !order.orderId) {
        throw new Error(order.error || "Could not start payment")
      }

      const options = {
        key: order.key,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "GetIt",
        description: order.description,
        prefill: {
          name: verificationForm.fullName,
          contact: verificationForm.phoneNumber,
        },
        theme: {
          color: "#7C3AED", // Violet color to match your UI
        },
        handler: async (response: any) => {
          try {
            // Server verifies the HMAC signature and grants `verified`
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            const verify = await verifyRes.json()
            if (!verifyRes.ok || !verify.success) {
              throw new Error(verify.error || "Payment verification failed")
            }

            // Address/contact are plain profile fields — own-doc write is allowed by Firestore rules
            const userDoc = await findOrCreateStudentDocument(currentUserId)
            if (userDoc?.ref) {
              await updateDoc(userDoc.ref, {
                phoneNumber: verificationForm.phoneNumber,
                address: verificationForm.address,
                pincode: verificationForm.pincode,
                updatedAt: new Date(),
              })
            }

            setUserData((prev) => ({
              ...prev,
              verified: true,
              phoneNumber: verificationForm.phoneNumber,
              address: verificationForm.address,
              pincode: verificationForm.pincode,
            }))

            toast.success("Your profile has been successfully verified!", { duration: 5000 })

            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } catch (error) {
            console.error("Error in verification update:", error)
            toast.error("Payment received — verification is still processing.")
          }
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response)
        toast.error("Payment failed. Please try again.")
      })
    } catch (error) {
      console.error("Error initializing payment:", error)
      toast.error(error instanceof Error ? error.message : "Could not initialize payment gateway")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
        <p className="mt-4 text-lg font-medium">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar />
      <motion.main className="flex-1 pt-20" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <motion.div variants={itemVariants}>
            <ProfileHeader
              userData={userData}
              onUpdate={isEditable ? (data) => handleUpdateUserData("", data) : undefined}
              isEditable={isEditable}
            />
          </motion.div>

          {/* Verification Warning Badge - Only show when user is not verified */}
          {userData.verified !== true && isEditable && (
            <motion.div
              className="my-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="relative overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md dark:border-amber-900/50 dark:from-amber-900/20 dark:to-amber-800/20">
                {/* Badge content remains the same */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
                </div>

                <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-600 dark:bg-amber-900/50 dark:text-amber-500">
                      <Icons.alertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-900 dark:text-amber-300">Your profile is not verified</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        Verified profiles get 5x more visibility and opportunities
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGetVerified()}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
                  >
                    <Icons.shieldCheck className="mr-1.5 h-4 w-4" />
                    Get Verified
                  </Button>
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
              </div>
            </motion.div>
          )}

          {/* Success badge when user is verified */}
          {userData.verified === true && isEditable && (
            <motion.div
              className="my-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-md dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
                </div>

                <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-green-600 dark:bg-green-900/50 dark:text-green-500">
                      <Icons.checkCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900 dark:text-green-300">Your profile is verified</h3>
                      <p className="text-sm text-green-800 dark:text-green-400">
                        Your profile has 5x more visibility to recruiters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
              </div>
            </motion.div>
          )}

          {isEditable && (
            <motion.div
              className="mx-auto mb-6 mt-2 flex items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="rounded-full bg-violet-100 px-4 py-1 text-sm text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                <span className="flex items-center">
                  <Icons.edit className="mr-1.5 h-3.5 w-3.5" />
                  You are editing your own profile
                </span>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mt-8">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8 overflow-x-auto">
                <TabsList className="grid min-w-max w-full grid-cols-8 gap-4 rounded-lg bg-violet-100/50 p-2 dark:bg-violet-900/20">
                  <TabsTrigger value="overview" className="rounded-md">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="rounded-md">
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="rounded-md">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="rounded-md">
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="connections" className="rounded-md">
                    Network
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="rounded-md">
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="growth" className="rounded-md">
                    Growth
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-md">
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8 animate-in fade-in-50">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <ProfileAbout
                      about={userData.about}
                      onUpdate={isEditable ? (about) => handleUpdateUserData("about", about) : undefined}
                      isEditable={isEditable}
                    />
                  </div>
                  <div>
                    <ProfileConnections connections={userData.connections} />
                  </div>
                </div>

                <ProfileSkills
                  skills={userData.skills}
                  onUpdate={isEditable ? (skills) => handleUpdateUserData("skills", skills) : undefined}
                  viewAll={viewAllSections.skills}
                  onViewAllClick={() => toggleViewAll("skills")}
                  isEditable={isEditable}
                />

                <div className="grid gap-8 md:grid-cols-2">
                  <ProfileProjects
                    projects={
                      viewAllSections.projects
                        ? Array.isArray(userData.projects)
                          ? userData.projects
                          : []
                        : Array.isArray(userData.projects)
                          ? userData.projects.slice(0, 1)
                          : []
                    }
                    onUpdate={isEditable ? (projects) => handleUpdateUserData("projects", projects) : undefined}
                    viewAll={viewAllSections.projects}
                    onViewAllClick={() => toggleViewAll("projects")}
                    isEditable={isEditable}
                  />
                  <ProfileExperience
                    experience={
                      viewAllSections.experience
                        ? Array.isArray(userData.experience)
                          ? userData.experience
                          : []
                        : Array.isArray(userData.experience)
                          ? userData.experience.slice(0, 1)
                          : []
                    }
                    onUpdate={isEditable ? (experience) => handleUpdateUserData("experience", experience) : undefined}
                    viewAll={viewAllSections.experience}
                    onViewAllClick={() => toggleViewAll("experience")}
                    isEditable={isEditable}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <ProfileAchievements achievements={userData.achievements || []} />
                  <ProfileReviews reviews={userData.reviews || []} />
                </div>

                <ProfileActivity activity={userData.activity || []} analytics={userData.analytics || {}} />
              </TabsContent>

              <TabsContent value="skills" className="animate-in fade-in-50">
                <ProfileSkills
                  skills={userData.skills}
                  onUpdate={isEditable ? (skills) => handleUpdateUserData("skills", skills) : undefined}
                  viewAll={true}
                  isEditable={isEditable}
                />
              </TabsContent>

              <TabsContent value="projects" className="animate-in fade-in-50">
                <ProfileProjects
                  projects={Array.isArray(userData.projects) ? userData.projects : []}
                  onUpdate={isEditable ? (projects) => handleUpdateUserData("projects", projects) : undefined}
                  viewAll={true}
                  isEditable={isEditable}
                />
              </TabsContent>

              <TabsContent value="experience" className="animate-in fade-in-50">
                <ProfileExperience
                  experience={Array.isArray(userData.experience) ? userData.experience : []}
                  onUpdate={isEditable ? (experience) => handleUpdateUserData("experience", experience) : undefined}
                  viewAll={true}
                  isEditable={isEditable}
                />
              </TabsContent>

              <TabsContent value="connections" className="animate-in fade-in-50">
                <ProfileConnections connections={userData.connections} showAll />
              </TabsContent>

              <TabsContent value="achievements" className="animate-in fade-in-50">
                <ProfileAchievements achievements={userData.achievements || []} showAll />
              </TabsContent>

              <TabsContent value="growth" className="animate-in fade-in-50">
                <div className="grid gap-8 md:grid-cols-2">
                  <ProfileGrowth suggestions={userData.growthSuggestions || []} />
                  <ProfileCollaboration projects={userData.collaborationProjects || []} />
                </div>
              </TabsContent>

              <TabsContent value="activity" className="animate-in fade-in-50">
                <ProfileActivity activity={userData.activity || []} analytics={userData.analytics || {}} showAll />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Quick Actions Floating Button - Only show for own profile */}
          {isEditable && (
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="relative group">
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icons.plus className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-full right-0 mb-4 hidden flex-col gap-2 group-hover:flex">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full shadow-md transform transition-transform duration-200 hover:scale-105"
                    onClick={handleAddNewProject}
                    aria-label="Add Project"
                  >
                    <Icons.briefcase className="h-4 w-4" />
                    <span>Add Project</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full shadow-md transform transition-transform duration-200 hover:scale-105"
                    onClick={() => setActiveTab("skills")}
                    aria-label="Add Skill"
                  >
                    <Icons.code className="h-4 w-4" />
                    <span>Add Skill</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full shadow-md transform transition-transform duration-200 hover:scale-105"
                    onClick={handleAddNewExperience}
                    aria-label="Add Experience"
                  >
                    <Icons.briefcase className="h-4 w-4" />
                    <span>Add Experience</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.main>
      <PremiumFooter />

      {/* Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Verification</DialogTitle>
            <DialogDescription>Please fill out the form below to verify your profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={verificationForm.fullName}
                onChange={(e) => handleVerificationFormChange("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={verificationForm.phoneNumber}
                onChange={(e) => handleVerificationFormChange("phoneNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={verificationForm.address}
                onChange={(e) => handleVerificationFormChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={verificationForm.pincode}
                onChange={(e) => handleVerificationFormChange("pincode", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={verificationForm.agreeToTerms}
                onCheckedChange={(checked) => handleVerificationFormChange("agreeToTerms", checked)}
              />
              <Label htmlFor="agreeToTerms">I agree to the terms and conditions</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleVerificationSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
