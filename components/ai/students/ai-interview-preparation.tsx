"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare, Video, Play, Upload, FileText, CheckCircle2, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"

interface UserData {
  name: string
  skills: any[]
  projects: any[]
  education: any[]
  experience: any[]
}

interface AiInterviewPreparationProps {
  studentId: string
  userData: UserData
}

export function AiInterviewPreparation({ studentId, userData }: AiInterviewPreparationProps) {
  const [activeTab, setActiveTab] = useState("questions")
  const [isUploading, setIsUploading] = useState(false)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [resumeAnalysis, setResumeAnalysis] = useState(false)

  // Generate interview questions based on user skills and projects
  const generateInterviewQuestions = () => {
    const questions = []

    // React questions if user has React skills
    if (userData.skills.some((s) => s.name === "React")) {
      questions.push({
        question: "Can you explain the virtual DOM in React and how it improves performance?",
        difficulty: "Medium",
        category: "Technical",
        relevance: "Based on your React experience",
        tips: "Focus on the diffing algorithm and reconciliation process",
      })

      questions.push({
        question:
          "Describe your experience with React hooks and how they've changed your approach to component development.",
        difficulty: "Medium",
        category: "Technical",
        relevance: "Based on your React experience",
        tips: "Mention specific hooks you've used and real-world examples",
      })
    }

    // TypeScript questions if user has TypeScript skills
    if (userData.skills.some((s) => s.name === "TypeScript")) {
      questions.push({
        question: "How do you use TypeScript interfaces and types to improve code quality in your projects?",
        difficulty: "Medium",
        category: "Technical",
        relevance: "Based on your TypeScript experience",
        tips: "Discuss type safety benefits and real examples from your work",
      })
    }

    // Node.js questions if user has Node.js skills
    if (userData.skills.some((s) => s.name === "Node.js")) {
      questions.push({
        question: "Explain how you would design a RESTful API using Node.js and Express.",
        difficulty: "Medium",
        category: "Technical",
        relevance: "Based on your Node.js experience",
        tips: "Cover route organization, middleware, error handling, and authentication",
      })
    }

    // Project-based questions
    if (userData.projects.length > 0) {
      questions.push({
        question: `Tell me about the most challenging aspect of your ${userData.projects[0].name} project and how you overcame it.`,
        difficulty: "Medium",
        category: "Behavioral",
        relevance: "Based on your project experience",
        tips: "Use the STAR method: Situation, Task, Action, Result",
      })
    }

    // General technical questions
    questions.push({
      question: "How do you approach debugging a complex issue in a web application?",
      difficulty: "Medium",
      category: "Technical",
      relevance: "Essential for all developer roles",
      tips: "Describe your systematic approach and mention specific tools you use",
    })

    // Behavioral questions
    questions.push({
      question:
        "Describe a situation where you had to meet a tight deadline. How did you manage your time and priorities?",
      difficulty: "Medium",
      category: "Behavioral",
      relevance: "Essential for all roles",
      tips: "Focus on your planning process and how you handled pressure",
    })

    questions.push({
      question: "Tell me about a time when you had to learn a new technology quickly for a project.",
      difficulty: "Easy",
      category: "Behavioral",
      relevance: "Essential for all developer roles",
      tips: "Highlight your learning approach and adaptability",
    })

    return questions
  }

  const interviewQuestions = generateInterviewQuestions()

  const practiceInterviews = [
    {
      title: "Frontend Developer Interview",
      description:
        "Practice a realistic frontend developer interview with questions focused on React, JavaScript, and web fundamentals",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      duration: "30 min",
      difficulty: "Intermediate",
      relevance: "Highly relevant to your skills",
    },
    {
      title: "Full-Stack Developer Interview",
      description: "Comprehensive interview covering both frontend and backend topics based on your skill profile",
      icon: <Zap className="h-5 w-5 text-violet-500" />,
      duration: "45 min",
      difficulty: "Advanced",
      relevance: "Matches your career trajectory",
    },
    {
      title: "Behavioral Interview Practice",
      description: "Focus on common behavioral questions and professional scenarios",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      duration: "25 min",
      difficulty: "All levels",
      relevance: "Essential for all interviews",
    },
  ]

  const resources = [
    {
      title: "Technical Interview Masterclass",
      description: "Learn strategies for answering complex technical questions with confidence",
      icon: <Video className="h-5 w-5 text-rose-500" />,
      type: "Video Course",
      length: "5 lessons",
    },
    {
      title: "Behavioral Interview Guide",
      description: "Master the STAR method and other techniques for behavioral questions",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      type: "Interactive Guide",
      length: "3 modules",
    },
  ]

  const handleResumeUpload = () => {
    setIsUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      setResumeUploaded(true)
    }, 1500)
  }

  const handleResumeAnalysis = () => {
    // Simulate analysis delay
    setTimeout(() => {
      setResumeAnalysis(true)
    }, 1000)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-300">Interview Preparation</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Practice interviews with AI feedback and build your confidence for real interviews.
        </p>
      </div>

      <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="questions" className="flex-1">
            Interview Questions
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex-1">
            Practice Interviews
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex-1">
            Resume Analysis
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex-1">
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-0">
          <div className="mb-4 rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
            <h3 className="mb-2 font-medium text-violet-900 dark:text-violet-300">Personalized Interview Questions</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              These questions are tailored to your skills, projects, and experience. Practice answering them to prepare
              for your interviews.
            </p>
          </div>

          <div className="space-y-4">
            {interviewQuestions.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium">{item.question}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`${
                        item.difficulty === "Easy"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : item.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {item.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300"
                    >
                      {item.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      {item.relevance}
                    </Badge>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                    <div className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-4 w-4 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">Tip:</p>
                        <p className="text-sm text-amber-700 dark:text-amber-400">{item.tips}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">See Sample Answer</Button>
                  <Button>Practice Answer</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {practiceInterviews.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Duration:</span>
                      <span className="font-medium">{item.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Difficulty:</span>
                      <span className="font-medium">{item.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Relevance:</span>
                      <span className="font-medium">{item.relevance}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    <span>Start Practice</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resume" className="mt-0">
          <Card className="border-violet-100 dark:border-violet-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-500" />
                Resume Analysis
              </CardTitle>
              <CardDescription>
                Upload your resume to get AI-powered feedback and suggestions for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!resumeUploaded ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-200 bg-violet-50/50 p-12 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
                  <FileText className="mb-4 h-12 w-12 text-violet-400" />
                  <h3 className="mb-2 text-lg font-medium text-violet-900 dark:text-violet-300">Upload your resume</h3>
                  <p className="mb-4 max-w-md text-zinc-600 dark:text-zinc-400">
                    Our AI will analyze your resume and provide personalized feedback to help you stand out to
                    recruiters.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      variant="outline"
                      className="relative overflow-hidden"
                      disabled={isUploading}
                      onClick={handleResumeUpload}
                    >
                      <Input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={handleResumeUpload}
                      />
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Resume"}
                    </Button>
                    <Button variant="outline">Use Profile Data</Button>
                  </div>
                </div>
              ) : !resumeAnalysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">Resume uploaded successfully</p>
                        <p className="text-sm text-green-700 dark:text-green-400">resume_alex_johnson.pdf</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-700 dark:text-green-400">
                      Change
                    </Button>
                  </div>

                  <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-violet-500" />
                      <p className="text-violet-700 dark:text-violet-400">
                        Ready to analyze your resume and provide personalized feedback.
                      </p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleResumeAnalysis}>
                    Analyze Resume
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                    <h3 className="mb-2 font-medium text-violet-900 dark:text-violet-300">Resume Analysis Complete</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Here's our AI-powered feedback on your resume. We've identified strengths and areas for
                      improvement.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                      <h4 className="mb-2 font-medium text-green-800 dark:text-green-300">Resume Strengths</h4>
                      <ul className="ml-5 list-disc space-y-1 text-green-700 dark:text-green-400">
                        <li>Strong technical skills section with relevant technologies</li>
                        <li>Clear project descriptions with measurable outcomes</li>
                        <li>Well-structured work experience with accomplishments</li>
                        <li>Good balance of technical and soft skills</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                      <h4 className="mb-2 font-medium text-amber-800 dark:text-amber-300">Areas for Improvement</h4>
                      <ul className="ml-5 list-disc space-y-1 text-amber-700 dark:text-amber-400">
                        <li>Add more quantifiable achievements to highlight impact</li>
                        <li>Tailor your skills section more specifically to job descriptions</li>
                        <li>Consider adding a brief professional summary at the top</li>
                        <li>Enhance descriptions of collaborative work and team contributions</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                      <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-300">ATS Optimization Tips</h4>
                      <ul className="ml-5 list-disc space-y-1 text-blue-700 dark:text-blue-400">
                        <li>
                          Include more industry-specific keywords like "full-stack development" and "responsive design"
                        </li>
                        <li>Use standard section headings for better parsing</li>
                        <li>Ensure consistent formatting throughout the document</li>
                        <li>Consider a simpler layout for better ATS compatibility</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline">Download Detailed Report</Button>
                    <Button>Get Improved Resume Template</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Type:</span>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Length:</span>
                    <span className="font-medium">{item.length}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <span>Access Resource</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Interview Question Bank</CardTitle>
                  <MessageSquare className="h-5 w-5 text-violet-500" />
                </div>
                <CardDescription>
                  Comprehensive collection of interview questions for various tech roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-900/20">
                  <p className="text-sm text-violet-700 dark:text-violet-400">
                    Access 500+ curated interview questions across frontend, backend, full-stack, and specialized roles.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <span>Browse Questions</span>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-violet-100 dark:border-violet-800/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Mock Interview Recordings</CardTitle>
                  <Video className="h-5 w-5 text-amber-500" />
                </div>
                <CardDescription>Watch expert mock interviews with detailed feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-900/20">
                  <p className="text-sm text-violet-700 dark:text-violet-400">
                    Learn from watching others in realistic interview scenarios with professional feedback.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <span>Watch Recordings</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
