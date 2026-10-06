"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GrowthSuggestion {
  type: string
  name: string
  platform?: string
  relevance: string
}

interface ProfileGrowthProps {
  suggestions: GrowthSuggestion[]
}

export function ProfileGrowth({ suggestions }: ProfileGrowthProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Icons.bookOpen className="h-5 w-5" />
      case "certification":
        return <Icons.award className="h-5 w-5" />
      case "skill":
        return <Icons.code className="h-5 w-5" />
      default:
        return <Icons.lightbulb className="h-5 w-5" />
    }
  }

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "High":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
    }
  }

  return (
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center gap-2">
          <Icons.lightbulb className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <CardTitle>Career Growth</CardTitle>
        </div>
        <CardDescription>AI-powered recommendations for your professional development</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="rounded-lg border border-violet-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-violet-800/30 dark:bg-zinc-900/80"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    {getIcon(suggestion.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-violet-900 dark:text-white">{suggestion.name}</h3>
                    {suggestion.platform && (
                      <p className="text-xs text-violet-700 dark:text-violet-300">on {suggestion.platform}</p>
                    )}
                  </div>
                </div>
                <Badge className={getRelevanceColor(suggestion.relevance)}>{suggestion.relevance} Relevance</Badge>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-200 bg-white/80 text-violet-800 shadow-sm backdrop-blur-sm hover:bg-white hover:text-violet-900 dark:border-violet-800/30 dark:bg-zinc-900/80 dark:text-violet-300 dark:hover:bg-zinc-800/80 dark:hover:text-violet-200"
                >
                  Save for Later
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                >
                  Explore
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-800/30 dark:bg-violet-900/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Icons.video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-medium text-violet-900 dark:text-white">Create a Video Resume</h3>
              <p className="mb-3 text-sm text-violet-700 dark:text-violet-300">
                Stand out to employers with a 60-second introduction video. Our AI will provide feedback on your
                delivery.
              </p>
              <Button
                className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                size="sm"
              >
                Record Video
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
