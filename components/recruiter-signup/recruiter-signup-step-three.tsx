"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface RecruiterSignupStepThreeProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function RecruiterSignupStepThree({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isLoading,
}: RecruiterSignupStepThreeProps) {
  const [errors, setErrors] = useState({
    hiringRoles: "",
    hiringTimeline: "",
  })
  const [newSkill, setNewSkill] = useState("")

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

  const employmentTypeOptions = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "freelance", label: "Freelance/Project-based" },
  ]

  const remoteOptions = [
    { id: "on-site", label: "On-site only" },
    { id: "hybrid", label: "Hybrid" },
    { id: "remote", label: "Fully remote" },
    { id: "flexible", label: "Flexible" },
  ]

  const handleRoleToggle = (roleId: string) => {
    const currentRoles = [...(formData.hiringRoles || [])]
    const roleIndex = currentRoles.indexOf(roleId)

    if (roleIndex === -1) {
      updateFormData({ hiringRoles: [...currentRoles, roleId] })
    } else {
      currentRoles.splice(roleIndex, 1)
      updateFormData({ hiringRoles: currentRoles })
    }
  }

  const handleEmploymentTypeToggle = (typeId: string) => {
    const currentTypes = [...(formData.employmentTypes || [])]
    const typeIndex = currentTypes.indexOf(typeId)

    if (typeIndex === -1) {
      updateFormData({ employmentTypes: [...currentTypes, typeId] })
    } else {
      currentTypes.splice(typeIndex, 1)
      updateFormData({ employmentTypes: currentTypes })
    }
  }

  const handleRemoteOptionToggle = (optionId: string) => {
    const currentOptions = [...(formData.remoteOptions || [])]
    const optionIndex = currentOptions.indexOf(optionId)

    if (optionIndex === -1) {
      updateFormData({ remoteOptions: [...currentOptions, optionId] })
    } else {
      currentOptions.splice(optionIndex, 1)
      updateFormData({ remoteOptions: currentOptions })
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return

    const currentSkills = [...(formData.skillsNeeded || [])]
    updateFormData({ skillsNeeded: [...currentSkills, newSkill.trim()] })
    setNewSkill("")
  }

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = [...(formData.skillsNeeded || [])]
    updateFormData({ skillsNeeded: currentSkills.filter((s) => s !== skill) })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      hiringRoles: "",
      hiringTimeline: "",
    }

    if (!formData.hiringRoles || formData.hiringRoles.length === 0) {
      newErrors.hiringRoles = "Please select at least one role"
      valid = false
    }

    if (!formData.hiringTimeline) {
      newErrors.hiringTimeline = "Please select a hiring timeline"
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
            Roles You're Hiring For
            <span className="text-destructive"> *</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-3">Select the roles you're looking to fill</p>

          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={role.id}
                  checked={(formData.hiringRoles || []).includes(role.id)}
                  onCheckedChange={() => handleRoleToggle(role.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={role.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.label}
                </label>
              </div>
            ))}
          </div>
          {errors.hiringRoles && <p className="text-sm text-destructive mt-2">{errors.hiringRoles}</p>}
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-base">Skills Needed</Label>
          <p className="text-sm text-muted-foreground mb-3">Add specific skills you're looking for in candidates</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {(formData.skillsNeeded || []).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 rounded-full hover:text-destructive"
                >
                  <Icons.x className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., React, Python, Adobe Photoshop"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="hiringTimeline" className="text-base">
            Hiring Timeline
            <span className="text-destructive"> *</span>
          </Label>
          <Select
            value={formData.hiringTimeline || ""}
            onValueChange={(value) => updateFormData({ hiringTimeline: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="hiringTimeline">
              <SelectValue placeholder="Select hiring timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (within 2 weeks)</SelectItem>
              <SelectItem value="soon">Soon (within 1 month)</SelectItem>
              <SelectItem value="next-quarter">Next quarter</SelectItem>
              <SelectItem value="ongoing">Ongoing/continuous hiring</SelectItem>
              <SelectItem value="future">Future planning (3+ months)</SelectItem>
            </SelectContent>
          </Select>
          {errors.hiringTimeline && <p className="text-sm text-destructive mt-2">{errors.hiringTimeline}</p>}
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-base">Employment Types</Label>
          <p className="text-sm text-muted-foreground mb-3">What types of employment are you offering?</p>

          <div className="grid grid-cols-2 gap-3">
            {employmentTypeOptions.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={(formData.employmentTypes || []).includes(type.id)}
                  onCheckedChange={() => handleEmploymentTypeToggle(type.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-base">Remote Work Options</Label>
          <p className="text-sm text-muted-foreground mb-3">What remote work options do you offer?</p>

          <div className="grid grid-cols-2 gap-3">
            {remoteOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={(formData.remoteOptions || []).includes(option.id)}
                  onCheckedChange={() => handleRemoteOptionToggle(option.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
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
