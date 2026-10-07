"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface SignupStepOneProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  isLoading: boolean
}

export function SignupStepOne({ formData, updateFormData, nextStep, isLoading }: SignupStepOneProps) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await updateFormData(formData)
        nextStep()
      } catch (error: any) {
        toast.error(error.message)
      }
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
          <Label htmlFor="fullName" className="text-foreground">
            Full Name
            <span className="text-destructive"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.user className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10"
            />
          </div>
          {errors.fullName && (
            <motion.p
              className="flex items-center gap-1 text-sm text-muted-foreground"
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
          <Label htmlFor="email" className="text-foreground">
            Email Address
            <span className="text-destructive"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.mail className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@university.edu"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="h-12 pl-10"
            />
          </div>
          {errors.email && (
            <motion.p
              className="flex items-center gap-1 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.email}
            </motion.p>
          )}
          <p className="text-xs text-muted-foreground">Preferably use your college email</p>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="password" className="text-foreground">
            Password
            <span className="text-destructive"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.lock className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
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
              className="h-12 pl-10"
            />
          </div>
          {errors.password && (
            <motion.p
              className="flex items-center gap-1 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Icons.alertCircle className="h-4 w-4" />
              {errors.password}
            </motion.p>
          )}
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirm Password
            <span className="text-destructive"> *</span>
          </Label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.lock className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
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
              className="h-12 pl-10"
            />
          </div>
          {errors.confirmPassword && (
            <motion.p
              className="flex items-center gap-1 text-sm text-muted-foreground"
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
          <Button type="submit" className="h-12 w-full" disabled={isLoading}>
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
