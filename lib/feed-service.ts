import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage"
import { auth, db } from "@/firebase"

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
  commentCount: number
  shares: number
  isLiked: boolean
}

export type FeedSort = "recent" | "trending" | "mine"

export interface FeedPage {
  posts: Post[]
  cursor: QueryDocumentSnapshot | null
  hasMore: boolean
}

export interface ViewerIdentity {
  id: string
  name: string
  role: string
  avatar: string
}

const ROLE_LABEL: Record<string, string> = { student: "Student", recruiter: "Recruiter" }

function toIso(value: unknown): string {
  if (!value) return new Date(0).toISOString()
  const candidate = value as { toDate?: () => Date }
  if (typeof candidate.toDate === "function") return candidate.toDate().toISOString()
  if (value instanceof Date) return value.toISOString()
  return new Date(value as string | number).toISOString()
}

function mapAuthor(data: Record<string, any>, id: string): PostAuthor {
  return {
    id: data.authorId ?? "",
    name: data.authorName ?? "Member",
    role: data.authorRole ?? "Member",
    avatar: data.authorAvatar ?? "",
  }
}

function currentUid(): string {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("You must be signed in to do that")
  return uid
}

/** Read-only lookup of the signed-in user's display identity (no writes). */
export async function getViewerIdentity(): Promise<ViewerIdentity> {
  const user = auth.currentUser
  if (!user) throw new Error("You must be signed in to do that")

  const fallback = user.displayName || user.email?.split("@")[0] || "Member"

  for (const role of ["student", "recruiter"] as const) {
    const snap = await getDoc(doc(db, "users", role, user.uid, "user_details"))
    if (snap.exists()) {
      const data = snap.data()
      return {
        id: user.uid,
        name: data.fullName || data.name || fallback,
        role: ROLE_LABEL[data.Role ?? role],
        avatar: data.avatar || data.photoURL || "",
      }
    }
  }

  const legacy = await getDoc(doc(db, "users", user.uid))
  if (legacy.exists()) {
    const data = legacy.data()
    return {
      id: user.uid,
      name: data.fullName || data.name || fallback,
      role: ROLE_LABEL[String(data.Role ?? "").toLowerCase()] || "Member",
      avatar: data.avatar || data.photoURL || "",
    }
  }

  return { id: user.uid, name: fallback, role: "Member", avatar: user.photoURL || "" }
}

function mapPost(snap: QueryDocumentSnapshot): Post {
  const data = snap.data()
  const likedBy: string[] = data.likedBy ?? []
  const uid = auth.currentUser?.uid ?? ""
  return {
    id: snap.id,
    author: mapAuthor(data, snap.id),
    content: data.content ?? "",
    image: data.image || undefined,
    imageAlt: data.imageAlt || undefined,
    timestamp: toIso(data.createdAt),
    likes: data.likeCount ?? 0,
    commentCount: data.commentCount ?? 0,
    shares: data.shareCount ?? 0,
    isLiked: uid !== "" && likedBy.includes(uid),
  }
}

/** One page of the feed. `cursor` is the snapshot to resume from. */
export async function getFeedPage(sort: FeedSort, cursor: DocumentSnapshot | null, pageSize = 10): Promise<FeedPage> {
  const constraints: Parameters<typeof query>[1][] =
    sort === "mine"
      ? [where("authorId", "==", currentUid()), orderBy("createdAt", "desc")]
      : [orderBy(sort === "trending" ? "engagement" : "createdAt", "desc")]

  constraints.push(fbLimit(pageSize))
  if (cursor) constraints.push(startAfter(cursor))

  const snapshot = await getDocs(query(collection(db, "posts"), ...constraints))
  const posts = snapshot.docs.map(mapPost)
  const last = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

  return { posts, cursor: last, hasMore: snapshot.docs.length === pageSize }
}

export async function uploadPostImage(uid: string, file: File): Promise<string> {
  const path = `posts/${uid}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`
  const storage = getStorage()
  const reference = storageRef(storage, path)
  await uploadBytes(reference, file, { contentType: file.type })
  return getDownloadURL(reference)
}

export interface CreatePostInput {
  content: string
  image?: File | null
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const viewer = await getViewerIdentity()
  const content = input.content.trim()
  if (!content && !input.image) throw new Error("Your post needs some text or an image")

  const image = input.image ? await uploadPostImage(viewer.id, input.image) : ""

  await addDoc(collection(db, "posts"), {
    authorId: viewer.id,
    authorName: viewer.name,
    authorRole: viewer.role,
    authorAvatar: viewer.avatar,
    content,
    image,
    imageAlt: input.image?.name ?? "",
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    engagement: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: "pending",
    author: { id: viewer.id, name: viewer.name, role: viewer.role, avatar: viewer.avatar },
    content,
    image: image || undefined,
    imageAlt: input.image?.name || undefined,
    timestamp: new Date().toISOString(),
    likes: 0,
    commentCount: 0,
    shares: 0,
    isLiked: false,
  }
}

/** Returns the post's new `isLiked` state. */
export async function toggleLike(post: Post): Promise<boolean> {
  const uid = currentUid()
  const liked = !post.isLiked
  const reference = doc(db, "posts", post.id)

  const batch = writeBatch(db)
  batch.update(
    reference,
    liked
      ? { likeCount: increment(1), engagement: increment(1), likedBy: arrayUnion(uid) }
      : { likeCount: increment(-1), engagement: increment(-1), likedBy: arrayRemove(uid) },
  )
  await batch.commit()

  return liked
}

export async function recordShare(postId: string): Promise<void> {
  await updateDoc(doc(db, "posts", postId), {
    shareCount: increment(1),
    engagement: increment(1),
  })
}

export async function deletePost(postId: string): Promise<void> {
  await deleteDoc(doc(db, "posts", postId))
}

function mapComment(id: string, data: Record<string, any>): PostComment {
  const uid = auth.currentUser?.uid ?? ""
  const likedBy: string[] = data.likedBy ?? []
  return {
    id,
    author: {
      id: data.authorId ?? "",
      name: data.authorName ?? "Member",
      avatar: data.authorAvatar ?? "",
    },
    content: data.content ?? "",
    timestamp: toIso(data.createdAt),
    likes: data.likeCount ?? 0,
    isLiked: uid !== "" && likedBy.includes(uid),
    replyTo: data.replyTo || undefined,
  }
}

export async function listComments(postId: string): Promise<PostComment[]> {
  const snapshot = await getDocs(
    query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"), fbLimit(200)),
  )
  return snapshot.docs.map((snap) => mapComment(snap.id, snap.data()))
}

/** Appends the comment and bumps the parent's counter in one batch. */
export async function addComment(postId: string, content: string, replyTo?: string): Promise<void> {
  const viewer = await getViewerIdentity()
  const text = content.trim()
  if (!text) throw new Error("Write something first")

  const batch = writeBatch(db)
  batch.set(doc(collection(db, "posts", postId, "comments")), {
    authorId: viewer.id,
    authorName: viewer.name,
    authorAvatar: viewer.avatar,
    content: text,
    replyTo: replyTo ?? null,
    likeCount: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  })
  batch.update(doc(db, "posts", postId), {
    commentCount: increment(1),
    engagement: increment(1),
  })
  await batch.commit()
}

export async function toggleCommentLike(postId: string, comment: PostComment): Promise<boolean> {
  const uid = currentUid()
  const liked = !comment.isLiked
  const reference = doc(db, "posts", postId, "comments", comment.id)

  const batch = writeBatch(db)
  batch.update(
    reference,
    liked
      ? { likeCount: increment(1), likedBy: arrayUnion(uid) }
      : { likeCount: increment(-1), likedBy: arrayRemove(uid) },
  )
  await batch.commit()

  return liked
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const batch = writeBatch(db)
  batch.delete(doc(db, "posts", postId, "comments", commentId))
  batch.update(doc(db, "posts", postId), {
    commentCount: increment(-1),
    engagement: increment(-1),
  })
  await batch.commit()
}

/**
 * Immutably patches one post inside every cached feed page, so optimistic
 * updates work no matter which sort tab is open.
 */
export function updatePostInFeed<T>(data: T | undefined, postId: string, patch: (post: Post) => Post): T | undefined {
  if (!data) return data
  const pages = (data as unknown as { pages: { posts: Post[] }[] }).pages
  let changed = false

  const nextPages = pages.map((page) => {
    const index = page.posts.findIndex((post) => post.id === postId)
    if (index === -1) return page
    changed = true
    const posts = [...page.posts]
    posts[index] = patch(posts[index])
    return { ...page, posts }
  })

  return changed ? { ...data, pages: nextPages } : data
}

/** Extracts `#hashtags` from a set of posts, most used first. */
export function deriveTrendingTopics(contents: string[], count = 6): { name: string; count: number }[] {
  const totals = new Map<string, number>()
  for (const content of contents) {
    for (const match of content.matchAll(/#(\w+)/g)) {
      const tag = match[1]
      totals.set(tag, (totals.get(tag) ?? 0) + 1)
    }
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, hits]) => ({ name, count: hits }))
}
