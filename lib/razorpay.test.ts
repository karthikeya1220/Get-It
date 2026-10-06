import crypto from "node:crypto"
import { beforeEach, describe, expect, it } from "vitest"
import { getPublicKeyId, getRazorpay, verifyPaymentSignature, verifyWebhookSignature } from "@/lib/razorpay"

const KEY_ID = "rzp_test_unit"
const KEY_SECRET = "unit_secret"
const WEBHOOK_SECRET = "unit_webhook_secret"

const hmac = (payload: string, secret: string) => crypto.createHmac("sha256", secret).update(payload).digest("hex")

beforeEach(() => {
  process.env.RAZORPAY_KEY_ID = KEY_ID
  process.env.RAZORPAY_KEY_SECRET = KEY_SECRET
  process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET
})

describe("verifyPaymentSignature", () => {
  it("accepts a signature produced with the real secret", () => {
    const orderId = "order_ABC123"
    const paymentId = "pay_XYZ789"
    const signature = hmac(`${orderId}|${paymentId}`, KEY_SECRET)

    expect(verifyPaymentSignature(orderId, paymentId, signature)).toBe(true)
  })

  it("rejects a tampered payment id", () => {
    const orderId = "order_ABC123"
    const signature = hmac(`${orderId}|pay_XYZ789`, KEY_SECRET)

    expect(verifyPaymentSignature(orderId, "pay_TAMPERED", signature)).toBe(false)
  })

  it("rejects a signature made with a different secret", () => {
    const signature = hmac("order_ABC123|pay_XYZ789", "attacker_secret")

    expect(verifyPaymentSignature("order_ABC123", "pay_XYZ789", signature)).toBe(false)
  })

  it("rejects signatures of a different length without throwing", () => {
    expect(verifyPaymentSignature("order_A", "pay_B", "deadbeef")).toBe(false)
  })

  it("returns false when any part is missing", () => {
    const signature = hmac("a|b", KEY_SECRET)
    expect(verifyPaymentSignature("", "pay_B", signature)).toBe(false)
    expect(verifyPaymentSignature("order_A", "", signature)).toBe(false)
    expect(verifyPaymentSignature("order_A", "pay_B", "")).toBe(false)
  })

  it("returns false when the secret env var is absent", () => {
    delete process.env.RAZORPAY_KEY_SECRET
    const signature = hmac("order_A|pay_B", KEY_SECRET)
    expect(verifyPaymentSignature("order_A", "pay_B", signature)).toBe(false)
  })
})

describe("verifyWebhookSignature", () => {
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_1" } } } })

  it("accepts a signature over the exact raw body", () => {
    expect(verifyWebhookSignature(body, hmac(body, WEBHOOK_SECRET))).toBe(true)
  })

  it("rejects a body that changed by one byte", () => {
    const signature = hmac(body, WEBHOOK_SECRET)
    expect(verifyWebhookSignature(body + " ", signature)).toBe(false)
  })

  it("rejects a signature for a different webhook secret", () => {
    expect(verifyWebhookSignature(body, hmac(body, "other_secret"))).toBe(false)
  })

  it("returns false when the webhook secret is unset", () => {
    delete process.env.RAZORPAY_WEBHOOK_SECRET
    expect(verifyWebhookSignature(body, hmac(body, WEBHOOK_SECRET))).toBe(false)
  })
})

describe("getPublicKeyId", () => {
  it("returns the key id (safe to expose)", () => {
    expect(getPublicKeyId()).toBe(KEY_ID)
  })

  it("throws when unset rather than returning undefined", () => {
    delete process.env.RAZORPAY_KEY_ID
    expect(() => getPublicKeyId()).toThrow(/RAZORPAY_KEY_ID/)
  })
})

describe("getRazorpay", () => {
  it("throws when credentials are missing", () => {
    delete process.env.RAZORPAY_KEY_ID
    delete process.env.RAZORPAY_KEY_SECRET
    expect(() => getRazorpay()).toThrow(/RAZORPAY/)
  })
})
