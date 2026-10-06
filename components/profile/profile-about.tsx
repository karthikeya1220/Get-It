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
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.user className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <CardTitle>About</CardTitle>
          </div>
          {isEditable && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
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
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                <Icons.x className="h-4 w-4" />
                <span className="ml-1">Cancel</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
              >
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
            className="text-violet-800 dark:text-violet-200"
          >
            {about || "No information provided yet."}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Textarea
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              className="min-h-[150px] resize-none border-violet-200 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-800/30 dark:focus:border-violet-500"
              placeholder="Write about yourself, your background, interests, and career goals..."
            />
            <div className="mt-2 text-xs text-violet-600 dark:text-violet-400">
              <Icons.lightbulb className="mr-1 inline-block h-3 w-3" />
              Tip: Include your background, interests, and career goals to make your profile stand out.
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
