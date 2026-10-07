"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface Skill {
  name: string
  proficiency: "Beginner" | "Intermediate" | "Expert"
  endorsements: number
}

interface ProfileSkillsProps {
  skills: Skill[]
  onUpdate?: (skills: Skill[]) => void
  viewAll?: boolean
  onViewAllClick?: () => void
  isEditable?: boolean
}

export function ProfileSkills({
  skills,
  onUpdate,
  viewAll = false,
  onViewAllClick,
  isEditable = false,
}: ProfileSkillsProps) {
  // Ensure skills is always an array
  const skillsArray = Array.isArray(skills) ? skills : []

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false)
  const [editingSkillIndex, setEditingSkillIndex] = useState(-1)
  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    proficiency: "Intermediate",
    endorsements: 0,
  })

  // Always use skillsArray instead of skills directly
  const displayedSkills = viewAll ? skillsArray : skillsArray.slice(0, 6)

  const handleAddSkill = () => {
    if (!newSkill.name) return

    const updatedSkills = [...skillsArray, { ...newSkill }]
    onUpdate?.(updatedSkills)
    setNewSkill({
      name: "",
      proficiency: "Intermediate",
      endorsements: 0,
    })
    setIsAddSkillOpen(false)
    toast({
      title: "Skill added",
      description: `${newSkill.name} has been added to your skills.`,
    })
  }

  const handleEditSkill = () => {
    if (editingSkillIndex === -1 || !newSkill.name) return

    const updatedSkills = [...skillsArray]
    updatedSkills[editingSkillIndex] = { ...newSkill }
    onUpdate?.(updatedSkills)
    setIsEditSkillOpen(false)
    setEditingSkillIndex(-1)
    toast({
      title: "Skill updated",
      description: `${newSkill.name} has been updated successfully.`,
    })
  }

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...skillsArray]
    updatedSkills.splice(index, 1)
    onUpdate?.(updatedSkills)
    toast({
      title: "Skill deleted",
      description: `${skillsArray[index].name} has been removed from your skills.`,
    })
  }

  const openEditSkillModal = (index: number) => {
    setNewSkill({ ...skillsArray[index] })
    setEditingSkillIndex(index)
    setIsEditSkillOpen(true)
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Beginner":
        return "bg-muted text-muted-foreground"
      case "Intermediate":
        return "bg-primary/10 text-primary"
      case "Expert":
        return "bg-warning/10 text-warning"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/5">
          <CardTitle className="flex items-center">
            <Icons.code className="mr-2 h-5 w-5 text-primary" />
            Skills
          </CardTitle>
          <div className="flex gap-2">
            {isEditable && (
              <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsAddSkillOpen(true)}>
                <Icons.plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {displayedSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icons.code className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No skills added yet</p>
              {isEditable && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddSkillOpen(true)}>
                  <Icons.plus className="mr-2 h-4 w-4" />
                  Add your first skill
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {displayedSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{skill.name}</h4>
                    <Badge
                      variant="outline"
                      className={`${getProficiencyColor(skill.proficiency)} border-0 text-xs font-normal`}
                    >
                      {skill.proficiency}
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Icons.users className="mr-1.5 h-3.5 w-3.5" />
                    <span>
                      {skill.endorsements} {skill.endorsements === 1 ? "endorsement" : "endorsements"}
                    </span>
                  </div>

                  {isEditable && (
                    <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => openEditSkillModal(index)}
                      >
                        <Icons.edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-destructive/10 p-0 hover:bg-destructive/10"
                        onClick={() => handleDeleteSkill(index)}
                      >
                        <Icons.trash className="h-3.5 w-3.5 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {!viewAll && skillsArray.length > 6 && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="border-border bg-primary/5 text-primary hover:bg-primary/10"
                onClick={onViewAllClick}
              >
                View all {skillsArray.length} skills
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>Add a new skill to your profile</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="skill-name" className="text-right text-sm font-medium">
                Skill
              </label>
              <Input
                id="skill-name"
                placeholder="e.g. React, Python, UI/UX Design"
                className="col-span-3"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="proficiency" className="text-right text-sm font-medium">
                Proficiency
              </label>
              <Select
                value={newSkill.proficiency}
                onValueChange={(value) =>
                  setNewSkill({
                    ...newSkill,
                    proficiency: value as "Beginner" | "Intermediate" | "Expert",
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditSkillOpen} onOpenChange={setIsEditSkillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update your skill information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-skill-name" className="text-right text-sm font-medium">
                Skill
              </label>
              <Input
                id="edit-skill-name"
                placeholder="e.g. React, Python, UI/UX Design"
                className="col-span-3"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-proficiency" className="text-right text-sm font-medium">
                Proficiency
              </label>
              <Select
                value={newSkill.proficiency}
                onValueChange={(value) =>
                  setNewSkill({
                    ...newSkill,
                    proficiency: value as "Beginner" | "Intermediate" | "Expert",
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSkillOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSkill}>Update Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
