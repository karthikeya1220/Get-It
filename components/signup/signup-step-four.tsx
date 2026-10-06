"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"

interface SignupStepFourProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function SignupStepFour({ formData, updateFormData, nextStep, prevStep, isLoading }: SignupStepFourProps) {
  const [errors, setErrors] = useState({
    jobType: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({
      portfolioLinks: {
        ...formData.portfolioLinks,
        [name]: value,
      },
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      jobType: "",
    }

    if (!formData.jobType) {
      newErrors.jobType = "Please select your preferred job type"
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
          <Label htmlFor="github">
            GitHub Profile
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
              github.com/
            </span>
            <Input
              id="github"
              name="github"
              placeholder="username"
              value={formData.portfolioLinks?.github || ""}
              onChange={handlePortfolioChange}
              disabled={isLoading}
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">
            LinkedIn Profile
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
              linkedin.com/in/
            </span>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="username"
              value={formData.portfolioLinks?.linkedin || ""}
              onChange={handlePortfolioChange}
              disabled={isLoading}
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="behance">
            Behance Profile
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
              behance.net/
            </span>
            <Input
              id="behance"
              name="behance"
              placeholder="username"
              value={formData.portfolioLinks?.behance || ""}
              onChange={handlePortfolioChange}
              disabled={isLoading}
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dribbble">
            Dribbble Profile
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
              dribbble.com/
            </span>
            <Input
              id="dribbble"
              name="dribbble"
              placeholder="username"
              value={formData.portfolioLinks?.dribbble || ""}
              onChange={handlePortfolioChange}
              disabled={isLoading}
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">
            Work Experience
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <Textarea
            id="experience"
            name="experience"
            placeholder="Briefly describe your previous work experience"
            value={formData.experience || ""}
            onChange={handleChange}
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobType">
            Preferred Job Type
            <span className="text-destructive"> *</span>
          </Label>
          <Select
            value={formData.jobType || ""}
            onValueChange={(value) => handleSelectChange("jobType", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="jobType">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          {errors.jobType && <p className="text-sm text-destructive">{errors.jobType}</p>}
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
