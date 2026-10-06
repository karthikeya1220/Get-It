/**
 * Fixed-window in-memory rate limiter.
 *
 * Scope: one process. On serverless this limits each instance independently,
 * which still caps abuse but is not a global limit — swap the Map for a shared
 * store (Redis / Upstash) when you run more than one replica.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 10_000

export interface RateLimitResult {
  ok: boolean
  /** Requests left in the current window (0 when blocked). */
  remaining: number
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number, now: number = Date.now()): RateLimitResult {
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    prune(now)
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) }
  }

  existing.count += 1
  return { ok: true, remaining: Math.max(0, limit - existing.count), retryAfterSeconds: 0 }
}

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/** Best-effort caller identity. Falls back to "unknown" when no proxy header exists. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}

/** Test-only: drop all counters. */
export function resetRateLimits() {
  buckets.clear()
}
