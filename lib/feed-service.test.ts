import { describe, expect, it } from "vitest"
import { deriveTrendingTopics, updatePostInFeed, type Post } from "@/lib/feed-service"
const post = (id: string): Post => ({
  id,
  author: { id: "u1", name: "Ada", role: "Student", avatar: "" },
  content: "",
  timestamp: new Date().toISOString(),
  likes: 0,
  commentCount: 0,
  shares: 0,
  isLiked: false,
})

describe("deriveTrendingTopics", () => {
  it("counts hashtags case-insensitively and sorts by frequency", () => {
    const topics = deriveTrendingTopics([
      "Loved #React and #Firestore today",
      "More #React patterns",
      "no hashtags here",
    ])

    expect(topics).toEqual([
      { name: "React", count: 2 },
      { name: "Firestore", count: 1 },
    ])
  })

  it("returns an empty list when nothing is tagged", () => {
    expect(deriveTrendingTopics(["plain text"])).toEqual([])
  })

  it("caps the number of topics returned", () => {
    const contents = Array.from({ length: 10 }, (_, i) => `#tag${i}`)
    expect(deriveTrendingTopics(contents, 3)).toHaveLength(3)
  })
})

describe("updatePostInFeed", () => {
  const cache = {
    pages: [
      { posts: [post("a"), post("b")], cursor: null, hasMore: false },
      { posts: [post("c")], cursor: null, hasMore: false },
    ],
    pageParams: [null],
  }

  it("patches only the matching post across every page", () => {
    const next = updatePostInFeed(cache, "b", (existing) => ({ ...existing, likes: 7, isLiked: true }))!

    expect(next.pages.flatMap((page) => page.posts).map((p) => [p.id, p.likes, p.isLiked])).toEqual([
      ["a", 0, false],
      ["b", 7, true],
      ["c", 0, false],
    ])
    // original untouched
    expect(cache.pages[0].posts[1].likes).toBe(0)
  })

  it("is a no-op when the post is not in the cache", () => {
    const next = updatePostInFeed(cache, "missing", (existing) => ({ ...existing, likes: 99 }))
    expect(next).toBe(cache)
  })

  it("tolerates an empty cache", () => {
    expect(updatePostInFeed(undefined, "a", (p) => p)).toBeUndefined()
  })
})
