"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface ProfileAboutProps {
  about: string
  onUpdate?: (about: string) => void
  isEditable?: boolean
}

export function ProfileAbout({ about, onUpdate, isEditable = false }: ProfileAboutProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAbout, setEditedAbout] = useState(about)

  const handleSave = () => {
    onUpdate?.(editedAbout)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your about section has been updated successfully.",
    })
  }

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.user className="h-5 w-5 text-primary" />
            <CardTitle>About</CardTitle>
          </div>
          {isEditable && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-primary hover:text-primary/70"
            >
              <Icons.edit className="h-4 w-4" />
              <span className="ml-1">Edit</span>
            </Button>
          )}
          {isEditable && isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditedAbout(about)
                }}
                className="text-primary hover:text-primary/70"
              >
                <Icons.x className="h-4 w-4" />
                <span className="ml-1">Cancel</span>
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Icons.check className="h-4 w-4" />
                <span className="ml-1">Save</span>
              </Button>
            </div>
          )}
        </div>
        <CardDescription>Tell others about yourself and your professional journey</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-foreground"
          >
            {about || "No information provided yet."}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Textarea
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              className="min-h-[150px] resize-none border-border focus:border-border focus:ring-ring"
              placeholder="Write about yourself, your background, interests, and career goals..."
            />
            <div className="mt-2 text-xs text-primary">
              <Icons.lightbulb className="mr-1 inline-block h-3 w-3" />
              Tip: Include your background, interests, and career goals to make your profile stand out.
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
