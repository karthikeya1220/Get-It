"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { DialogTrigger } from "@radix-ui/react-dialog"

interface RecruiterProfileHeaderProps {
  recruiter: any
  isEditable?: boolean
  onUpdate?: (section: string, data: any) => void
}

export function RecruiterProfileHeader({ recruiter, isEditable = false, onUpdate }: RecruiterProfileHeaderProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editedProfileData, setEditedProfileData] = useState({
    fullName: recruiter.fullName || "",
    jobTitle: recruiter.jobTitle || "",
    phoneNumber: recruiter.phoneNumber || "",
    linkedinProfile: recruiter.linkedinProfile || "",
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getIndustryLabel = (industry: string) => {
    const industryMap: Record<string, string> = {
      technology: "Technology",
      finance: "Finance & Banking",
      healthcare: "Healthcare",
      education: "Education",
      retail: "Retail & E-commerce",
      manufacturing: "Manufacturing",
      media: "Media & Entertainment",
      consulting: "Consulting",
      nonprofit: "Nonprofit",
      other: "Other",
    }

    return industryMap[industry] || industry
  }

  const handleProfileChange = (field: string, value: string) => {
    setEditedProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = () => {
    if (!onUpdate) return

    try {
      onUpdate("", editedProfileData)
      setIsEditProfileOpen(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-600 relative">
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>

          {isEditable && (
            <motion.button
              className="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 text-amber-800 backdrop-blur-sm transition-all hover:bg-white hover:text-amber-900 dark:bg-zinc-900/80 dark:text-amber-300 dark:hover:bg-zinc-800/80 dark:hover:text-amber-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icons.image className="h-5 w-5" />
              <span className="sr-only">Change cover</span>
            </motion.button>
          )}
        </div>

        <CardContent className="p-0">
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                  <AvatarImage src={`/placeholder.svg?height=128&width=128`} alt={recruiter.fullName} />
                  <AvatarFallback className="text-2xl md:text-3xl bg-amber-100 text-amber-800">
                    {getInitials(recruiter.fullName)}
                  </AvatarFallback>
                </Avatar>

                {isEditable && (
                  <motion.button
                    className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-amber-800 backdrop-blur-sm transition-all hover:bg-white hover:text-amber-900 dark:bg-zinc-900/80 dark:text-amber-300 dark:hover:bg-zinc-800/80 dark:hover:text-amber-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icons.image className="h-4 w-4" />
                    <span className="sr-only">Change avatar</span>
                  </motion.button>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold">{recruiter.fullName}</h1>
                  {recruiter.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="h-6 gap-1 px-2 border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 w-fit"
                          >
                            <Icons.checkCircle className="h-3.5 w-3.5" />
                            <span>Verified</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This recruiter has been verified by our team</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Icons.briefcase className="h-4 w-4" />
                    <span>{recruiter.jobTitle}</span>
                  </div>
                  <div className="hidden md:block">•</div>
                  <div className="flex items-center gap-1.5">
                    <Icons.building className="h-4 w-4" />
                    <span>{recruiter.companyName}</span>
                  </div>
                  <div className="hidden md:block">•</div>
                  <div className="flex items-center gap-1.5">
                    <Icons.mapPin className="h-4 w-4" />
                    <span>{recruiter.companyLocation}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    {getIndustryLabel(recruiter.industry)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    {recruiter.companySize} employees
                  </Badge>
                  {recruiter.specializations &&
                    recruiter.specializations.map((specialization: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        {specialization}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>

                {isEditable ? (
                  <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Icons.edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={editedProfileData.fullName}
                            onChange={(e) => handleProfileChange("fullName", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={editedProfileData.jobTitle}
                            onChange={(e) => handleProfileChange("jobTitle", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={editedProfileData.phoneNumber}
                            onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="linkedinProfile">LinkedIn Username</Label>
                          <Input
                            id="linkedinProfile"
                            value={editedProfileData.linkedinProfile}
                            onChange={(e) => handleProfileChange("linkedinProfile", e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-amber-600 to-orange-600">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="outline">
                    <Icons.share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
