"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Upload,
  Camera,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ThumbsUp,
  Sparkles,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, setDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/firebase"

interface UserData {
  fullName: string
  skills: Array<{ name: string }>
  projects: any[]
}

interface AiVideoAnalysisProps {
  studentId: string
  userData: UserData
}

// Interface for Gemini API response
interface GeminiVideoAnalysis {
  overall_assessment: string
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
  final_action_plan: string[]
}

export function AiVideoAnalysis({ studentId, userData }: AiVideoAnalysisProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoUploaded, setVideoUploaded] = useState(false)
  const [recordingMode, setRecordingMode] = useState(false)
  const [videoPath, setVideoPath] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<GeminiVideoAnalysis | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const queryClient = useQueryClient()

  // Media recorder setup
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // Handle recording functionality
  const handleStartRecording = async () => {
    try {
      setRecordingMode(true)
      setIsRecording(true)

      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current = stream

      // Show preview if videoRef is available
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Initialize media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Clear previous chunks
      chunksRef.current = []

      // Collect video data
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        // Create a blob from all chunks
        const blob = new Blob(chunksRef.current, { type: "video/mp4" })

        // Create a file from the blob
        const fileName = `recorded_${studentId}_${Date.now()}.mp4`
        const recordedFile = new File([blob], fileName, { type: "video/mp4" })

        // Set the file and upload it
        setVideoFile(recordedFile)
        await handleLocalStorage(recordedFile)

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      // Start recording
      mediaRecorder.start()

      // Set a timer to automatically stop recording after 2 minutes
      setTimeout(
        () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            stopRecording()
          }
        },
        2 * 60 * 1000,
      ) // 2 minutes
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
      toast.error("Could not access camera and microphone. Please check your permissions.")
    }
  }

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Show success message
      toast.success("Recording completed successfully")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit")
        return
      }

      // Check file type
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file")
        return
      }

      setVideoFile(file)
      setError(null)

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file)
      setVideoUrl(objectUrl)
    }
  }

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleLocalStorage = async (file: File) => {
    if (!file || !userId) {
      setError("No file selected or user not authenticated")
      return null
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      console.log("Uploading video to local storage...")

      // Get auth token for API request
      const auth = getAuth()
      const token = await auth.currentUser?.getIdToken()
      if (!token) {
        throw new Error("User not authenticated")
      }

      // Create a FormData object with the video
      const formData = new FormData()
      formData.append("video", file)

      // Create a progress tracker
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += Math.random() * 10
        if (progress > 95) {
          clearInterval(progressInterval)
          progress = 95
        }
        setUploadProgress(Math.min(Math.round(progress), 95))
      }, 300)

      // Upload to our API route
      const response = await fetch("/api/upload-video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Upload error: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to upload video")
      }

      console.log("Video uploaded successfully:", data.filePath)
      setUploadProgress(100)
      setIsUploading(false)

      return data.filePath
    } catch (error) {
      console.error("Error storing video:", error)
      setError(error instanceof Error ? error.message : "Failed to store video locally")
      setIsUploading(false)
      return null
    }
  }

  const handleAnalyzeVideo = async () => {
    if (!videoFile || !userId) {
      setError("Video file and user authentication are required")
      return
    }

    try {
      setIsLoading(true)
      setIsAnalyzing(true)
      setError(null)

      // Create a FormData object
      const formData = new FormData()
      formData.append("video", videoFile)

      // Add student info if available
      if (userData) {
        formData.append("studentId", userId)
        formData.append("studentName", userData.fullName || "Student")
        if (userData.skills && userData.skills.length > 0) {
          formData.append("skills", JSON.stringify(userData.skills.map((s) => s.name)))
        }
      }

      // Get the token for authentication
      const token = await getAuth().currentUser?.getIdToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Track upload progress
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      const response = await sendAnalysisRequest(xhr, "/api/interview-analysis", token, formData)

      console.log("Analysis response:", response)

      if (!response.success) {
        throw new Error(response.error || "Failed to analyze video")
      }

      // Store analysis results
      if (response.analysis) {
        setAnalysisResults(response.analysis)

        // Save analysis to Firebase
        await saveAnalysisToFirebase(response.analysis, videoUrl || "")
        queryClient.invalidateQueries({ queryKey: ["interviewAnalyses", userId] })

        toast.success("Interview analysis complete!")
      } else {
        throw new Error("No analysis data in response")
      }
    } catch (err) {
      console.error("Error analyzing video:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast.error("Failed to analyze video. Please try again.")
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
    }
  }

  // Helper function to send API request
  const sendAnalysisRequest = (xhr: XMLHttpRequest, url: string, token: string, formData: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      xhr.open("POST", url, true)
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error("Failed to parse response"))
          }
        } else {
          reject(new Error(`Server responded with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error("Network error occurred"))
      xhr.send(formData)
    })
  }

  // Export analysis as PDF or text
  const handleExportAnalysis = () => {
    if (!analysisResults) return

    try {
      // Create a text representation of the analysis
      const analysisText = `
INTERVIEW ANALYSIS REPORT

OVERALL ASSESSMENT:
${analysisResults.overall_assessment}

SPEAKING SKILLS:
- Clarity: ${analysisResults.speaking_skills.clarity}
- Tone: ${analysisResults.speaking_skills.tone}

Common Mistakes:
${analysisResults.speaking_skills.common_mistakes.map((m) => `- ${m}`).join("\n")}

Improvements:
${analysisResults.speaking_skills.improvements.map((i) => `- ${i}`).join("\n")}

BODY LANGUAGE:
- Eye Contact: ${analysisResults.body_language.eye_contact}
- Posture: ${analysisResults.body_language.posture}
- Gestures: ${analysisResults.body_language.gestures}

Improvements:
${analysisResults.body_language.improvements.map((i) => `- ${i}`).join("\n")}

CONFIDENCE AND PRESENCE:
- Confidence Level: ${analysisResults.confidence_and_presence.confidence_level}
- Energy: ${analysisResults.confidence_and_presence.energy}
- Professionalism: ${analysisResults.confidence_and_presence.professionalism}

Improvements:
${analysisResults.confidence_and_presence.improvements.map((i) => `- ${i}`).join("\n")}

ANSWER QUALITY:
- Structure: ${analysisResults.answer_quality.structure}
- Depth: ${analysisResults.answer_quality.depth}
- Conciseness: ${analysisResults.answer_quality.conciseness}

Improvements:
${analysisResults.answer_quality.improvements.map((i) => `- ${i}`).join("\n")}

FINAL ACTION PLAN:
${analysisResults.final_action_plan.map((i, idx) => `${idx + 1}. ${i}`).join("\n")}

Generated by GetIt AI Interview Coach
      `.trim()

      // Create a blob with the text content
      const blob = new Blob([analysisText], { type: "text/plain" })

      // Create a download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `interview-analysis-${new Date().toISOString().split("T")[0]}.txt`

      // Trigger the download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Analysis report downloaded")
    } catch (error) {
      console.error("Error exporting analysis:", error)
      toast.error("Failed to download analysis report")
    }
  }

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Stop any active media streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Clean up object URLs to prevent memory leaks
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl)
      }
    }
  }, [videoObjectUrl])

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid || studentId)
        console.log("User authenticated:", user.uid)
      } else {
        setUserId(studentId || null)
        console.log("No user authenticated, using provided studentId:", studentId)
      }
    })

    return () => unsubscribe()
  }, [studentId])

  // Function to save analysis results to Firebase
  const saveAnalysisToFirebase = async (analysisData: GeminiVideoAnalysis, videoUrl: string) => {
    try {
      if (!userId) {
        console.warn("Cannot save analysis to Firebase: No user ID")
        return
      }

      // Reference to the user's interviews collection
      const interviewsRef = collection(db, "users", userId, "interview_analyses")

      // Create a document with analysis data
      await setDoc(doc(interviewsRef), {
        timestamp: serverTimestamp(),
        analysis: analysisData,
        videoUrl: videoUrl,
        userId: userId,
        userName: userData?.fullName || "Student",
      })

      console.log("Analysis saved to Firebase successfully")
    } catch (error) {
      console.error("Error saving analysis to Firebase:", error)
      toast.error("Analysis completed but could not be saved to your profile")
    }
  }

  // Fetch user's previous interviews
  const { data: previousAnalyses = [], isPending: isLoadingPreviousAnalyses } = useQuery<any[]>({
    queryKey: ["interviewAnalyses", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return []

      // Reference to the user's interview analyses collection
      const interviewsRef = collection(db, "users", userId, "interview_analyses")

      // Get documents ordered by timestamp
      const q = query(interviewsRef, orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)

      // Convert to array of data
      const analyses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log("Fetched previous analyses:", analyses.length)
      return analyses
    },
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Analysis</CardTitle>
          <CardDescription>
            Upload a video recording of your mock interview for AI analysis. Our AI will provide personalized feedback
            on your interview performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!videoUrl ? (
              <div
                className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleFileInputClick}
              >
                <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                <Icons.upload className="mb-4 h-10 w-10 text-gray-400" />
                <p className="text-center text-gray-500">Click to upload your interview video</p>
                <p className="mt-1 text-center text-sm text-gray-400">MP4, WebM, or MOV (max 100MB)</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                  <video src={videoUrl} controls className="h-full w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{videoFile?.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVideoFile(null)
                      setVideoUrl(null)
                    }}
                  >
                    Change Video
                  </Button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading video...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleAnalyzeVideo} disabled={!videoFile || isAnalyzing || isLoading}>
            {isAnalyzing ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Interview...
              </>
            ) : (
              "Analyze Interview"
            )}
          </Button>
        </CardFooter>
      </Card>

      {previousAnalyses.length > 0 && !analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Analyses</CardTitle>
            <CardDescription>Your recent interview analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingPreviousAnalyses ? (
                <div className="flex items-center justify-center p-4">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading previous analyses...</span>
                </div>
              ) : (
                previousAnalyses.map((analysis: any) => (
                  <div
                    key={analysis.id}
                    className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setAnalysisResults(analysis.analysis)
                      setVideoUrl(analysis.videoUrl)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Interview Analysis</h3>
                        <p className="text-sm text-gray-500">
                          {analysis.timestamp?.toDate
                            ? new Date(analysis.timestamp.toDate()).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Detailed feedback on your interview performance</CardDescription>
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
                  <p>{analysisResults.overall_assessment}</p>
                </div>

                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <h3 className="mb-2 font-semibold">Action Plan</h3>
                  <ul className="ml-5 list-disc space-y-1">
                    {analysisResults.final_action_plan.map((action: string, index: number) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="speaking" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Clarity</h3>
                    <p>{analysisResults.speaking_skills.clarity}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Tone</h3>
                    <p>{analysisResults.speaking_skills.tone}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Common Mistakes</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      {analysisResults.speaking_skills.common_mistakes.map((mistake: string, index: number) => (
                        <li key={index}>{mistake}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <h3 className="mb-2 font-semibold">Improvements</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      {analysisResults.speaking_skills.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="body-language" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Eye Contact</h3>
                    <p>{analysisResults.body_language.eye_contact}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Posture</h3>
                    <p>{analysisResults.body_language.posture}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Gestures</h3>
                    <p>{analysisResults.body_language.gestures}</p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <h3 className="mb-2 font-semibold">Improvements</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      {analysisResults.body_language.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="confidence" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Confidence Level</h3>
                    <p>{analysisResults.confidence_and_presence.confidence_level}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Energy</h3>
                    <p>{analysisResults.confidence_and_presence.energy}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Professionalism</h3>
                    <p>{analysisResults.confidence_and_presence.professionalism}</p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <h3 className="mb-2 font-semibold">Improvements</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      {analysisResults.confidence_and_presence.improvements.map(
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
                    <p>{analysisResults.answer_quality.structure}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Depth</h3>
                    <p>{analysisResults.answer_quality.depth}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h3 className="mb-2 font-semibold">Conciseness</h3>
                    <p>{analysisResults.answer_quality.conciseness}</p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <h3 className="mb-2 font-semibold">Improvements</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      {analysisResults.answer_quality.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
