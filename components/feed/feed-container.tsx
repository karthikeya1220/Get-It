"use client"

import { useState, useEffect } from "react"
import { CreatePost } from "@/components/feed/create-post"
import { PostCard, PostSkeleton } from "@/components/feed/post-card"
import { FeedSidebar } from "@/components/feed/feed-sidebar"
import { mockFeedData } from "@/components/feed/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Clock, Users, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import type { Post } from "@/components/feed/types"

export function FeedContainer() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("for-you")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      setPosts(mockFeedData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts])
  }

  const filterPosts = (tab: string) => {
    setActiveTab(tab)
    setLoading(true)

    // Simulate API call for different tabs
    setTimeout(() => {
      if (tab === "trending") {
        // Sort by most likes and shares
        setPosts([...mockFeedData].sort((a, b) => b.likes + b.shares - (a.likes + a.shares)))
      } else if (tab === "recent") {
        // Sort by timestamp (newest first)
        setPosts([...mockFeedData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
      } else if (tab === "network") {
        // Filter to show only posts from your network (for demo, we'll show fewer posts)
        setPosts(mockFeedData.filter((_, index) => index % 2 === 0))
      } else {
        // "for-you" tab - default order
        setPosts(mockFeedData)
      }
      setLoading(false)
    }, 500)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : posts

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
                  onClick={toggleFilters}
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
                        Date: Any time
                      </Button>
                      <Button variant="outline" size="sm">
                        Sort by: Relevance
                      </Button>
                      <Button variant="outline" size="sm">
                        Content type: All
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Tabs defaultValue="for-you" className="w-full" onValueChange={filterPosts}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary">
                <TabsTrigger
                  value="for-you"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">For You</span>
                  <span className="sm:hidden">You</span>
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Trending</span>
                  <span className="sm:hidden">Trend</span>
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Recent</span>
                  <span className="sm:hidden">New</span>
                </TabsTrigger>
                <TabsTrigger
                  value="network"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Network</span>
                  <span className="sm:hidden">Net</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="for-you" className="mt-0">
                <CreatePost onPostCreated={handleCreatePost} />

                <div className="mt-6 space-y-6">
                  {loading ? (
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
                        {searchQuery ? `No posts matching "${searchQuery}"` : "There are no posts in your feed yet"}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-0">
                <div className="mt-6 space-y-6">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => <PostSkeleton key={i} />)
                    : filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <div className="mt-6 space-y-6">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => <PostSkeleton key={i} />)
                    : filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </TabsContent>

              <TabsContent value="network" className="mt-0">
                <div className="mt-6 space-y-6">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => <PostSkeleton key={i} />)
                    : filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {!loading && filteredPosts.length > 5 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="px-8">
                Load More
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:col-span-4 lg:block">
          <FeedSidebar />
        </div>
      </div>
    </div>
  )
}
