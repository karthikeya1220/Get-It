"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageCircle, Share2, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Post } from "@/components/feed/types"

interface PostActionsProps {
  post: Post
  onToggleComments: () => void
}

export function PostActions({ post, onToggleComments }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [isSaved, setIsSaved] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = () => {
    setIsShared(true)

    // Reset after animation
    setTimeout(() => {
      setIsShared(false)
    }, 2000)
  }

  return (
    <TooltipProvider>
      <div className="flex justify-between p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex-1 gap-1 rounded-none ${
                isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-primary" : ""}`} />
              </motion.div>
              <span>{likesCount > 0 ? likesCount : ""} Like</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? "Unlike this post" : "Like this post"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleComments}
              className="flex-1 gap-1 rounded-none text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length > 0 ? post.comments.length : ""} Comment</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View or add comments</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1 rounded-none text-muted-foreground hover:text-primary"
                >
                  <motion.div animate={{ rotate: isShared ? [0, -45, 0] : 0 }} transition={{ duration: 0.5 }}>
                    <Share2 className="h-4 w-4" />
                  </motion.div>
                  <span>Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={handleShare}>Share to your feed</DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>Share via message</DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>Copy link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this post</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`flex-1 gap-1 rounded-none ${
                isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary" : ""}`} />
              <span>Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSaved ? "Remove from saved" : "Save for later"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
