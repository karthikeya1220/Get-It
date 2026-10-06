import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/razorpay"
import { completePayment } from "@/lib/payments"

export const runtime = "nodejs"

/**
 * Razorpay webhook — the source of truth for payment state, so a browser that
 * never calls /api/payments/verify still gets its entitlement.
 * Configure in the Razorpay dashboard with RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get("x-razorpay-signature") ?? ""

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ received: false, error: "Invalid signature" }, { status: 401 })
  }

  let event: {
    event?: string
    payload?: { payment?: { entity?: { order_id?: string; id?: string } } }
  }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ received: false, error: "Invalid payload" }, { status: 400 })
  }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity
    const orderId = payment?.order_id
    const paymentId = payment?.id
    if (orderId && paymentId) {
      try {
        await completePayment({ orderId, paymentId, source: "webhook" })
      } catch (error) {
        // payment_not_found means the order was never created by us — ack anyway
        console.error("webhook payment.captured failed:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
