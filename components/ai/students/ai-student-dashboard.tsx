"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiSkillEnhancement } from "@/components/ai/students/ai-skill-enhancement"
import { AiInterviewPreparation } from "@/components/ai/students/ai-interview-preparation"
import { AiCommunicationGuidance } from "@/components/ai/students/ai-communication-guidance"
import { AiVideoAnalysis } from "@/components/ai/students/ai-video-analysis"
import { Brain, Zap, UserCheck, MessageSquare, Video } from "lucide-react"

interface AiStudentDashboardProps {
  studentId: string
}

export function AiStudentDashboard({ studentId }: AiStudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("skills")

  // Mock user data - in a real app, this would be fetched from an API
  const userData = {
    fullName: "Alex Johnson",
    name: "Alex Johnson",
    skills: [
      { name: "React", level: 85, experience: "3 years" },
      { name: "TypeScript", level: 75, experience: "2 years" },
      { name: "Node.js", level: 70, experience: "2 years" },
      { name: "Python", level: 60, experience: "1 year" },
      { name: "SQL", level: 65, experience: "2 years" },
      { name: "AWS", level: 50, experience: "1 year" },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Redux"],
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        technologies: ["React", "Firebase", "Material UI", "Redux"],
      },
      {
        name: "Data Visualization Dashboard",
        description: "Created an interactive dashboard for visualizing complex datasets",
        technologies: ["React", "D3.js", "TypeScript", "CSS Grid"],
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        year: "2021",
      },
    ],
    experience: [
      {
        role: "Frontend Developer",
        company: "TechStart Inc.",
        duration: "2021-2023",
        description: "Developed and maintained web applications using React and TypeScript",
      },
      {
        role: "Software Engineering Intern",
        company: "InnovateCorp",
        duration: "Summer 2020",
        description: "Worked on backend services using Node.js and Express",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-violet-900 dark:text-violet-300 md:text-4xl">
          AI Growth Assistant
        </h1>
        <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
          Personalized AI tools to accelerate your professional growth and help you achieve your career goals.
        </p>
      </div>

      <Tabs defaultValue="skills" value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-6xl">
        <TabsList className="mb-8 grid w-full grid-cols-2 gap-2 md:grid-cols-5">
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">Skill Enhancement</span>
            <span className="inline md:hidden">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden md:inline">Interview Prep</span>
            <span className="inline md:hidden">Interview</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden md:inline">Communication</span>
            <span className="inline md:hidden">Comm</span>
          </TabsTrigger>
          <TabsTrigger value="video-analysis" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden md:inline">Video Analysis</span>
            <span className="inline md:hidden">Video</span>
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">AI Assistant</span>
            <span className="inline md:hidden">Assistant</span>
          </TabsTrigger>
        </TabsList>

        <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-lg dark:border-violet-800/30 dark:bg-zinc-900/80">
          <TabsContent value="skills" className="mt-0">
            <AiSkillEnhancement studentId={studentId} userData={userData} />
          </TabsContent>

          <TabsContent value="interview" className="mt-0">
            <AiInterviewPreparation studentId={studentId} userData={userData} />
          </TabsContent>

          <TabsContent value="communication" className="mt-0">
            <AiCommunicationGuidance studentId={studentId} userData={userData} />
          </TabsContent>

          <TabsContent value="video-analysis" className="mt-0">
            <AiVideoAnalysis studentId={studentId} userData={userData} />
          </TabsContent>

          <TabsContent value="assistant" className="mt-0">
            <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
              <div className="max-w-md">
                <MessageSquare className="mx-auto h-12 w-12 text-violet-400" />
                <h3 className="mt-4 text-xl font-medium text-violet-900 dark:text-violet-300">AI Chat Assistant</h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Chat with our AI assistant to get personalized career advice, technical guidance, and answers to your
                  questions.
                </p>
                <button className="mt-4 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-800 dark:hover:bg-violet-700">
                  Start Conversation
                </button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
