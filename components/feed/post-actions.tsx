"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { recordShare, toggleLike, updatePostInFeed, type FeedPage, type Post } from "@/lib/feed-service"
import type { InfiniteData } from "@tanstack/react-query"

interface PostActionsProps {
  post: Post
  onToggleComments: () => void
}

type FeedCache = InfiniteData<FeedPage>

export function PostActions({ post, onToggleComments }: PostActionsProps) {
  const queryClient = useQueryClient()
  const [isShared, setIsShared] = useState(false)

  const { mutate: like } = useMutation({
    mutationFn: () => toggleLike(post),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      const previous = queryClient.getQueriesData<FeedCache>({ queryKey: ["feed"] })
      queryClient.setQueriesData<FeedCache>({ queryKey: ["feed"] }, (cache) =>
        updatePostInFeed(cache, post.id, (existing) => ({
          ...existing,
          likes: existing.likes + (existing.isLiked ? -1 : 1),
          isLiked: !existing.isLiked,
        })),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, cache]) => queryClient.setQueryData(key, cache))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  const { mutate: share } = useMutation({
    mutationFn: () => recordShare(post.id),
    onSuccess: () => {
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })

  return (
    <TooltipProvider>
      <div className="flex justify-between p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => like()}
              className={`flex-1 gap-1 rounded-none ${
                post.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: post.isLiked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThumbsUp className={`h-4 w-4 ${post.isLiked ? "fill-primary" : ""}`} />
              </motion.div>
              <span>{post.likes > 0 ? post.likes : ""} Like</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{post.isLiked ? "Unlike this post" : "Like this post"}</p>
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
              <span>{post.commentCount > 0 ? post.commentCount : ""} Comment</span>
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
                <DropdownMenuItem onClick={() => share()}>Share to your feed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => share()}>Share via message</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/feed`)
                    share()
                  }}
                >
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this post</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
