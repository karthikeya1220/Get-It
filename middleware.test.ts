import { describe, expect, it } from "vitest"
import { isProtectedPath } from "@/middleware"

describe("isProtectedPath", () => {
  it.each(["/profile", "/profiles", "/explore", "/feed", "/ai", "/interview-analysis", "/agreements"])(
    "protects the bare prefix %s",
    (path) => {
      expect(isProtectedPath(path)).toBe(true)
    },
  )

  it.each(["/profiles/students/abc", "/explore/students", "/ai/students/abc", "/agreements/recruiters/x/y"])(
    "protects nested route %s",
    (path) => {
      expect(isProtectedPath(path)).toBe(true)
    },
  )

  it.each(["/", "/login", "/signup", "/recruiter-signup", "/signup-options", "/api/payments/verify"])(
    "leaves public path %s open",
    (path) => {
      expect(isProtectedPath(path)).toBe(false)
    },
  )

  it("does not treat lookalike prefixes as protected", () => {
    expect(isProtectedPath("/profilex")).toBe(false)
    expect(isProtectedPath("/explore-mine")).toBe(false)
    expect(isProtectedPath("/feedly")).toBe(false)
  })
})
