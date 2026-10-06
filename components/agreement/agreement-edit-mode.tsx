"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgreementEditModeProps {
  agreementData: any
  onSave: (updatedData: any) => void
  onCancel: () => void
}

export default function AgreementEditMode({ agreementData, onSave, onCancel }: AgreementEditModeProps) {
  const [formData, setFormData] = useState({ ...agreementData })
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(agreementData.startDate))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      setFormData((prev: typeof formData) => ({
        ...prev,
        startDate: date.toISOString(),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          You are in edit mode. Make your requested changes and submit them for review. The company will be notified of
          your change requests.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Position Details</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="position">Position Title</Label>
            <Input id="position" name="position" value={formData.position} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Compensation</Label>
            <Input id="salary" name="salary" value={formData.salary} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {startDate ? format(startDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select onValueChange={(value) => handleSelectChange("duration", value)} defaultValue={formData.duration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time (Permanent)">Full-time (Permanent)</SelectItem>
                <SelectItem value="6 months contract">6 months contract</SelectItem>
                <SelectItem value="1 year contract">1 year contract</SelectItem>
                <SelectItem value="2 year contract">2 year contract</SelectItem>
                <SelectItem value="Internship (3 months)">Internship (3 months)</SelectItem>
                <SelectItem value="Internship (6 months)">Internship (6 months)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType">Work Type</Label>
            <Select onValueChange={(value) => handleSelectChange("workType", value)} defaultValue={formData.workType}>
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Notes</h2>
        <Textarea
          name="additionalNotes"
          value={formData.additionalNotes || ""}
          onChange={handleInputChange}
          placeholder="Add any additional requests or clarifications here..."
          className="min-h-[120px]"
        />
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
        >
          Submit Changes
        </Button>
      </div>
    </form>
  )
}
