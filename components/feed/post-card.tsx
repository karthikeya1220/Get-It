"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Award, Lightbulb, ThumbsUp } from "lucide-react"
import { CommentSection } from "@/components/feed/comment-section"
import { PostActions } from "@/components/feed/post-actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import type { Post } from "@/components/feed/types"

export function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  const handleToggleComments = () => {
    setShowComments(!showComments)
  }

  const handleImageClick = () => {
    if (post.image) {
      setIsImageExpanded(!isImageExpanded)
    }
  }

  // Determine if this is a high-engagement post (for special styling)
  const isHighEngagement = post.likes > 200 || post.comments.length > 10 || post.shares > 50

  return (
    <Card
      className={`overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md ${
        isHighEngagement ? "ring-1 ring-primary/30" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{post.author.name}</div>
            <div className="text-xs text-muted-foreground">
              {post.author.role} • {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Lightbulb className="mr-2 h-4 w-4" /> Not interested
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Award className="mr-2 h-4 w-4" /> Follow {post.author.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="whitespace-pre-wrap text-foreground">{post.content}</div>

        {post.image && (
          <motion.div
            className={`mt-3 cursor-pointer overflow-hidden rounded-lg transition-all ${
              isImageExpanded ? "ring-2 ring-primary/50" : ""
            }`}
            onClick={handleImageClick}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.imageAlt || "Post attachment"}
              className="h-auto w-full object-cover"
            />
          </motion.div>
        )}

        {isHighEngagement && (
          <div className="mt-3">
            <Badge variant="outline" className="bg-secondary text-primary">
              <Award className="mr-1 h-3 w-3" /> Trending in{" "}
              {post.content.match(/#(\w+)/g)?.[0]?.substring(1) ?? "Tech"}
            </Badge>
          </div>
        )}

        {(post.likes > 0 || post.comments.length > 0 || post.shares > 0) && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            {post.likes > 0 && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3 fill-primary text-primary" />
                <span>{post.likes}</span>
              </div>
            )}
            <div className="flex gap-3">
              {post.comments.length > 0 && (
                <button onClick={handleToggleComments} className="hover:text-primary">
                  {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                </button>
              )}
              {post.shares > 0 && <span>{post.shares} shares</span>}
            </div>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-0">
        <PostActions post={post} onToggleComments={handleToggleComments} />
      </CardFooter>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-secondary/50 p-4"
          >
            <CommentSection postId={post.id} comments={post.comments} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export function PostSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />

        <Skeleton className="mt-4 h-48 w-full rounded-lg" />

        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between p-1">
        <Skeleton className="h-8 w-full mx-1" />
        <Skeleton className="h-8 w-full mx-1" />
        <Skeleton className="h-8 w-full mx-1" />
        <Skeleton className="h-8 w-full mx-1" />
      </CardFooter>
    </Card>
  )
}
