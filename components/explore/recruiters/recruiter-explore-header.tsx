"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"

interface RecruiterExploreHeaderProps {
  recruiter: any
  totalResults: number
  onSaveSearch: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function RecruiterExploreHeader({
  recruiter,
  totalResults,
  onSaveSearch,
  activeTab,
  setActiveTab,
}: RecruiterExploreHeaderProps) {
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container px-4 py-6 md:px-8 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Talent Explorer</h1>
            <p className="mt-1 text-primary">
              Welcome back, {recruiter.fullName}. Find the perfect candidates for your roles.
            </p>
            <p className="text-sm text-primary">
              {totalResults} {totalResults === 1 ? "candidate" : "candidates"} match your search
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveSearch}
              className="border-border text-primary hover:bg-primary/5 hover:text-primary"
            >
              <Icons.bookmark className="mr-2 h-4 w-4" />
              Save Search
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Icons.download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-primary/5">
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Recommended
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="contacted"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Contacted
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
