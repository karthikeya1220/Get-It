"use client"

import { getAuth } from "firebase/auth"

/**
 * Exchange the current Firebase ID token for the HttpOnly `__session` cookie
 * that `middleware.ts` checks. Await this BEFORE navigating to a protected
 * route, otherwise middleware will bounce you back to /login.
 */
export async function createSessionCookie(): Promise<boolean> {
  const user = getAuth().currentUser
  if (!user) return false

  try {
    const token = await user.getIdToken()
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch (error) {
    console.error("createSessionCookie failed:", error)
    return false
  }
}

export async function clearSessionCookie(): Promise<void> {
  // Anonymous visitors never had a session — skip the round trip.
  if (!document.cookie.includes("__session_present=")) return

  try {
    await fetch("/api/auth/session", { method: "DELETE" })
  } catch (error) {
    console.error("clearSessionCookie failed:", error)
  }
}
