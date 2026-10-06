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
      <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
        <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
          <CardTitle className="flex items-center">
            {/* <Icons.trophy className="mr-2 h-5 w-5 text-amber-500" /> */}
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <Icons.award className="h-12 w-12 text-gray-300 dark:text-gray-700" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">No achievements yet</p>
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
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <CardTitle className="flex items-center">
          <Icons.trophy className="mr-2 h-5 w-5 text-amber-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 divide-y divide-gray-100 dark:divide-gray-800">
        {displayedAchievements.map((achievement, index) => (
          <motion.div
            key={index}
            className="py-3 first:pt-0 last:pb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                {getIcon(achievement.icon)}
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-violet-900 dark:text-violet-300">{achievement.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {!showAll && achievements.length > 3 && (
          <div className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
            >
              View {achievements.length - 3} more achievements
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
