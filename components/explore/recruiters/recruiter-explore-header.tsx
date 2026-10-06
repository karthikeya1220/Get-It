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
    <div className="border-b border-amber-100 bg-white/80 backdrop-blur-md dark:border-amber-800/30 dark:bg-black/80">
      <div className="container px-4 py-6 md:px-8 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900 dark:text-white md:text-3xl">Talent Explorer</h1>
            <p className="mt-1 text-amber-600 dark:text-amber-400">
              Welcome back, {recruiter.fullName}. Find the perfect candidates for your roles.
            </p>
            <p className="text-sm text-amber-500 dark:text-amber-500">
              {totalResults} {totalResults === 1 ? "candidate" : "candidates"} match your search
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveSearch}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
            >
              <Icons.bookmark className="mr-2 h-4 w-4" />
              Save Search
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
            >
              <Icons.download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-amber-50 dark:bg-amber-900/20">
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
              >
                Recommended
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="contacted"
                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-800/30 dark:data-[state=active]:text-amber-300"
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
