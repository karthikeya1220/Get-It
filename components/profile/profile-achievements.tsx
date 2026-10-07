"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { motion } from "framer-motion"

interface Achievement {
  name: string
  description: string
  icon: string
}

interface ProfileAchievementsProps {
  achievements: Achievement[]
  showAll?: boolean
}

export function ProfileAchievements({ achievements = [], showAll = false }: ProfileAchievementsProps) {
  // If no achievements, show a placeholder
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="overflow-hidden border-border shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center">
            {/* <Icons.trophy className="mr-2 h-5 w-5 text-primary" /> */}
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <Icons.award className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No achievements yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 3)

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Icons.award className="h-6 w-6" />
      case "trophy":
        return <Icons.trophy className="h-6 w-6" />
      case "users":
        return <Icons.users className="h-6 w-6" />
      case "star":
        return <Icons.star className="h-6 w-6" />
      case "certificate":
        return <Icons.certificate className="h-6 w-6" />
      default:
        return <Icons.award className="h-6 w-6" />
    }
  }

  return (
    <Card className="overflow-hidden border-border shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center">
          <Icons.trophy className="mr-2 h-5 w-5 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 divide-y divide-border">
        {displayedAchievements.map((achievement, index) => (
          <motion.div
            key={index}
            className="py-3 first:pt-0 last:pb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getIcon(achievement.icon)}
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-foreground">{achievement.name}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {!showAll && achievements.length > 3 && (
          <div className="pt-4">
            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/70">
              View {achievements.length - 3} more achievements
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
