"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecruiterSignupStepFiveProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function RecruiterSignupStepFive({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isLoading,
}: RecruiterSignupStepFiveProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    updateFormData({ [name]: checked })
  }

  const validateForm = () => {
    if (!formData.termsAgreed) {
      setError("You must agree to the Terms and Conditions to continue")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      await updateFormData(formData)
      nextStep() // Move to success screen if successful
    } catch (error) {
      console.error("Error during registration:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Map role IDs to labels
  const roleOptions = [
    { id: "software-engineer", label: "Software Engineer" },
    { id: "web-developer", label: "Web Developer" },
    { id: "mobile-developer", label: "Mobile Developer" },
    { id: "ui-ux-designer", label: "UI/UX Designer" },
    { id: "graphic-designer", label: "Graphic Designer" },
    { id: "data-scientist", label: "Data Scientist" },
    { id: "data-analyst", label: "Data Analyst" },
    { id: "product-manager", label: "Product Manager" },
    { id: "project-manager", label: "Project Manager" },
    { id: "marketing-specialist", label: "Marketing Specialist" },
    { id: "content-writer", label: "Content Writer" },
    { id: "social-media-manager", label: "Social Media Manager" },
    { id: "sales-representative", label: "Sales Representative" },
    { id: "customer-support", label: "Customer Support" },
  ]

  // Map employment type IDs to labels
  const employmentTypeMap: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance/Project-based",
  }

  // Map remote option IDs to labels
  const remoteOptionMap: Record<string, string> = {
    "on-site": "On-site only",
    hybrid: "Hybrid",
    remote: "Fully remote",
    flexible: "Flexible",
  }

  // Map hiring timeline to label
  const timelineMap: Record<string, string> = {
    immediate: "Immediate (within 2 weeks)",
    soon: "Soon (within 1 month)",
    "next-quarter": "Next quarter",
    ongoing: "Ongoing/continuous hiring",
    future: "Future planning (3+ months)",
  }

  // Map industry to label
  const industryMap: Record<string, string> = {
    technology: "Technology",
    finance: "Finance & Banking",
    healthcare: "Healthcare",
    education: "Education",
    retail: "Retail & E-commerce",
    manufacturing: "Manufacturing",
    media: "Media & Entertainment",
    consulting: "Consulting",
    nonprofit: "Nonprofit",
    other: "Other",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Verification & Preferences</h3>
          <p className="text-sm text-muted-foreground">Complete your profile and set your preferences</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
            <div className="flex items-center">
              <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
                linkedin.com/in/
              </span>
              <Input
                id="linkedinProfile"
                name="linkedinProfile"
                placeholder="username"
                value={formData.linkedinProfile || ""}
                onChange={handleChange}
                disabled={isLoading}
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="howHeard">How did you hear about us?</Label>
            <Select
              value={formData.howHeard || ""}
              onValueChange={(value) => handleSelectChange("howHeard", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="howHeard">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search Engine</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="event">Event or Conference</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingConsent">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                </div>
                <Switch
                  id="marketingConsent"
                  checked={formData.marketingConsent ?? true}
                  onCheckedChange={(checked) => handleSwitchChange("marketingConsent", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="termsAgreed">Terms and Conditions</Label>
                  <p className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-amber-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-amber-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
                <Switch
                  id="termsAgreed"
                  checked={formData.termsAgreed ?? false}
                  onCheckedChange={(checked) => handleSwitchChange("termsAgreed", checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-medium">Profile Summary</h3>
          <p className="text-sm text-muted-foreground">Review your information before completing registration</p>

          <div className="grid gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Personal Information</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <span className="text-muted-foreground">Name:</span> {formData.fullName}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Email:</span> {formData.email}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Job Title:</span> {formData.jobTitle}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium">Company Details</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <span className="text-muted-foreground">Company:</span> {formData.companyName}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Industry:</span>{" "}
                    {industryMap[formData.industry] || formData.industry}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Size:</span> {formData.companySize}
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Hiring Needs</h4>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Timeline:</span>{" "}
                  {timelineMap[formData.hiringTimeline] || formData.hiringTimeline}
                </p>
                <div className="mt-1">
                  <span className="text-sm text-muted-foreground">Roles:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(formData.hiringRoles || []).length > 0 ? (
                      roleOptions
                        .filter((role) => (formData.hiringRoles || []).includes(role.id))
                        .map((role) => (
                          <Badge key={role.id} variant="secondary" className="px-3 py-1">
                            {role.label}
                          </Badge>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No roles selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isLoading || isSubmitting}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting} className="w-full">
          {isLoading || isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </form>
  )
}
