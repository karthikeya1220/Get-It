"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Reply, Smile, Send, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PostComment } from "@/components/feed/types"

interface CommentSectionProps {
  postId: string
  comments: PostComment[]
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<PostComment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: `comment-${Date.now()}`,
        author: {
          id: "student-123",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replyTo: replyingTo ?? undefined,
      }

      setComments([...comments, comment])
      setNewComment("")
      setIsSubmitting(false)
      setReplyingTo(null)
    }, 500)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = !comment.isLiked
          return {
            ...comment,
            isLiked,
            likes: isLiked ? comment.likes + 1 : comment.likes - 1,
          }
        }
        return comment
      }),
    )
  }

  const handleReply = (comment: PostComment) => {
    setReplyingTo(comment.id)
    setNewComment(`@${comment.author.name} `)

    // Focus the comment input
    const input = commentInputRef.current
    if (input) {
      setTimeout(() => input.focus(), 0)
    }
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setNewComment("")
  }

  return (
    <div className="space-y-4">
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback className="text-xs">
                  {comment.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="group relative rounded-xl bg-card p-3 shadow-sm">
                  <div className="font-medium text-foreground">{comment.author.name}</div>
                  <div className="text-sm text-foreground">
                    {comment.replyTo && (
                      <span className="font-medium text-primary">
                        @{comments.find((c) => c.id === comment.replyTo)?.author.name || "User"}{" "}
                      </span>
                    )}
                    {comment.content.replace(
                      new RegExp(`^@${comments.find((c) => c.id === comment.replyTo)?.author.name || ""} `),
                      "",
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-1 flex items-center gap-3 pl-2 text-xs">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 ${
                      comment.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${comment.isLiked ? "fill-primary" : ""}`} />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                    Like
                  </button>

                  <button className="text-muted-foreground hover:text-primary" onClick={() => handleReply(comment)}>
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>

                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your profile" />
          <AvatarFallback className="text-xs">AJ</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="relative">
            <Textarea
              ref={commentInputRef}
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              className="min-h-[60px] resize-none pr-10"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-primary"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                Replying to {comments.find((c) => c.id === replyingTo)?.author.name}
                <button type="button" className="ml-2 text-primary hover:text-primary/80" onClick={cancelReply}>
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-2 flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Send className="mr-2 h-3 w-3 animate-pulse" />
                  Posting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-3 w-3" />
                  {replyingTo ? "Reply" : "Post Comment"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
