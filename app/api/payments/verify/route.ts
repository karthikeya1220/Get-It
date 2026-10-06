import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { completePayment } from "@/lib/payments"
import { firstIssue, verifyPaymentSchema } from "@/lib/validation"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  // Rate limit before auth so forged tokens can't hammer the verifier.
  const limit = rateLimit(`payment-verify:${clientIp(request.headers)}`, 30, 60000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = verifyPaymentSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: firstIssue(parsed.error) }, { status: 400 })
  }

  const { orderId, paymentId, signature } = parsed.data

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    console.warn(`payment signature mismatch for order ${orderId}`)
    return NextResponse.json({ success: false, error: "Payment signature verification failed" }, { status: 400 })
  }

  try {
    const result = await completePayment({ orderId, paymentId, source: "checkout" })
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "verification failed"
    if (message === "payment_not_found") {
      return NextResponse.json({ success: false, error: "Unknown order" }, { status: 404 })
    }
    console.error("payment verify failed:", error)
    return NextResponse.json({ success: false, error: "Could not verify payment" }, { status: 500 })
  }
}
