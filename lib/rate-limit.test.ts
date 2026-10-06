import { beforeEach, describe, expect, it } from "vitest"
import { clientIp, rateLimit, resetRateLimits } from "@/lib/rate-limit"

beforeEach(() => resetRateLimits())

describe("rateLimit", () => {
  it("allows requests up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      const res = rateLimit("k", 5, 1000)
      expect(res.ok).toBe(true)
    }
    expect(rateLimit("k", 5, 1000).ok).toBe(false)
  })

  it("reports the remaining allowance", () => {
    expect(rateLimit("k", 3, 1000).remaining).toBe(2)
    expect(rateLimit("k", 3, 1000).remaining).toBe(1)
    expect(rateLimit("k", 3, 1000).remaining).toBe(0)
  })

  it("blocks with a positive retry-after instead of a bare 429", () => {
    const now = 1_000_000
    rateLimit("k", 1, 30_000, now)
    const blocked = rateLimit("k", 1, 30_000, now + 1_000)

    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(30)
  })

  it("opens a fresh window once the old one has expired", () => {
    const now = 1_000_000
    rateLimit("k", 1, 30_000, now)
    expect(rateLimit("k", 1, 30_000, now + 1).ok).toBe(false)
    expect(rateLimit("k", 1, 30_000, now + 30_001).ok).toBe(true)
  })

  it("keeps buckets independent per key", () => {
    rateLimit("user-a", 1, 1000)
    expect(rateLimit("user-a", 1, 1000).ok).toBe(false)
    expect(rateLimit("user-b", 1, 1000).ok).toBe(true)
  })

  it("resetRateLimits clears every bucket", () => {
    rateLimit("k", 1, 1000)
    resetRateLimits()
    expect(rateLimit("k", 1, 1000).ok).toBe(true)
  })
})

describe("clientIp", () => {
  it("reads the first hop of x-forwarded-for", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4")
  })

  it("falls back to x-real-ip", () => {
    expect(clientIp(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8")
  })

  it('returns "unknown" when no header is present', () => {
    expect(clientIp(new Headers())).toBe("unknown")
  })
})
