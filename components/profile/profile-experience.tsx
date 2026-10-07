"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface Experience {
  company: string
  role: string
  duration: string
  responsibilities: string[]
  rating: number
}

interface ProfileExperienceProps {
  experience: Experience[]
  onUpdate?: (experience: Experience[]) => void
  viewAll?: boolean
  onViewAllClick?: () => void
  isEditable?: boolean
}

export function ProfileExperience({
  experience,
  onUpdate,
  viewAll = false,
  onViewAllClick,
  isEditable = true,
}: ProfileExperienceProps) {
  const [isAddingExperience, setIsAddingExperience] = useState(false)
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    role: "",
    duration: "",
    responsibilities: [],
    rating: 0,
  })
  const [newResponsibility, setNewResponsibility] = useState("")
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null)
  const [isEditingExperience, setIsEditingExperience] = useState<string | null>(null)
  const [editedExperience, setEditedExperience] = useState<Experience | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const experienceEndRef = useRef<HTMLDivElement>(null)

  const displayedExperience = viewAll ? experience : experience.slice(0, 3)

  // Scroll to the newly added experience
  useEffect(() => {
    if (experienceEndRef.current) {
      experienceEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [experience.length])

  // Handle adding a new experience
  const handleAddExperience = () => {
    if (newExperience.company.trim() === "" || newExperience.role.trim() === "") {
      toast({
        title: "Error",
        description: "Company and role are required",
        variant: "destructive",
      })
      return
    }

    // Make a deep copy of the current experience array
    const updatedExperience = [...experience]

    // Add the new experience with all its details
    updatedExperience.push({
      ...newExperience,
      // Ensure responsibilities is an array
      responsibilities: [...newExperience.responsibilities],
      // Set a default rating if not provided
      rating: newExperience.rating || 0,
    })

    // Update the experience state
    onUpdate?.(updatedExperience)

    // Reset the form
    setNewExperience({
      company: "",
      role: "",
      duration: "",
      responsibilities: [],
      rating: 0,
    })

    setIsAddingExperience(false)
    setNewResponsibility("")

    // Show success toast
    toast({
      title: "Experience added",
      description: `Your experience at ${newExperience.company} has been added successfully.`,
      variant: "default",
    })

    // Set current index to show the newly added experience
    if (!viewAll && updatedExperience.length > 0) {
      setCurrentIndex(Math.min(2, updatedExperience.length - 1))
    }
  }

  // Handle deleting an experience
  const handleDeleteExperience = (company: string) => {
    const updatedExperience = experience.filter((exp) => exp.company !== company)
    onUpdate?.(updatedExperience)
    setExperienceToDelete(null)

    // Adjust current index if needed
    if (currentIndex >= updatedExperience.length && currentIndex > 0) {
      setCurrentIndex(updatedExperience.length - 1)
    }

    toast({
      title: "Experience deleted",
      description: `Experience at ${company} has been removed.`,
      variant: "default",
    })
  }

  // Handle adding a responsibility
  const handleAddResponsibility = () => {
    if (newResponsibility.trim() === "") return

    // Create a new array with the existing responsibilities plus the new one
    const updatedResponsibilities = [...newExperience.responsibilities, newResponsibility.trim()]

    // Update the newExperience state with the updated responsibilities array
    setNewExperience({
      ...newExperience,
      responsibilities: updatedResponsibilities,
    })

    // Clear the input field
    setNewResponsibility("")
  }

  // Handle removing a responsibility
  const handleRemoveResponsibility = (responsibility: string) => {
    setNewExperience({
      ...newExperience,
      responsibilities: newExperience.responsibilities.filter((r) => r !== responsibility),
    })
  }

  // Start editing an experience
  const startEditingExperience = (exp: Experience) => {
    setIsEditingExperience(exp.company)
    setEditedExperience({ ...exp })
  }

  // Handle saving edited experience
  const handleEditExperience = () => {
    if (!editedExperience || !isEditingExperience) return

    const updatedExperience = experience.map((exp) => (exp.company === isEditingExperience ? editedExperience : exp))

    onUpdate?.(updatedExperience)
    setIsEditingExperience(null)
    setEditedExperience(null)

    toast({
      title: "Experience updated",
      description: `Experience at ${editedExperience.company} has been updated successfully.`,
      variant: "default",
    })
  }

  // Handle changes to edited experience fields
  const handleEditedExperienceChange = (field: string, value: any) => {
    if (!editedExperience) return

    setEditedExperience({
      ...editedExperience,
      [field]: value,
    })
  }

  // Handle adding a responsibility to an edited experience
  const handleEditedResponsibilityAdd = () => {
    if (!editedExperience || !newResponsibility.trim()) return

    setEditedExperience({
      ...editedExperience,
      responsibilities: [...editedExperience.responsibilities, newResponsibility],
    })
    setNewResponsibility("")
  }

  // Handle removing a responsibility from an edited experience
  const handleEditedResponsibilityRemove = (responsibility: string) => {
    if (!editedExperience) return

    setEditedExperience({
      ...editedExperience,
      responsibilities: editedExperience.responsibilities.filter((r) => r !== responsibility),
    })
  }

  // Handle next experience in carousel
  const handleNextExperience = () => {
    if (currentIndex < displayedExperience.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop back to the first experience
    }
  }

  // Handle previous experience in carousel
  const handlePrevExperience = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(displayedExperience.length - 1) // Loop to the last experience
    }
  }

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.briefcase className="h-5 w-5 text-primary" />
            <CardTitle>Work Experience</CardTitle>
          </div>
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                  aria-label="Add Experience"
                >
                  <Icons.plus className="mr-1 h-4 w-4" />
                  Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Work Experience</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="e.g., Google, Microsoft, Freelance"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Job Title/Role</Label>
                    <Input
                      id="role"
                      value={newExperience.role}
                      onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                      placeholder="e.g., Software Engineer, UX Designer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newExperience.duration}
                      onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                      placeholder="e.g., Jan 2022 - Present, Jun 2021 - Dec 2021"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Key Responsibilities</Label>
                    <ul className="space-y-2">
                      {newExperience.responsibilities.map((responsibility, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm text-primary"
                        >
                          <span>{responsibility}</span>
                          <button
                            onClick={() => handleRemoveResponsibility(responsibility)}
                            className="ml-2 rounded-full text-destructive hover:text-destructive"
                          >
                            <Icons.x className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Input
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        placeholder="Add a key responsibility"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddResponsibility()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddResponsibility} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddExperience}>Add Experience</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>Share your professional work history</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {experience.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-primary/5 p-8 text-center">
            <Icons.briefcase className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium text-foreground">No work experience yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add your work history to showcase your professional experience
            </p>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                  aria-label="Add Experience"
                >
                  <Icons.plus className="mr-1 h-4 w-4" />
                  Add Experience
                </Button>
              </DialogTrigger>
            </Dialog> */}
          </div>
        ) : viewAll ? (
          <div className="space-y-6">
            <AnimatePresence>
              {displayedExperience.map((exp, index) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-primary hover:text-primary/70"
                      onClick={() => startEditingExperience(exp)}
                    >
                      <Icons.edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
                      onClick={() => setExperienceToDelete(exp.company)}
                    >
                      <Icons.trash className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>

                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">{exp.role}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-primary">{exp.duration}</p>
                    </div>
                    <div className="flex items-center text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Icons.star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(exp.rating) ? "fill-current" : "fill-none"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">Key Responsibilities:</h4>
                    <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                      {exp.responsibilities &&
                        exp.responsibilities.map((responsibility, idx) => <li key={idx}>{responsibility}</li>)}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={experienceEndRef} />
          </div>
        ) : (
          <>
            {displayedExperience.length > 0 ? (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-primary hover:text-primary/70"
                        onClick={() => startEditingExperience(displayedExperience[currentIndex])}
                      >
                        <Icons.edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
                        onClick={() => setExperienceToDelete(displayedExperience[currentIndex].company)}
                      >
                        <Icons.trash className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">
                          {displayedExperience[currentIndex]?.role}
                        </h3>
                        <p className="text-muted-foreground">{displayedExperience[currentIndex]?.company}</p>
                        <p className="text-sm text-primary">{displayedExperience[currentIndex]?.duration}</p>
                      </div>
                      <div className="flex items-center text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Icons.star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(displayedExperience[currentIndex]?.rating || 0) ? "fill-current" : "fill-none"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium text-foreground">Key Responsibilities:</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                        {displayedExperience[currentIndex]?.responsibilities &&
                          displayedExperience[currentIndex]?.responsibilities.map((responsibility, idx) => (
                            <li key={idx}>{responsibility}</li>
                          ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevExperience}
                    className="h-8 w-8 rounded-full bg-background/80 text-primary shadow-md backdrop-blur-sm hover:bg-background"
                  >
                    <Icons.chevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextExperience}
                    className="h-8 w-8 rounded-full bg-background/80 text-primary shadow-md backdrop-blur-sm hover:bg-background"
                  >
                    <Icons.chevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>

                {/* Pagination indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {displayedExperience.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-6 bg-primary" : "w-2 bg-primary/20"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to experience ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-primary/5 p-8 text-center">
                <Icons.briefcase className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium text-foreground">No work experience yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add your work history to showcase your professional experience
                </p>
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                      aria-label="Add Experience"
                    >
                      <Icons.plus className="mr-1 h-4 w-4" />
                      Add Experience
                    </Button>
                  </DialogTrigger>
                </Dialog> */}
              </div>
            )}
          </>
        )}

        {!viewAll && experience.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary hover:text-primary/70" onClick={onViewAllClick}>
              View all {experience.length} experiences
            </Button>
          </div>
        )}

        {/* Edit Experience Dialog */}
        <Dialog open={isEditingExperience !== null} onOpenChange={(open) => !open && setIsEditingExperience(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Work Experience</DialogTitle>
            </DialogHeader>
            {editedExperience && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editCompany">Company/Organization</Label>
                  <Input
                    id="editCompany"
                    value={editedExperience.company}
                    onChange={(e) => handleEditedExperienceChange("company", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editRole">Job Title/Role</Label>
                  <Input
                    id="editRole"
                    value={editedExperience.role}
                    onChange={(e) => handleEditedExperienceChange("role", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDuration">Duration</Label>
                  <Input
                    id="editDuration"
                    value={editedExperience.duration}
                    onChange={(e) => handleEditedExperienceChange("duration", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Key Responsibilities</Label>
                  <ul className="space-y-2">
                    {editedExperience.responsibilities.map((responsibility, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm text-primary"
                      >
                        <span>{responsibility}</span>
                        <button
                          onClick={() => handleEditedResponsibilityRemove(responsibility)}
                          className="ml-2 rounded-full text-destructive hover:text-destructive"
                        >
                          <Icons.x className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a key responsibility"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleEditedResponsibilityAdd()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleEditedResponsibilityAdd} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={handleEditExperience}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={experienceToDelete !== null} onOpenChange={(open) => !open && setExperienceToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Experience</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this work experience? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setExperienceToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => experienceToDelete && handleDeleteExperience(experienceToDelete)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
