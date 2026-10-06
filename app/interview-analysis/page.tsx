"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { analyzeInterviewVideo, getUserInterviewAnalyses } from "@/lib/firebase-service"
import { PremiumNavbar } from "@/components/premium-navbar"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Add interface definitions to fix type issues
interface InterviewAnalysis {
  id: string
  videoUrl: string
  date: Date
  analysis: {
    overall_assessment: string
    final_action_plan: string[]
    speaking_skills: {
      clarity: string
      tone: string
      common_mistakes: string[]
      improvements: string[]
    }
    body_language: {
      eye_contact: string
      posture: string
      gestures: string
      improvements: string[]
    }
    confidence_and_presence: {
      confidence_level: string
      energy: string
      professionalism: string
      improvements: string[]
    }
    answer_quality: {
      structure: string
      depth: string
      conciseness: string
      improvements: string[]
    }
  }
}

export default function InterviewAnalysisPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<InterviewAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      setUserId(user.uid)
    })

    return () => unsubscribe()
  }, [router])

  const {
    data: analyses = [],
    isLoading,
    error,
  } = useQuery<InterviewAnalysis[]>({
    queryKey: ["interview-analyses", userId],
    queryFn: async () => {
      const userAnalyses = await getUserInterviewAnalyses(userId as string)
      // Cast the result to InterviewAnalysis[]
      return userAnalyses as unknown as InterviewAnalysis[]
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (error) {
      console.error("Error:", error)
      toast.error("Failed to fetch analysis data. Please try again.")
    }
  }, [error])

  const currentAnalysis = selectedAnalysis ?? analyses[0] ?? null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if the file is a video
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file")
        return
      }

      // Check file size (limit to 100MB for example)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size exceeds 100MB limit")
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAnalyzeVideo = async () => {
    if (!selectedFile || !userId) {
      toast.error("Please select a video file first")
      return
    }

    try {
      setIsUploading(true)
      toast.info("Uploading and analyzing video. This may take a few minutes...")

      const result = await analyzeInterviewVideo(selectedFile, userId)

      if (result.success) {
        toast.success("Analysis complete!")

        // Add the new analysis to the list and set as current
        const newAnalysis: InterviewAnalysis = {
          id: result.analysisId,
          videoUrl: result.videoUrl,
          date: new Date(),
          analysis: result.analysis,
        }

        queryClient.setQueryData<InterviewAnalysis[]>(["interview-analyses", userId], (previous) => [
          newAnalysis,
          ...(previous ?? []),
        ])
        setSelectedAnalysis(newAnalysis)
        setSelectedFile(null)
        queryClient.invalidateQueries({ queryKey: ["interview-analyses"] })

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (error) {
      console.error("Error analyzing video:", error)
      toast.error("Failed to analyze video. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectAnalysis = (analysis: InterviewAnalysis) => {
    setSelectedAnalysis(analysis)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-violet-50/30 to-white text-violet-950 dark:from-black dark:via-zinc-900/50 dark:to-black dark:text-white">
      <PremiumNavbar userId={userId || ""} />

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:px-8 lg:px-12">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Interview Analysis</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload your interview recording to get detailed feedback from our AI coach.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Interview</CardTitle>
                  <CardDescription>
                    Record yourself answering interview questions and upload for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-violet-500 dark:border-gray-700 dark:hover:border-violet-600"
                    onClick={handleUploadClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Icons.upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {selectedFile ? `Selected: ${selectedFile.name}` : "Click to select a video file"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleAnalyzeVideo} disabled={!selectedFile || isUploading}>
                    {isUploading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Interview"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Previous Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-20 items-center justify-center">
                      <Icons.spinner className="h-5 w-5 animate-spin text-violet-600" />
                    </div>
                  ) : analyses.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No previous analyses found</p>
                  ) : (
                    <div className="space-y-2">
                      {analyses.map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`cursor-pointer rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            currentAnalysis?.id === analysis.id ? "bg-violet-100 dark:bg-violet-900/30" : ""
                          }`}
                          onClick={() => handleSelectAnalysis(analysis)}
                        >
                          <p className="font-medium">Analysis {new Date(analysis.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{new Date(analysis.date).toLocaleTimeString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-2">
              {currentAnalysis ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Interview Video</CardTitle>
                      <CardDescription>Recorded on {new Date(currentAnalysis.date).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video overflow-hidden rounded-lg bg-black">
                        <video src={currentAnalysis.videoUrl} controls className="h-full w-full" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="speaking">Speaking</TabsTrigger>
                          <TabsTrigger value="body-language">Body Language</TabsTrigger>
                          <TabsTrigger value="confidence">Confidence</TabsTrigger>
                          <TabsTrigger value="answers">Answers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4 space-y-4">
                          <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                            <h3 className="mb-2 font-semibold">Overall Assessment</h3>
                            <p>{currentAnalysis.analysis.overall_assessment}</p>
                          </div>

                          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                            <h3 className="mb-2 font-semibold">Action Plan</h3>
                            <ul className="ml-5 list-disc space-y-1">
                              {currentAnalysis.analysis.final_action_plan.map((action: string, index: number) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="speaking" className="mt-4 space-y-4">
                          <div className="space-y-4">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Clarity</h3>
                              <p>{currentAnalysis.analysis.speaking_skills.clarity}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Tone</h3>
                              <p>{currentAnalysis.analysis.speaking_skills.tone}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Common Mistakes</h3>
                              <ul className="ml-5 list-disc space-y-1">
                                {currentAnalysis.analysis.speaking_skills.common_mistakes.map(
                                  (mistake: string, index: number) => (
                                    <li key={index}>{mistake}</li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <h3 className="mb-2 font-semibold">Improvements</h3>
                              <ul className="ml-5 list-disc space-y-1">
                                {currentAnalysis.analysis.speaking_skills.improvements.map(
                                  (improvement: string, index: number) => (
                                    <li key={index}>{improvement}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="body-language" className="mt-4 space-y-4">
                          <div className="space-y-4">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Eye Contact</h3>
                              <p>{currentAnalysis.analysis.body_language.eye_contact}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Posture</h3>
                              <p>{currentAnalysis.analysis.body_language.posture}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Gestures</h3>
                              <p>{currentAnalysis.analysis.body_language.gestures}</p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <h3 className="mb-2 font-semibold">Improvements</h3>
                              <ul className="ml-5 list-disc space-y-1">
                                {currentAnalysis.analysis.body_language.improvements.map(
                                  (improvement: string, index: number) => (
                                    <li key={index}>{improvement}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="confidence" className="mt-4 space-y-4">
                          <div className="space-y-4">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Confidence Level</h3>
                              <p>{currentAnalysis.analysis.confidence_and_presence.confidence_level}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Energy</h3>
                              <p>{currentAnalysis.analysis.confidence_and_presence.energy}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Professionalism</h3>
                              <p>{currentAnalysis.analysis.confidence_and_presence.professionalism}</p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <h3 className="mb-2 font-semibold">Improvements</h3>
                              <ul className="ml-5 list-disc space-y-1">
                                {currentAnalysis.analysis.confidence_and_presence.improvements.map(
                                  (improvement: string, index: number) => (
                                    <li key={index}>{improvement}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="answers" className="mt-4 space-y-4">
                          <div className="space-y-4">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Structure</h3>
                              <p>{currentAnalysis.analysis.answer_quality.structure}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Depth</h3>
                              <p>{currentAnalysis.analysis.answer_quality.depth}</p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <h3 className="mb-2 font-semibold">Conciseness</h3>
                              <p>{currentAnalysis.analysis.answer_quality.conciseness}</p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <h3 className="mb-2 font-semibold">Improvements</h3>
                              <ul className="ml-5 list-disc space-y-1">
                                {currentAnalysis.analysis.answer_quality.improvements.map(
                                  (improvement: string, index: number) => (
                                    <li key={index}>{improvement}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-md text-center">
                    <Icons.video className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No Analysis Selected</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a video recording of your interview practice and our AI coach will provide detailed
                      feedback.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
