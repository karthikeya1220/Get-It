import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { getRazorpay, getPublicKeyId } from "@/lib/razorpay"
import { initAdmin } from "@/lib/firebase-admin"
import type { PaymentPurpose } from "@/lib/payments"
import { createOrderSchema, firstIssue } from "@/lib/validation"

export const runtime = "nodejs"

// Amounts live here, never on the client — otherwise the buyer sets the price.
const PRODUCTS: Record<PaymentPurpose, { amount: number; currency: "INR"; description: string }> = {
  profile_verification: { amount: 200, currency: "INR", description: "Profile Verification Fee" },
}

export async function POST(request: NextRequest) {
  // Rate limit before auth so forged tokens can't hammer the verifier.
  const limit = rateLimit(`payment-create-order:${clientIp(request.headers)}`, 20, 60000)
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

  const parsed = createOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: firstIssue(parsed.error) }, { status: 400 })
  }

  const { purpose } = parsed.data
  const product = PRODUCTS[purpose as PaymentPurpose]

  try {
    const order = await getRazorpay().orders.create({
      amount: product.amount,
      currency: product.currency,
      receipt: `rcpt_${user.uid}_${Date.now()}`,
      notes: { uid: user.uid, purpose },
    })

    await initAdmin().firestore().collection("payments").doc(order.id).set({
      userId: user.uid,
      orderId: order.id,
      amount: product.amount,
      currency: product.currency,
      purpose,
      description: product.description,
      status: "created",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: getPublicKeyId(),
      description: product.description,
    })
  } catch (error) {
    console.error("create-order failed:", error)
    return NextResponse.json({ success: false, error: "Could not create payment order" }, { status: 500 })
  }
}
