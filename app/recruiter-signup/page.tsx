"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { RecruiterSignupStepOne } from "@/components/recruiter-signup/recruiter-signup-step-one"
import { RecruiterSignupStepTwo } from "@/components/recruiter-signup/recruiter-signup-step-two"
import { RecruiterSignupStepThree } from "@/components/recruiter-signup/recruiter-signup-step-three"
import { RecruiterSignupStepFour } from "@/components/recruiter-signup/recruiter-signup-step-four"
import { RecruiterSignupStepFive } from "@/components/recruiter-signup/recruiter-signup-step-five"
import { RecruiterSignupComplete } from "@/components/recruiter-signup/recruiter-signup-complete"
import { registerRecruiter } from "@/lib/firebase-service"
import type { RecruiterDetails } from "@/lib/firebase-service"
import { createSessionCookie } from "@/lib/auth-session"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { toast } from "sonner" // Add this import - using sonner not react-toastify

export default function RecruiterSignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    phoneNumber: "",
    Role: "Recruiter",

    // Company Details
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    companyDescription: "",
    companyLocation: "",

    // Hiring Needs
    hiringRoles: [],
    skillsNeeded: [],
    hiringTimeline: "",
    employmentTypes: [],
    remoteOptions: [],

    // Company Culture
    companyValues: [],
    benefits: [],
    workEnvironment: "",
    teamStructure: "",

    // Verification & Preferences
    linkedinProfile: "",
    howHeard: "",
    marketingConsent: false,
    termsAgreed: false,
  })

  const totalSteps = 5

  const handleRegistration = async (formData: any) => {
    setIsLoading(true)
    try {
      // Remove confirmPassword from data being sent to Firebase
      const { confirmPassword, ...userData } = formData

      const { success, userId } = await registerRecruiter(
        formData.email,
        formData.password,
        userData as RecruiterDetails,
      )

      if (success) {
        await createSessionCookie()
        // Change step to 6 (success screen) instead of redirecting immediately
        setStep(6)
        // Delay redirect until they've seen the success screen
        setTimeout(() => {
          router.push("/explore/recruiters")
        }, 3000)
      }
    } catch (error: any) {
      toast.error(error.message)
      setStep(1) // Return to first step on error
    } finally {
      setIsLoading(false)
    }
  }

  // Update the updateFormData function to handle final submission
  const updateFormData = (data: any) => {
    if (step === 5 && !isLoading) {
      handleRegistration({ ...formData, ...data })
    } else {
      setFormData({ ...formData, ...data })
    }
  }

  // Only run this effect on the client side
  const nextStep = () => {
    if (step < totalSteps + 1) {
      setIsLoading(true)
      setTimeout(() => {
        setStep(step + 1)
        window.scrollTo(0, 0)
        setIsLoading(false)
      }, 500)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setIsLoading(true)
      setTimeout(() => {
        setStep(step - 1)
        window.scrollTo(0, 0)
        setIsLoading(false)
      }, 300)
    }
  }

  return (
    <AuthShell
      title={step === 6 ? "Welcome to GetIT!" : "Create Recruiter Account"}
      description={
        step === 6
          ? "Your account is ready. Post your first brief and start matching with students."
          : "Five short steps, about ten minutes in total."
      }
      contentClassName="max-w-2xl"
    >
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {step <= totalSteps && (
          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-border"></div>
            <div className="relative flex justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.div
                    className={`
                            flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold
                            ${
                              step > index + 1
                                ? "bg-primary text-primary-foreground"
                                : step === index + 1
                                  ? "border-2 border-primary bg-background text-primary"
                                  : "border border-border bg-background text-muted-foreground"
                            }
                          `}
                    whileHover={step <= index + 1 ? { scale: 1.05 } : {}}
                    whileTap={step <= index + 1 ? { scale: 0.95 } : {}}
                  >
                    {step > index + 1 ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Icons.check className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  {step === index + 1 && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-primary"
                      layoutId="activeStep"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
          >
            {step === 1 && (
              <RecruiterSignupStepOne
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                isLoading={isLoading}
              />
            )}
            {step === 2 && (
              <RecruiterSignupStepTwo
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 3 && (
              <RecruiterSignupStepThree
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 4 && (
              <RecruiterSignupStepFour
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 5 && (
              <RecruiterSignupStepFive
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 6 && <RecruiterSignupComplete />}
          </motion.div>
        </AnimatePresence>

        {step <= totalSteps && (
          <motion.div
            className="mt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </motion.div>
        )}
      </div>
    </AuthShell>
  )
}
