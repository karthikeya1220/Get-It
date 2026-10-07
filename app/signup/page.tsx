"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { SignupStepOne } from "@/components/signup/signup-step-one"
import { SignupStepTwo } from "@/components/signup/signup-step-two"
import { SignupStepThree } from "@/components/signup/signup-step-three"
import { SignupStepFour } from "@/components/signup/signup-step-four"
import { SignupStepFive } from "@/components/signup/signup-step-five"
import { SignupComplete } from "@/components/signup/signup-complete"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerStudentUser as registerUser } from "@/lib/firebase-service"
import { UserDetails } from "@/lib/firebase-service"
import { createSessionCookie } from "@/lib/auth-session"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    Role: "Student",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    degree: "",
    year: "",
    coursework: "",
    certifications: "",
    skills: [],
    proficiency: {},
    interests: [],
    portfolioLinks: {
      github: "",
      linkedin: "",
      behance: "",
      dribbble: "",
    },
    experience: "",
    jobType: "",
    preferences: {
      notifications: true,
      updates: true,
    },
  })

  const totalSteps = 5

  const handleRegistration = async (formData: any) => {
    setIsSubmitting(true)
    try {
      // Remove confirmPassword from data being sent to Firebase
      const { confirmPassword, ...userData } = formData

      const { success, userId } = await registerUser(formData.email, formData.password, userData as UserDetails)

      if (success) {
        await createSessionCookie()
        toast.success("Registration successful!")
        router.push("/profile")
      }
    } catch (error: any) {
      toast.error(error.message)
      setStep(1) // Return to first step on error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the updateFormData function to handle final submission
  const updateFormData = (data: any) => {
    if (step === 5 && !isSubmitting) {
      handleRegistration({ ...formData, ...data })
    } else {
      setFormData({ ...formData, ...data })
    }
  }

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
      title={step === 6 ? "Welcome to GetIT!" : "Create your account"}
      description={
        step === 6
          ? "Your account is ready. Finish your profile to start showing up in matching."
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
              <SignupStepOne
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                isLoading={isLoading}
              />
            )}
            {step === 2 && (
              <SignupStepTwo
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 3 && (
              <SignupStepThree
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 4 && (
              <SignupStepFour
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 5 && (
              <SignupStepFive
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 6 && <SignupComplete />}
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
