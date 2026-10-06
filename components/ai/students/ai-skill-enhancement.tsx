"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Lightbulb, BookOpen, ArrowRight, BarChart, TrendingUp, Award } from "lucide-react"

interface Skill {
  name: string
  level: number
  experience: string
}

interface Project {
  name: string
  description: string
  technologies: string[]
}

interface UserData {
  name: string
  skills: Skill[]
  projects: Project[]
  education: any[]
  experience: any[]
}

interface AiSkillEnhancementProps {
  studentId: string
  userData: UserData
}

export function AiSkillEnhancement({ studentId, userData }: AiSkillEnhancementProps) {
  const [activeTab, setActiveTab] = useState("analysis")

  // Generate personalized recommendations based on user skills
  const getPersonalizedRecommendations = () => {
    const recommendations = []

    // Check if user has React skills but needs TypeScript improvement
    if (
      userData.skills.some((s) => s.name === "React" && s.level > 70) &&
      userData.skills.some((s) => s.name === "TypeScript" && s.level < 80)
    ) {
      recommendations.push({
        title: "Advanced TypeScript with React",
        description: "Take your React applications to the next level with advanced TypeScript patterns",
        icon: <Code className="h-5 w-5 text-blue-500" />,
        difficulty: "Intermediate",
        estimatedTime: "4 weeks",
        relevance: "High - Complements your React expertise",
        currentLevel: userData.skills.find((s) => s.name === "TypeScript")?.level || 0,
        targetLevel: 85,
      })
    }

    // Check if user has frontend skills but limited backend experience
    if (
      userData.skills.some((s) => s.name === "React" && s.level > 70) &&
      userData.skills.some((s) => s.name === "Node.js" && s.level < 75)
    ) {
      recommendations.push({
        title: "Full-Stack Development with Node.js",
        description: "Strengthen your backend skills to become a more versatile full-stack developer",
        icon: <Code className="h-5 w-5 text-green-500" />,
        difficulty: "Intermediate",
        estimatedTime: "6 weeks",
        relevance: "High - Balances your frontend expertise",
        currentLevel: userData.skills.find((s) => s.name === "Node.js")?.level || 0,
        targetLevel: 80,
      })
    }

    // Recommend cloud skills if they're lacking
    if (!userData.skills.some((s) => s.name === "AWS" && s.level > 70)) {
      recommendations.push({
        title: "Cloud Architecture with AWS",
        description: "Learn to design and deploy scalable applications on AWS",
        icon: <Brain className="h-5 w-5 text-orange-500" />,
        difficulty: "Advanced",
        estimatedTime: "8 weeks",
        relevance: "Medium - Increasingly important for modern development",
        currentLevel: userData.skills.find((s) => s.name === "AWS")?.level || 0,
        targetLevel: 75,
      })
    }

    // Add a data science recommendation if they have Python experience
    if (userData.skills.some((s) => s.name === "Python" && s.level > 50)) {
      recommendations.push({
        title: "Data Science Fundamentals",
        description: "Build on your Python skills with data analysis and machine learning",
        icon: <BarChart className="h-5 w-5 text-violet-500" />,
        difficulty: "Intermediate",
        estimatedTime: "10 weeks",
        relevance: "Medium - Expands your technical versatility",
        currentLevel: 40,
        targetLevel: 70,
      })
    }

    return recommendations
  }

  const personalizedRecommendations = getPersonalizedRecommendations()

  // Career insights based on skills and projects
  const careerInsights = [
    {
      title: "Full-Stack Development Focus",
      description:
        "Your combination of React and Node.js skills positions you well for full-stack roles. Consider deepening your database knowledge to round out your expertise.",
      icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
      marketTrend: "High demand (+15% YoY)",
    },
    {
      title: "Technical Leadership Potential",
      description:
        "With your project experience and technical breadth, you're on track for technical leadership roles. Focus on system design and architecture skills.",
      icon: <Award className="h-5 w-5 text-violet-500" />,
      marketTrend: "Growing demand (+10% YoY)",
    },
  ]

  // Skill gap analysis
  const skillGaps = [
    {
      category: "Frontend Development",
      proficiency: 80,
      gaps: ["State management patterns", "Performance optimization", "Accessibility standards"],
      recommendation: "Focus on advanced React patterns and performance optimization techniques",
    },
    {
      category: "Backend Development",
      proficiency: 65,
      gaps: ["API security", "Database optimization", "Microservices architecture"],
      recommendation: "Strengthen your backend skills with a focus on scalable architecture",
    },
    {
      category: "DevOps & Cloud",
      proficiency: 45,
      gaps: ["CI/CD pipelines", "Infrastructure as code", "Container orchestration"],
      recommendation: "Invest time in learning modern DevOps practices and cloud services",
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-300">AI Skill Enhancement</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Personalized recommendations to help you grow your skills and advance your career.
        </p>
      </div>

      <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="analysis" className="flex-1">
            Skill Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex-1">
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            Career Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-0">
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-violet-500" />
                  Your Skill Proficiency
                </CardTitle>
                <CardDescription>Current skill levels based on your profile and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.experience}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-500" />
                  Skill Gap Analysis
                </CardTitle>
                <CardDescription>Areas where you can improve to reach your career goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillGaps.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{category.category}</h4>
                      <Badge
                        variant="outline"
                        className={`${
                          category.proficiency >= 75
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : category.proficiency >= 60
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {category.proficiency}% Proficient
                      </Badge>
                    </div>
                    <Progress value={category.proficiency} className="h-2" />
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">Key gaps:</p>
                      <ul className="ml-5 list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                        {category.gaps.map((gap, gapIndex) => (
                          <li key={gapIndex}>{gap}</li>
                        ))}
                      </ul>
                      <p className="mt-2 font-medium text-violet-600 dark:text-violet-400">
                        Recommendation: {category.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-violet-100 dark:border-violet-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Skill Growth Trajectory
              </CardTitle>
              <CardDescription>Your projected skill development based on current learning patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Based on your current learning pace and focus areas, here's how your skills are projected to grow:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      <strong>3-month outlook:</strong> Significant improvement in React and TypeScript, reaching
                      advanced proficiency
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      <strong>6-month outlook:</strong> Solid full-stack capabilities with improved Node.js and database
                      skills
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      <strong>12-month outlook:</strong> Well-rounded developer profile with emerging cloud and DevOps
                      expertise
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setActiveTab("recommendations")}>
                View Personalized Learning Path
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {personalizedRecommendations.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Difficulty:</span>
                      <span className="font-medium">{item.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Est. Time:</span>
                      <span className="font-medium">{item.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Relevance:</span>
                      <span className="font-medium">{item.relevance}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">Current Level:</span>
                      <span className="font-medium">{item.currentLevel}%</span>
                    </div>
                    <Progress value={item.currentLevel} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">Target Level:</span>
                      <span className="font-medium">{item.targetLevel}%</span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-full bg-violet-200 dark:bg-violet-800/50"
                        style={{ width: `${item.targetLevel}%` }}
                      ></div>
                      <div
                        className="absolute top-0 h-full bg-violet-500 dark:bg-violet-400"
                        style={{ width: `${item.currentLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <span>Start Learning Path</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Recommended Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-violet-500" />
                      <h4 className="font-medium">Advanced TypeScript Patterns</h4>
                    </div>
                    <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                      Master advanced TypeScript concepts and patterns for large-scale applications
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400"
                    >
                      Course • 12 hours
                    </Badge>
                  </div>

                  <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-violet-500" />
                      <h4 className="font-medium">Node.js Microservices</h4>
                    </div>
                    <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                      Learn to build scalable backend systems with Node.js microservices architecture
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400"
                    >
                      Workshop • 8 hours
                    </Badge>
                  </div>

                  <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-violet-500" />
                      <h4 className="font-medium">AWS for Frontend Developers</h4>
                    </div>
                    <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                      Practical guide to AWS services most relevant for frontend and full-stack developers
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400"
                    >
                      Tutorial Series • 10 parts
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {careerInsights.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-zinc-600 dark:text-zinc-400">{item.description}</p>
                  <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-900/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Market Trend: {item.marketTrend}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <span>Explore Career Path</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Industry Skill Benchmarks
                </CardTitle>
                <CardDescription>How your skills compare to industry standards for your target roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Senior Frontend Developer</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>React</span>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 dark:text-zinc-400">You: 85%</span>
                            <span className="text-zinc-700 dark:text-zinc-300">Benchmark: 90%</span>
                          </div>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-full bg-zinc-400 dark:bg-zinc-600" style={{ width: "90%" }}></div>
                          <div
                            className="absolute top-0 h-full bg-violet-500 dark:bg-violet-400"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>TypeScript</span>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 dark:text-zinc-400">You: 75%</span>
                            <span className="text-zinc-700 dark:text-zinc-300">Benchmark: 85%</span>
                          </div>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-full bg-zinc-400 dark:bg-zinc-600" style={{ width: "85%" }}></div>
                          <div
                            className="absolute top-0 h-full bg-violet-500 dark:bg-violet-400"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Full-Stack Developer</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>Node.js</span>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 dark:text-zinc-400">You: 70%</span>
                            <span className="text-zinc-700 dark:text-zinc-300">Benchmark: 80%</span>
                          </div>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-full bg-zinc-400 dark:bg-zinc-600" style={{ width: "80%" }}></div>
                          <div
                            className="absolute top-0 h-full bg-violet-500 dark:bg-violet-400"
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>Databases</span>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 dark:text-zinc-400">You: 65%</span>
                            <span className="text-zinc-700 dark:text-zinc-300">Benchmark: 75%</span>
                          </div>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-full bg-zinc-400 dark:bg-zinc-600" style={{ width: "75%" }}></div>
                          <div
                            className="absolute top-0 h-full bg-violet-500 dark:bg-violet-400"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Personalized Improvement Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
