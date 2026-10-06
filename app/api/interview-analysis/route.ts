import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { requireAuth } from "@/lib/api-auth"
import { clientIp, rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

const MAX_BYTES = 20 * 1024 * 1024 // inline base64 payload cap for Gemini
const MODEL = "gemini-2.0-flash"

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY env var")
  return new GoogleGenerativeAI(apiKey)
}

function buildPrompt(studentName: string, skills: string[]): string {
  return `You are a top-tier interview coach with expertise in evaluating and improving interview performance. Your task is to deeply analyze a student's mock interview recording and provide clear, structured, and actionable feedback in JSON format.

Key evaluation areas:

Speaking Skills: Clarity, fluency, tone, and common mistakes.

Body Language: Eye contact, posture, gestures, and engagement.

Confidence & Presence: Overall confidence, energy levels, and professionalism.

Answer Quality: Logical structuring, depth, and relevance of responses.

Final Action Plan: A prioritized list of improvements.

The student's name is ${studentName} and their skills include ${skills.join(", ") || "software development"}.

STRICT OUTPUT FORMAT: Return the response only in the following JSON format with no extra commentary:

{
  "overall_assessment": "Brief but strong summary of performance",
  "speaking_skills": {
    "clarity": "Precise feedback on clarity and fluency",
    "tone": "Evaluation of tone, pace, and modulation",
    "common_mistakes": ["Mistake 1", "Mistake 2"],
    "improvements": ["Actionable tip 1", "Actionable tip 2"]
  },
  "body_language": {
    "eye_contact": "Feedback on eye contact effectiveness",
    "posture": "Assessment of posture and body movements",
    "gestures": "Analysis of hand and facial gestures",
    "improvements": ["Actionable tip 1", "Actionable tip 2"]
  },
  "confidence_and_presence": {
    "confidence_level": "Strong or weak? Why?",
    "energy": "Does the candidate sound engaged and enthusiastic?",
    "professionalism": "Evaluation of overall professional behavior",
    "improvements": ["Actionable tip 1", "Actionable tip 2"]
  },
  "answer_quality": {
    "structure": "How well are answers structured?",
    "depth": "Depth of knowledge and relevance of responses",
    "conciseness": "Are answers too long or too short?",
    "improvements": ["Actionable tip 1", "Actionable tip 2"]
  },
  "final_action_plan": [
    "Most important improvement area 1",
    "Most important improvement area 2",
    "Most important improvement area 3"
  ]
}

STRICT RULES:
DO NOT include any text outside the JSON output.
DO NOT provide generic advice—make feedback specific and actionable.
BE CRITICAL but constructive—highlight exact weaknesses and how to fix them.
Keep the response clear, professional, and structured.`
}

export async function POST(request: NextRequest) {
  // Rate limit before auth so forged tokens can't hammer the verifier.
  const limit = rateLimit(`interview-analysis:${clientIp(request.headers)}`, 10, 300000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const videoFile = formData.get("video") as File | null
  if (!videoFile) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 })
  }
  if (!videoFile.type.startsWith("video/")) {
    return NextResponse.json({ error: "Only video files can be analyzed" }, { status: 415 })
  }
  if (videoFile.size > MAX_BYTES) {
    return NextResponse.json({ error: "Video exceeds the 20 MB limit" }, { status: 413 })
  }

  const studentName = (formData.get("studentName") as string) || "Student"
  let skills: string[] = []
  try {
    const parsed = JSON.parse((formData.get("skills") as string) || "[]")
    if (Array.isArray(parsed)) skills = parsed.map(String).slice(0, 50)
  } catch {
    // malformed skills are optional context — ignore
  }

  try {
    const model = getClient().getGenerativeModel({
      model: MODEL,
      generationConfig: { responseMimeType: "application/json" },
    })

    const result = await model.generateContent([
      buildPrompt(studentName, skills),
      {
        inlineData: {
          data: Buffer.from(new Uint8Array(await videoFile.arrayBuffer())).toString("base64"),
          mimeType: videoFile.type,
        },
      },
    ])

    const responseText = (await result.response.text()).trim()

    let analysis: unknown
    try {
      analysis = JSON.parse(responseText)
    } catch {
      console.error("Gemini returned non-JSON output:", responseText.slice(0, 500))
      return NextResponse.json(
        { success: false, error: "The analysis service returned an unreadable response. Please try again." },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true, analysis, uid: user.uid })
  } catch (error) {
    console.error("Interview analysis failed:", error)
    return NextResponse.json(
      { success: false, error: "Analysis is temporarily unavailable. Please try again later." },
      { status: 502 },
    )
  }
}
