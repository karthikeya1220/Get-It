"use client"

import { useMemo, useState } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { CreatePost } from "@/components/feed/create-post"
import { PostCard, PostSkeleton } from "@/components/feed/post-card"
import { FeedSidebar } from "@/components/feed/feed-sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, User, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import type { DocumentSnapshot } from "firebase/firestore"
import { getFeedPage, type FeedSort } from "@/lib/feed-service"

const TABS: { value: FeedSort; label: string; short: string; icon: typeof Sparkles }[] = [
  { value: "recent", label: "For You", short: "You", icon: Sparkles },
  { value: "trending", label: "Trending", short: "Trend", icon: TrendingUp },
  { value: "mine", label: "My Posts", short: "Mine", icon: User },
]

export function FeedContainer() {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState<FeedSort>("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["feed", sort],
    queryFn: ({ pageParam }) => getFeedPage(sort, pageParam),
    initialPageParam: null as DocumentSnapshot | null,
    getNextPageParam: (last) => (last.hasMore ? last.cursor : undefined),
  })

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data])

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts
    const needle = searchQuery.toLowerCase()
    return posts.filter(
      (post) => post.content.toLowerCase().includes(needle) || post.author.name.toLowerCase().includes(needle),
    )
  }, [posts, searchQuery])

  const handlePostCreated = () => queryClient.invalidateQueries({ queryKey: ["feed"] })

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main feed column */}
        <div className="lg:col-span-8">
          <div className="rounded-xl bg-card p-1 shadow-sm border border-border">
            <div className="mb-2 px-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters((open) => !open)}
                  className={showFilters ? "bg-secondary" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Sort by: {sort === "trending" ? "Engagement" : "Newest first"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                        Clear search
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Tabs value={sort} onValueChange={(value) => setSort(value as FeedSort)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary">
                {TABS.map(({ value, label, short, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:bg-background data-[state=active]:text-primary"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{short}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-4 space-y-6 px-1 pb-1">
                <CreatePost onPostCreated={handlePostCreated} />

                {isPending ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => <PostSkeleton key={i} />)
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No posts found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `No posts matching "${searchQuery}"`
                        : sort === "mine"
                          ? "You haven't posted anything yet"
                          : "There are no posts in your feed yet"}
                    </p>
                  </div>
                )}

                {hasNextPage && !searchQuery && (
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                      {isFetchingNextPage && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:col-span-4 lg:block">
          <FeedSidebar posts={posts} />
        </div>
      </div>
    </div>
  )
}
