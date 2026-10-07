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
        return "bg-success/10 text-success"
      case "Medium":
        return "bg-warning/10 text-warning"
      case "Low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Icons.lightbulb className="h-5 w-5 text-primary" />
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
              className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getIcon(suggestion.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{suggestion.name}</h3>
                    {suggestion.platform && <p className="text-xs text-muted-foreground">on {suggestion.platform}</p>}
                  </div>
                </div>
                <Badge className={getRelevanceColor(suggestion.relevance)}>{suggestion.relevance} Relevance</Badge>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background"
                >
                  Save for Later
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icons.video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-medium text-foreground">Create a Video Resume</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Stand out to employers with a 60-second introduction video. Our AI will provide feedback on your
                delivery.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                Record Video
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
