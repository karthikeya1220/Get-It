"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"

interface ContactStudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onSubmit: (message: string) => void
}

export function ContactStudentModal({ isOpen, onClose, student, onSubmit }: ContactStudentModalProps) {
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState(`Opportunity at ${student?.company || "Our Company"}`)
  const [includeRole, setIncludeRole] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(message)
      setIsSubmitting(false)
      setMessage("")
      setSubject(`Opportunity at ${student?.company || "Our Company"}`)
      setIncludeRole(true)
    }, 1000)
  }

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-900 dark:text-white">
            Contact {student.fullName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-amber-700 dark:text-amber-400">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-amber-200 dark:border-amber-800/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-amber-700 dark:text-amber-400">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${student.fullName},\n\nI came across your profile and was impressed by your skills and experience. I'd like to discuss a potential opportunity with you.`}
                className="min-h-[150px] border-amber-200 dark:border-amber-800/50"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-role"
                checked={includeRole}
                onCheckedChange={(checked) => setIncludeRole(checked as boolean)}
                className="border-amber-400 text-amber-600 dark:border-amber-700"
              />
              <Label htmlFor="include-role" className="text-sm text-amber-700 dark:text-amber-400">
                Include active job roles in this message
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
