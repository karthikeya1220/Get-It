"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface RecruiterAboutProps {
  recruiter: any
  isEditable?: boolean
  onUpdate?: (section: string, data: any) => void
}

export function RecruiterAbout({ recruiter, isEditable = false, onUpdate }: RecruiterAboutProps) {
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)
  const [isEditSpecializationsOpen, setIsEditSpecializationsOpen] = useState(false)
  const [editedSpecializations, setEditedSpecializations] = useState(recruiter.specializations || [])
  const [newSpecialization, setNewSpecialization] = useState("")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleAddSpecialization = () => {
    if (!newSpecialization.trim()) return
    setEditedSpecializations([...editedSpecializations, newSpecialization.trim()])
    setNewSpecialization("")
  }

  const handleRemoveSpecialization = (index: number) => {
    const updated = [...editedSpecializations]
    updated.splice(index, 1)
    setEditedSpecializations(updated)
  }

  const handleSaveSpecializations = () => {
    if (!onUpdate) return
    onUpdate("specializations", editedSpecializations)
    setIsEditSpecializationsOpen(false)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>Contact details and professional information</CardDescription>
            </div>

            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditContactOpen(true)}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                <Icons.edit className="h-4 w-4" />
                <span className="ml-1">Edit</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{recruiter.fullName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Job Title</p>
                <p className="font-medium">{recruiter.jobTitle}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Icons.mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${recruiter.email}`} className="font-medium hover:text-amber-600 transition-colors">
                    {recruiter.email}
                  </a>
                </div>
              </div>

              {recruiter.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Icons.phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${recruiter.phoneNumber}`}
                      className="font-medium hover:text-amber-600 transition-colors"
                    >
                      {recruiter.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {recruiter.linkedinProfile && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">LinkedIn</p>
                  <div className="flex items-center gap-2">
                    <Icons.linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`https://linkedin.com/in/${recruiter.linkedinProfile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-amber-600 transition-colors"
                    >
                      linkedin.com/in/{recruiter.linkedinProfile}
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(recruiter.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Specializations</p>

                {isEditable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditSpecializationsOpen(true)}
                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    <Icons.edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {recruiter.specializations && recruiter.specializations.length > 0 ? (
                  recruiter.specializations.map((specialization: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    >
                      {specialization}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specializations added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Preferred Communication</CardTitle>
            <CardDescription>How to best reach this recruiter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Icons.mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Prefers communication via {recruiter.preferredCommunication || "email"}</p>
                <p className="text-sm text-muted-foreground">
                  Average response time: {recruiter.averageResponseTime || "24 hours"}
                </p>
              </div>
              <Button className="ml-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Specializations Dialog */}
      {isEditable && (
        <Dialog open={isEditSpecializationsOpen} onOpenChange={setIsEditSpecializationsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Specializations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a specialization..."
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialization()
                    }
                  }}
                />
                <Button onClick={handleAddSpecialization} type="button">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {editedSpecializations.map((specialization: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 pr-1"
                  >
                    {specialization}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1 text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                      onClick={() => handleRemoveSpecialization(index)}
                    >
                      <Icons.x className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
                {editedSpecializations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No specializations added yet</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSpecializationsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSpecializations}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
