"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface RecruiterSignupStepOneProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  isLoading: boolean
}

export function RecruiterSignupStepOne({ formData, updateFormData, nextStep, isLoading }: RecruiterSignupStepOneProps) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
      phoneNumber: "",
    }

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required"
      valid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job title is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      nextStep()
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-4">
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300">
            Full Name
            <span className="text-amber-500"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.user className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.fullName && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.fullName}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
            Work Email
            <span className="text-amber-500"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.mail className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.email && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.email}
            </motion.p>
          )}
          <p className="text-xs text-zinc-500">Use your company email address</p>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="jobTitle" className="text-zinc-700 dark:text-zinc-300">
            Job Title
            <span className="text-amber-500"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.briefcase className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="HR Manager, Technical Recruiter, etc."
              value={formData.jobTitle || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.jobTitle && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.jobTitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="phoneNumber" className="text-zinc-700 dark:text-zinc-300">
            Phone Number
            <span className="text-zinc-500 text-sm"> (Optional)</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.phone className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              disabled={isLoading}
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.phoneNumber && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.phoneNumber}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">
            Password
            <span className="text-amber-500"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.lock className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.password && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.password}
            </motion.p>
          )}
          <p className="text-xs text-zinc-500">Must be at least 8 characters</p>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="confirmPassword" className="text-zinc-700 dark:text-zinc-300">
            Confirm Password
            <span className="text-amber-500"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.lock className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 dark:text-zinc-500 dark:group-focus-within:text-amber-400" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10 border-zinc-300 bg-white/50 text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-amber-500"
            />
          </div>
          {errors.confirmPassword && (
            <motion.p
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            type="submit"
            className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-600/20 dark:shadow-amber-600/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="mr-2"
              >
                <Icons.spinner className="h-5 w-5" />
              </motion.div>
            ) : null}
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  )
}
