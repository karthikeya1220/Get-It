"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

interface SignupStepThreeProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function SignupStepThree({ formData, updateFormData, nextStep, prevStep, isLoading }: SignupStepThreeProps) {
  const [errors, setErrors] = useState({
    skills: "",
    interests: "",
  })

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

  const handleSkillToggle = (skillId: string) => {
    const currentSkills = [...(formData.skills || [])]
    const skillIndex = currentSkills.indexOf(skillId)

    if (skillIndex === -1) {
      updateFormData({ skills: [...currentSkills, skillId] })
    } else {
      currentSkills.splice(skillIndex, 1)
      updateFormData({ skills: currentSkills })
    }
  }

  const handleInterestToggle = (interestId: string) => {
    const currentInterests = [...(formData.interests || [])]
    const interestIndex = currentInterests.indexOf(interestId)

    if (interestIndex === -1) {
      updateFormData({ interests: [...currentInterests, interestId] })
    } else {
      currentInterests.splice(interestIndex, 1)
      updateFormData({ interests: currentInterests })
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      skills: "",
      interests: "",
    }

    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill"
      valid = false
    }

    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = "Please select at least one area of interest"
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base">
            Professional Skills
            <span className="text-destructive"> *</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-3">Select the skills you want to offer on the platform</p>

          <div className="grid grid-cols-2 gap-3">
            {skillOptions.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={skill.id}
                  checked={(formData.skills || []).includes(skill.id)}
                  onCheckedChange={() => handleSkillToggle(skill.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={skill.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill.label}
                </label>
              </div>
            ))}
          </div>
          {errors.skills && <p className="text-sm text-destructive mt-2">{errors.skills}</p>}
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-base">
            Areas of Interest
            <span className="text-destructive"> *</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-3">What are you looking for on GetIT?</p>

          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((interest) => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox
                  id={interest.id}
                  checked={(formData.interests || []).includes(interest.id)}
                  onCheckedChange={() => handleInterestToggle(interest.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={interest.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {interest.label}
                </label>
              </div>
            ))}
          </div>
          {errors.interests && <p className="text-sm text-destructive mt-2">{errors.interests}</p>}
        </div>

        <div className="mt-6 space-y-2">
          <Label className="text-base">Selected Skills</Label>
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
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading} className="flex-1">
          Back
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </form>
  )
}
