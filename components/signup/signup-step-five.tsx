"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SignupStepFiveProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function SignupStepFive({ formData, updateFormData, nextStep, prevStep, isLoading }: SignupStepFiveProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePreferenceChange = (name: string, checked: boolean) => {
    updateFormData({
      preferences: {
        ...formData.preferences,
        [name]: checked,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // This will trigger the registration process in the parent component
      await updateFormData(formData)
    } catch (error) {
      console.error("Error during registration:", error)
    }
  }

  // Map skill IDs to labels
  const skillOptions = [
    { id: "web-dev", label: "Web Development" },
    { id: "mobile-dev", label: "Mobile Development" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "graphic-design", label: "Graphic Design" },
    { id: "content-writing", label: "Content Writing" },
    { id: "marketing", label: "Digital Marketing" },
    { id: "seo", label: "SEO" },
    { id: "data-analysis", label: "Data Analysis" },
    { id: "video-editing", label: "Video Editing" },
    { id: "social-media", label: "Social Media Management" },
    { id: "translation", label: "Translation" },
    { id: "research", label: "Research" },
    { id: "virtual-assistant", label: "Virtual Assistant" },
    { id: "tutoring", label: "Tutoring" },
    { id: "accounting", label: "Accounting" },
  ]

  // Map interest IDs to labels
  const interestOptions = [
    { id: "freelancing", label: "Freelancing" },
    { id: "internships", label: "Internships" },
    { id: "part-time", label: "Part-Time Jobs" },
    { id: "startups", label: "Working with Startups" },
    { id: "remote-work", label: "Remote Work" },
    { id: "networking", label: "Professional Networking" },
    { id: "skill-development", label: "Skill Development" },
    { id: "mentorship", label: "Finding Mentors" },
  ]

  // Map job type to label
  const jobTypeMap: Record<string, string> = {
    freelance: "Freelance",
    internship: "Internship",
    "part-time": "Part-Time",
    "full-time": "Full-Time",
    contract: "Contract",
  }

  // Map year to label
  const yearMap: Record<string, string> = {
    freshman: "Freshman (1st Year)",
    sophomore: "Sophomore (2nd Year)",
    junior: "Junior (3rd Year)",
    senior: "Senior (4th Year)",
    graduate: "Graduate Student",
    phd: "PhD Candidate",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">AI-Powered Suggestions & Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Let us help you find the best opportunities and resources based on your profile
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about new opportunities</p>
                </div>
                <Switch
                  id="notifications"
                  checked={formData.preferences?.notifications ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="updates">Platform Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                </div>
                <Switch
                  id="updates"
                  checked={formData.preferences?.updates ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange("updates", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recommendations">Job Recommendations</Label>
                  <p className="text-sm text-muted-foreground">Receive personalized job recommendations</p>
                </div>
                <Switch
                  id="recommendations"
                  checked={formData.preferences?.recommendations ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange("recommendations", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="learning">Learning Resources</Label>
                  <p className="text-sm text-muted-foreground">Receive suggestions for skill improvement resources</p>
                </div>
                <Switch
                  id="learning"
                  checked={formData.preferences?.learning ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange("learning", checked)}
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
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium">Education</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <span className="text-muted-foreground">University:</span> {formData.university}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Degree:</span> {formData.degree}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Year:</span> {yearMap[formData.year] || formData.year}
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Skills</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.skills || []).length > 0 ? (
                  skillOptions
                    .filter((skill) => (formData.skills || []).includes(skill.id))
                    .map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                        {skill.label}
                      </Badge>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills selected</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Interests</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.interests || []).length > 0 ? (
                  interestOptions
                    .filter((interest) => (formData.interests || []).includes(interest.id))
                    .map((interest) => (
                      <Badge key={interest.id} variant="outline" className="px-3 py-1">
                        {interest.label}
                      </Badge>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests selected</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Job Preferences</h4>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Preferred Job Type:</span>{" "}
                {jobTypeMap[formData.jobType] || formData.jobType}
              </p>
            </div>
          </div>
        </div>
      </div>

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
        <Button type="submit" disabled={isLoading || isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  )
}
