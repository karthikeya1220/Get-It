"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ProfileHeaderProps {
  userData: any
  onUpdate?: (data: any) => void
  isEditable?: boolean
}

export function ProfileHeader({ userData, onUpdate, isEditable = false }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isEditSocialOpen, setIsEditSocialOpen] = useState(false)
  const [editedLinks, setEditedLinks] = useState(userData.socialLinks || {})

  // State for edited profile data
  const [editedProfile, setEditedProfile] = useState({
    fullName: userData.fullName || "",
    title: userData.title || "",
    website: userData.website || "",
    university: userData.university || "",
  })

  const handleSaveLinks = () => {
    try {
      // Update the userData with the new social links
      onUpdate?.({ socialLinks: editedLinks })

      setIsEditSocialOpen(false)
      toast.success("Social links updated successfully")
    } catch (error) {
      console.error("Error updating social links:", error)
      toast.error("Failed to update social links")
    }
  }

  const handleSaveProfile = () => {
    try {
      // Update the userData with the new profile data
      onUpdate?.(editedProfile)

      setIsEditProfileOpen(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  const handleLinkChange = (platform: string, value: string) => {
    setEditedLinks((prev: any) => ({
      ...prev,
      [platform]: value,
    }))
  }

  const handleProfileChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-80">
        <img src={userData.coverImage || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {isEditable && (
          <motion.button
            className="absolute bottom-4 right-4 rounded-full bg-background/80 p-2 text-primary backdrop-blur-sm transition-all hover:bg-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.image className="h-5 w-5" />
            <span className="sr-only">Change cover</span>
          </motion.button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative -mt-16 px-4 pb-6 sm:px-6 md:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center sm:flex-row sm:items-end">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
                <AvatarImage src={userData.avatar} alt={userData.fullName} />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {userData.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditable && (
                <motion.button
                  className="absolute bottom-2 right-2 rounded-full bg-background/80 p-1.5 text-primary backdrop-blur-sm transition-all hover:bg-background"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.image className="h-4 w-4" />
                  <span className="sr-only">Change avatar</span>
                </motion.button>
              )}
            </div>
            <div className="mt-4 text-center sm:ml-6 sm:text-left">
              <h1 className="text-2xl font-bold text-foreground">{userData.fullName}</h1>
              <p className="text-sm text-muted-foreground">@{userData.username || userData.id?.substring(0, 8)}</p>
              <p className="mt-1 text-foreground">{userData.title}</p>
              {userData.university && (
                <p className="text-sm text-primary">
                  <Icons.school className="mr-1 inline h-3 w-3" />
                  {userData.university}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex space-x-2 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border bg-background/80 text-primary shadow-md backdrop-blur-sm hover:bg-background"
                >
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact {userData.fullName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Icons.mail className="h-5 w-5 text-primary" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.website && (
                    <div className="flex items-center space-x-2">
                      <Icons.globe className="h-5 w-5 text-primary" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {userData.website}
                      </a>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {isEditable && (
              <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
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
                        value={editedProfile.fullName}
                        onChange={(e) => handleProfileChange("fullName", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={editedProfile.title}
                        onChange={(e) => handleProfileChange("title", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="university">University/Institution</Label>
                      <Input
                        id="university"
                        value={editedProfile.university}
                        onChange={(e) => handleProfileChange("university", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedProfile.website}
                        onChange={(e) => handleProfileChange("website", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="bg-primary">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          {userData.socialLinks?.linkedin && (
            <a
              href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/20"
            >
              <Icons.linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          )}
          {userData.socialLinks?.github && (
            <a
              href={`https://github.com/${userData.socialLinks.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/20"
            >
              <Icons.github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          )}
          {userData.socialLinks?.behance && (
            <a
              href={`https://behance.net/${userData.socialLinks.behance}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/20"
            >
              <Icons.image className="mr-2 h-4 w-4" />
              Behance
            </a>
          )}
          {userData.socialLinks?.dribbble && (
            <a
              href={`https://dribbble.com/${userData.socialLinks.dribbble}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/20"
            >
              <Icons.image className="mr-2 h-4 w-4" />
              Dribbble
            </a>
          )}

          {isEditable && (
            <Dialog open={isEditSocialOpen} onOpenChange={setIsEditSocialOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Icons.edit className="h-4 w-4" />
                  <span className="sr-only">Edit social links</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Social Links</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn Username</Label>
                    <Input
                      id="linkedin"
                      value={editedLinks.linkedin || ""}
                      onChange={(e) => handleLinkChange("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github">GitHub Username</Label>
                    <Input
                      id="github"
                      value={editedLinks.github || ""}
                      onChange={(e) => handleLinkChange("github", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="behance">Behance Username</Label>
                    <Input
                      id="behance"
                      value={editedLinks.behance || ""}
                      onChange={(e) => handleLinkChange("behance", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dribbble">Dribbble Username</Label>
                    <Input
                      id="dribbble"
                      value={editedLinks.dribbble || ""}
                      onChange={(e) => handleLinkChange("dribbble", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveLinks}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
