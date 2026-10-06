import { NextRequest, NextResponse } from "next/server"
import { initAdmin } from "@/lib/firebase-admin"
import type { DecodedIdToken } from "firebase-admin/auth"

export const runtime = "nodejs"

const TWO_WEEKS_MS = 60 * 60 * 24 * 14 * 1000

const ROLES = ["student", "recruiter"] as const
type Role = (typeof ROLES)[number]

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TWO_WEEKS_MS / 1000,
}

/**
 * Role is self-declared at signup but is frozen the moment the claim is minted:
 * Firestore rules block later `Role` edits, and this runs once per user.
 */
async function resolveRole(uid: string): Promise<Role | null> {
  const db = initAdmin().firestore()

  const legacy = await db.doc(`users/${uid}`).get()
  const fromLegacy = String(legacy.get("Role") ?? "").toLowerCase()
  if (fromLegacy === "student" || fromLegacy === "recruiter") return fromLegacy

  for (const role of ROLES) {
    const snap = await db.doc(`users/${role}/${uid}/user_details`).get()
    if (snap.exists) return role
  }

  return null
}

async function mintRoleClaim(decoded: DecodedIdToken): Promise<Role | null> {
  if (decoded.role) return decoded.role as Role

  const role = await resolveRole(decoded.uid)
  if (!role) return null

  const { customClaims } = await initAdmin().auth().getUser(decoded.uid)
  await initAdmin()
    .auth()
    .setCustomUserClaims(decoded.uid, { ...customClaims, role })
  return role
}

/** Exchange a Firebase ID token for an HttpOnly session cookie used by middleware. */
export async function POST(request: NextRequest) {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  const idToken = header.slice(7)

  const auth = initAdmin().auth()
  let decoded: DecodedIdToken
  try {
    decoded = await auth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }

  try {
    // The token just presented cannot carry a claim we only now wrote, so hand
    // back 409 and let the client force-refresh + retry once.
    if (!decoded.role) {
      const role = await mintRoleClaim(decoded)
      if (role && !decoded.role) {
        return NextResponse.json({ success: false, needsRefresh: true }, { status: 409 })
      }
    }

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: TWO_WEEKS_MS })

    const response = NextResponse.json({ success: true, role: decoded.role ?? null })
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
