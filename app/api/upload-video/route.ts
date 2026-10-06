import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { initAdmin } from "@/lib/firebase-admin"

export const runtime = "nodejs"

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(request: NextRequest) {
  // Rate limit before auth so forged tokens can't hammer the verifier.
  const limit = rateLimit(`upload-video:${clientIp(request.headers)}`, 20, 60000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData()
    const videoFile = formData.get("video") as File | null

    if (!videoFile) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }
    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only video files are allowed" }, { status: 415 })
    }
    if (videoFile.size > MAX_BYTES) {
      return NextResponse.json({ error: "Video exceeds the 50 MB limit" }, { status: 413 })
    }

    const ext = (videoFile.name.split(".").pop() ?? "webm").replace(/[^a-z0-9]/gi, "").slice(0, 8) || "webm"
    const objectPath = `uploads/${user.uid}/${Date.now()}.${ext}`

    const bucket = initAdmin().storage().bucket()
    const buffer = Buffer.from(await videoFile.arrayBuffer())
    await bucket.file(objectPath).save(buffer, {
      metadata: { contentType: videoFile.type, metadata: { uploadedBy: user.uid } },
      resumable: false,
    })

    return NextResponse.json({ success: true, filePath: objectPath })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ success: false, error: "Failed to upload video" }, { status: 500 })
  }
}
