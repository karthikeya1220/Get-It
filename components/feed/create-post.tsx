"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Image as ImageIcon, Link, FileText, Video, X, Upload, Users, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Post } from "@/components/feed/types"

export function CreatePost({ onPostCreated }: { onPostCreated: (post: Post) => void }) {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [privacy, setPrivacy] = useState("public")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!content.trim() && !selectedImage) {
      toast({
        title: "Empty post",
        description: "Please add some content or an image to your post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          id: "student-123",
          name: "Alex Johnson",
          role: "Computer Science Student",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content,
        image: previewUrl ?? undefined,
        imageAlt: selectedImage ? selectedImage.name : undefined,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        shares: 0,
        isLiked: false,
      }

      onPostCreated(newPost)
      setContent("")
      setIsExpanded(false)
      setIsSubmitting(false)
      removeImage()

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      })
    }, 1000)
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardContent className="p-4 pt-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts, achievements or questions..."
                className="min-h-[60px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={handleFocus}
              />
            </div>
          </div>

          <AnimatePresence>
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="relative mt-3 rounded-lg border border-border"
              >
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-64 w-full rounded-lg object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Posting as:</span>
                <span className="font-medium text-foreground">Alex Johnson</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setPrivacy("public")}>
                  <Users className="h-3 w-3" />
                  {privacy === "public" ? "Public" : "Make Public"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => setPrivacy("connections")}
                >
                  <Users className="h-3 w-3" />
                  {privacy === "connections" ? "Connections Only" : "Connections Only"}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>

        {isExpanded && (
          <CardFooter className="flex flex-col border-t border-border px-4 py-3">
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleImageClick}>
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Image</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add an image to your post</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span className="hidden sm:inline">Video</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a video to your post</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Document</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a document to your post</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      <span className="hidden sm:inline">Link</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a link to your post</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">Location</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add your location</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && !selectedImage)}
                className="ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </TooltipProvider>
  )
}
