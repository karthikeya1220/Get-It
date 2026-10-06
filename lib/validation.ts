import { z } from "zod"

/** Razorpay ids are `<prefix>_<alnum>`; 1–64 chars keeps junk out of the HMAC input. */
const razorpayId = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/)
const hmacSha256Hex = z.string().regex(/^[0-9a-f]{64}$/i)

/** Keep in sync with the `PRODUCTS` table in `app/api/payments/create-order`. */
export const PAYMENT_PURPOSES = ["profile_verification"] as const

export const createOrderSchema = z.object({
  purpose: z.enum(PAYMENT_PURPOSES),
})

export const verifyPaymentSchema = z.object({
  orderId: razorpayId,
  paymentId: razorpayId,
  signature: hmacSha256Hex,
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>

/** First validation error, formatted for an API response. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request"
}
