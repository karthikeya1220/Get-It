"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface SignupStepTwoProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function SignupStepTwo({ formData, updateFormData, nextStep, prevStep, isLoading }: SignupStepTwoProps) {
  const [errors, setErrors] = useState({
    university: "",
    degree: "",
    year: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      university: "",
      degree: "",
      year: "",
    }

    if (!formData.university) {
      newErrors.university = "University/College name is required"
      valid = false
    }

    if (!formData.degree) {
      newErrors.degree = "Degree is required"
      valid = false
    }

    if (!formData.year) {
      newErrors.year = "Year of study is required"
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
          <Label htmlFor="university">
            College/University Name
            <span className="text-destructive"> *</span>
          </Label>
          <Input
            id="university"
            name="university"
            placeholder="Stanford University"
            value={formData.university || ""}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.university && <p className="text-sm text-destructive">{errors.university}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">
            Degree
            <span className="text-destructive"> *</span>
          </Label>
          <Input
            id="degree"
            name="degree"
            placeholder="Bachelor of Science in Computer Science"
            value={formData.degree || ""}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.degree && <p className="text-sm text-destructive">{errors.degree}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">
            Year of Study
            <span className="text-destructive"> *</span>
          </Label>
          <Select
            value={formData.year || ""}
            onValueChange={(value) => handleSelectChange("year", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freshman">Freshman (1st Year)</SelectItem>
              <SelectItem value="sophomore">Sophomore (2nd Year)</SelectItem>
              <SelectItem value="junior">Junior (3rd Year)</SelectItem>
              <SelectItem value="senior">Senior (4th Year)</SelectItem>
              <SelectItem value="graduate">Graduate Student</SelectItem>
              <SelectItem value="phd">PhD Candidate</SelectItem>
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coursework">
            Relevant Coursework
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <Textarea
            id="coursework"
            name="coursework"
            placeholder="List relevant courses you've taken"
            value={formData.coursework || ""}
            onChange={handleChange}
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">
            Certifications
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <Textarea
            id="certifications"
            name="certifications"
            placeholder="List any certifications you have"
            value={formData.certifications || ""}
            onChange={handleChange}
            disabled={isLoading}
            className="min-h-[100px]"
          />
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
