import { describe, expect, it } from "vitest"
import { createOrderSchema, firstIssue, verifyPaymentSchema } from "@/lib/validation"

describe("createOrderSchema", () => {
  it("accepts a known purpose", () => {
    expect(createOrderSchema.safeParse({ purpose: "profile_verification" }).success).toBe(true)
  })

  it("rejects an unknown or invented purpose", () => {
    expect(createOrderSchema.safeParse({ purpose: "free_lifetime" }).success).toBe(false)
    expect(createOrderSchema.safeParse({ purpose: "constructor" }).success).toBe(false)
    expect(createOrderSchema.safeParse({}).success).toBe(false)
    expect(createOrderSchema.safeParse({ purpose: 42 }).success).toBe(false)
  })

  it("rejects extra fields carrying a client-set price", () => {
    const res = createOrderSchema.safeParse({ purpose: "profile_verification", amount: 1 })
    expect(res.success).toBe(true)
    expect("amount" in (res.success ? res.data : {})).toBe(false)
  })
})

describe("verifyPaymentSchema", () => {
  const valid = {
    orderId: "order_ABC123",
    paymentId: "pay_XYZ789",
    signature: "a".repeat(64),
  }

  it("accepts well-formed razorpay ids and a 64-char hex signature", () => {
    expect(verifyPaymentSchema.safeParse(valid).success).toBe(true)
  })

  it.each(["orderId", "paymentId", "signature"])("requires %s", (field) => {
    const body = { ...valid }
    delete (body as Record<string, unknown>)[field]
    expect(verifyPaymentSchema.safeParse(body).success).toBe(false)
  })

  it("rejects a non-hex or wrong-length signature", () => {
    expect(verifyPaymentSchema.safeParse({ ...valid, signature: "zz".repeat(32) }).success).toBe(false)
    expect(verifyPaymentSchema.safeParse({ ...valid, signature: "abc" }).success).toBe(false)
  })

  it("rejects ids containing injection-prone characters", () => {
    expect(verifyPaymentSchema.safeParse({ ...valid, orderId: "order_A|B" }).success).toBe(false)
    expect(verifyPaymentSchema.safeParse({ ...valid, paymentId: "../pay" }).success).toBe(false)
  })
})

describe("firstIssue", () => {
  it("returns a human-readable message from the first error", () => {
    const parsed = verifyPaymentSchema.safeParse({ orderId: "", paymentId: "", signature: "" })
    expect(parsed.success).toBe(false)
    if (!parsed.success) expect(firstIssue(parsed.error)).toBeTypeOf("string")
  })
})
