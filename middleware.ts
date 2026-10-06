import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIXES = ["/profile", "/profiles", "/explore", "/feed", "/ai", "/interview-analysis", "/agreements"]

const SESSION_COOKIE = "__session"

/** True for routes that require a session cookie (UX gate — see note below). */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

/**
 * Redirects signed-out visitors away from app routes.
 *
 * NOTE: this is a UX gate only — it checks that the session cookie exists, it
 * does not verify it. The real security boundary is Firestore security rules
 * plus `requireAuth()` (Firebase ID-token verification) on every API route.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) return NextResponse.next()

  if (request.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.search = ""
  url.searchParams.set("next", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // Skip API routes (Bearer-token auth), Next internals, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
