export interface PostAuthor {
  id: string
  name: string
  role: string
  avatar: string
}

export interface CommentAuthor {
  id: string
  name: string
  avatar: string
}

export interface PostComment {
  id: string
  author: CommentAuthor
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replyTo?: string
}

export interface Post {
  id: string
  author: PostAuthor
  content: string
  image?: string
  imageAlt?: string
  timestamp: string
  likes: number
  comments: PostComment[]
  shares: number
  isLiked: boolean
}
