import { NextRequest, NextResponse } from "next/server"
import { initAdmin } from "@/lib/firebase-admin"

export const runtime = "nodejs"

const TWO_WEEKS_MS = 60 * 60 * 24 * 14 * 1000

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TWO_WEEKS_MS / 1000,
}

/** Exchange a Firebase ID token for an HttpOnly session cookie used by middleware. */
export async function POST(request: NextRequest) {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  const idToken = header.slice(7)

  const auth = initAdmin().auth()
  try {
    await auth.verifyIdToken(idToken)
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: TWO_WEEKS_MS })

    const response = NextResponse.json({ success: true })
    response.cookies.set("__session", sessionCookie, cookieOptions)
    // Readable companion so the client can skip pointless DELETEs
    response.cookies.set("__session_present", "1", cookieOptions)
    return response
  } catch (error) {
    console.error("session create failed:", error)
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("__session", "", { ...cookieOptions, maxAge: 0 })
  response.cookies.set("__session_present", "", { ...cookieOptions, maxAge: 0 })
  return response
}
