import crypto from "node:crypto"
import Razorpay from "razorpay"

let instance: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      throw new Error("Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET env vars")
    }
    instance = new Razorpay({ key_id, key_secret })
  }
  return instance
}

/** Key id is safe to expose to the browser; the secret never leaves the server. */
export function getPublicKeyId(): string {
  const key_id = process.env.RAZORPAY_KEY_ID
  if (!key_id) throw new Error("Missing RAZORPAY_KEY_ID env var")
  return key_id
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)
}

/** HMAC-SHA256(order_id|payment_id, key_secret) === signature */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret || !orderId || !paymentId || !signature) return false

  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")

  return safeEqual(expected, signature)
}

/** HMAC-SHA256(rawBody, webhook_secret) === x-razorpay-signature */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")

  return safeEqual(expected, signature)
}
