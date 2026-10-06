"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignupStepOne } from "@/components/signup/signup-step-one"
import { SignupStepTwo } from "@/components/signup/signup-step-two"
import { SignupStepThree } from "@/components/signup/signup-step-three"
import { SignupStepFour } from "@/components/signup/signup-step-four"
import { SignupStepFive } from "@/components/signup/signup-step-five"
import { SignupComplete } from "@/components/signup/signup-complete"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerStudentUser as registerUser } from "@/lib/firebase-service"
import { UserDetails } from "@/lib/firebase-service"
import { createSessionCookie } from "@/lib/auth-session"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-zinc-900 dark:to-black dark:text-white">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur-3xl dark:from-violet-600/20 dark:to-fuchsia-600/20"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-amber-600/10 to-rose-600/10 blur-3xl dark:from-amber-600/20 dark:to-rose-600/20"
          animate={{
            x: [0, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl dark:from-blue-600/20 dark:to-cyan-600/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container relative z-10 flex w-full flex-col items-center justify-center px-4 py-16 md:px-8 lg:px-12">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="group absolute left-4 top-4 flex items-center gap-2 text-lg font-bold text-zinc-900 transition-all hover:text-violet-600 dark:text-white dark:hover:text-violet-400 md:left-8 md:top-8"
        >
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-600 p-[1px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white dark:bg-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-zinc-900 transition-transform duration-300 ease-out group-hover:scale-110 dark:text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
          </motion.div>
          <span className="hidden md:inline-block">GetIT</span>
        </Link>

        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90"
            whileHover={{
              boxShadow:
                mounted && resolvedTheme === "light"
                  ? "0 25px 50px -12px rgba(0,0,0,0.15)"
                  : "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative elements */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-2xl dark:from-violet-600/20 dark:to-fuchsia-600/20"></div>
            <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-amber-600/30 to-rose-600/30 blur-2xl dark:from-amber-600/20 dark:to-rose-600/20"></div>

            <div className="relative z-10 p-8">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600/10 to-amber-600/10 dark:from-violet-600/20 dark:to-amber-600/20"
                >
                  {/* <Icons.userPlus className="h-8 w-8 text-violet-600 dark:text-violet-400" /> */}
                </motion.div>
                <motion.h1
                  className="mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                >
                  {step === 6 ? "Welcome to GetIT!" : "Create your account"}
                </motion.h1>
                <motion.p
                  className="text-sm text-zinc-500 dark:text-zinc-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {step === 6
                    ? "Your journey to professional success begins now"
                    : "Join our community of skilled students and find opportunities"}
                </motion.p>
              </div>

              {step <= totalSteps && (
                <div className="relative mb-8">
                  <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"></div>
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
                                ? "bg-gradient-to-r from-violet-600 to-amber-600 text-white shadow-lg shadow-violet-600/20 dark:shadow-violet-600/10"
                                : step === index + 1
                                  ? "border-2 border-violet-500 bg-white text-violet-600 shadow-lg shadow-violet-600/10 dark:bg-black dark:text-violet-400 dark:shadow-violet-600/5"
                                  : "border border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
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
                            className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-amber-500"
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
                  className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "bg-violet-600/10 dark:bg-violet-600/20"
                : i % 3 === 1
                  ? "bg-amber-600/10 dark:bg-amber-600/20"
                  : "bg-blue-600/10 dark:bg-blue-600/20"
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  )
}
