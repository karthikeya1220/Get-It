import type { NextRequest } from "next/server"
import { initAdmin } from "@/lib/firebase-admin"

export type AuthedUser = { uid: string; email?: string; role?: string }

/**
 * Verify the `Authorization: Bearer <firebase-id-token>` header.
 * Returns the decoded user, or null when absent/invalid.
 *
 * `role` is the custom claim minted by POST /api/auth/session — read it for
 * authorization decisions instead of trusting a profile document.
 *
 * Usage in a route handler:
 *   const user = await requireAuth(request);
 *   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export async function requireAuth(request: NextRequest): Promise<AuthedUser | null> {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) return null

  try {
    const decoded = await initAdmin().auth().verifyIdToken(header.slice(7))
    return { uid: decoded.uid, email: decoded.email, role: (decoded as { role?: string }).role }
  } catch {
    return null
  }
}
