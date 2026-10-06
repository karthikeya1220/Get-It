"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface RecruiterSignupStepFourProps {
  formData: any
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  isLoading: boolean
}

export function RecruiterSignupStepFour({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isLoading,
}: RecruiterSignupStepFourProps) {
  const [newValue, setNewValue] = useState("")
  const [newBenefit, setNewBenefit] = useState("")

  const companyValueOptions = [
    "Innovation",
    "Teamwork",
    "Diversity & Inclusion",
    "Work-Life Balance",
    "Customer Focus",
    "Excellence",
    "Integrity",
    "Transparency",
    "Sustainability",
    "Social Responsibility",
    "Growth Mindset",
    "Accountability",
  ]

  const handleValueToggle = (value: string) => {
    const currentValues = [...(formData.companyValues || [])]
    const valueIndex = currentValues.indexOf(value)

    if (valueIndex === -1) {
      updateFormData({ companyValues: [...currentValues, value] })
    } else {
      currentValues.splice(valueIndex, 1)
      updateFormData({ companyValues: currentValues })
    }
  }

  const handleAddValue = () => {
    if (newValue.trim() === "") return

    const currentValues = [...(formData.companyValues || [])]
    updateFormData({ companyValues: [...currentValues, newValue.trim()] })
    setNewValue("")
  }

  const handleAddBenefit = () => {
    if (newBenefit.trim() === "") return

    const currentBenefits = [...(formData.benefits || [])]
    updateFormData({ benefits: [...currentBenefits, newBenefit.trim()] })
    setNewBenefit("")
  }

  const handleRemoveBenefit = (benefit: string) => {
    const currentBenefits = [...(formData.benefits || [])]
    updateFormData({ benefits: currentBenefits.filter((b) => b !== benefit) })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base">Company Values</Label>
          <p className="text-sm text-muted-foreground mb-3">Select values that represent your company culture</p>

          <div className="grid grid-cols-2 gap-3">
            {companyValueOptions.map((value, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`value-${index}`}
                  checked={(formData.companyValues || []).includes(value)}
                  onCheckedChange={() => handleValueToggle(value)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={`value-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Add a custom value"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddValue()
                }
              }}
            />
            <Button type="button" onClick={handleAddValue} variant="outline">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {(formData.companyValues || []).map((value: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {value}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-base">Benefits & Perks</Label>
          <p className="text-sm text-muted-foreground mb-3">What benefits do you offer to employees?</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {(formData.benefits || []).map((benefit: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                {benefit}
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(benefit)}
                  className="ml-1 rounded-full hover:text-destructive"
                >
                  <Icons.x className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="e.g., Health insurance, Remote work, Flexible hours"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddBenefit()
                }
              }}
            />
            <Button type="button" onClick={handleAddBenefit} variant="outline">
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="workEnvironment" className="text-base">
            Work Environment
          </Label>
          <Textarea
            id="workEnvironment"
            name="workEnvironment"
            placeholder="Describe your company's work environment, culture, and what makes it unique..."
            value={formData.workEnvironment || ""}
            onChange={handleChange}
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="teamStructure" className="text-base">
            Team Structure
          </Label>
          <Textarea
            id="teamStructure"
            name="teamStructure"
            placeholder="Describe your team structure, reporting relationships, and collaboration style..."
            value={formData.teamStructure || ""}
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
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </form>
  )
}
