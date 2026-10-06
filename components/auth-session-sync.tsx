"use client"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"
import { createSessionCookie, clearSessionCookie } from "@/lib/auth-session"

/**
 * Keeps the HttpOnly `__session` cookie in sync with Firebase Auth so
 * `middleware.ts` can gate protected routes. Mounted once in the root layout.
 */
export function AuthSessionSync() {
  useEffect(() => {
    let cancelled = false

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return
      if (user) await createSessionCookie()
      else await clearSessionCookie()
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return null
}
