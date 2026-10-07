"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface RecruiterSignupStepTwoProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function RecruiterSignupStepTwo({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isLoading,
}: RecruiterSignupStepTwoProps) {
  const [errors, setErrors] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    companyLocation: "",
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
      companyName: "",
      industry: "",
      companySize: "",
      companyLocation: "",
    }

    if (!formData.companyName) {
      newErrors.companyName = "Company name is required"
      valid = false
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required"
      valid = false
    }

    if (!formData.companySize) {
      newErrors.companySize = "Company size is required"
      valid = false
    }

    if (!formData.companyLocation) {
      newErrors.companyLocation = "Company location is required"
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
          <Label htmlFor="companyName">
            Company Name
            <span className="text-destructive"> *</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Acme Corporation"
            value={formData.companyName || ""}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">
            Company Website
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <Input
            id="companyWebsite"
            name="companyWebsite"
            placeholder="https://www.example.com"
            value={formData.companyWebsite || ""}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">
            Industry
            <span className="text-destructive"> *</span>
          </Label>
          <Select
            value={formData.industry || ""}
            onValueChange={(value) => handleSelectChange("industry", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance & Banking</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail & E-commerce</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="nonprofit">Nonprofit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">
            Company Size
            <span className="text-destructive"> *</span>
          </Label>
          <Select
            value={formData.companySize || ""}
            onValueChange={(value) => handleSelectChange("companySize", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="companySize">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="501-1000">501-1000 employees</SelectItem>
              <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
              <SelectItem value="5001+">5001+ employees</SelectItem>
            </SelectContent>
          </Select>
          {errors.companySize && <p className="text-sm text-destructive">{errors.companySize}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyDescription">
            Company Description
            <span className="text-muted-foreground text-sm"> (Optional)</span>
          </Label>
          <Textarea
            id="companyDescription"
            name="companyDescription"
            placeholder="Tell us about your company, mission, and values..."
            value={formData.companyDescription || ""}
            onChange={handleChange}
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLocation">
            Company Location
            <span className="text-destructive"> *</span>
          </Label>
          <Input
            id="companyLocation"
            name="companyLocation"
            placeholder="City, State, Country"
            value={formData.companyLocation || ""}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.companyLocation && <p className="text-sm text-destructive">{errors.companyLocation}</p>}
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
