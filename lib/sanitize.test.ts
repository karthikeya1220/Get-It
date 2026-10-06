import { describe, expect, it } from "vitest"
import { sanitizeUserData } from "@/lib/sanitize"

describe("sanitizeUserData", () => {
  it("strips password and confirmPassword", () => {
    const out = sanitizeUserData({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "hunter2",
      confirmPassword: "hunter2",
    })

    expect(out).toEqual({ fullName: "Ada Lovelace", email: "ada@example.com" })
    expect(out).not.toHaveProperty("password")
    expect(out).not.toHaveProperty("confirmPassword")
  })

  it("keeps every other field, including nested objects and arrays", () => {
    const input = {
      fullName: "Ada Lovelace",
      skills: [{ name: "Maths", proficiency: "expert" }],
      preferences: { notifications: true, updates: false },
      password: "hunter2",
    }

    expect(sanitizeUserData(input)).toEqual({
      fullName: "Ada Lovelace",
      skills: [{ name: "Maths", proficiency: "expert" }],
      preferences: { notifications: true, updates: false },
    })
  })

  it("does not mutate the object it was given", () => {
    const input = { fullName: "Ada", password: "hunter2" }
    sanitizeUserData(input)

    expect(input).toEqual({ fullName: "Ada", password: "hunter2" })
  })

  it("is a no-op when no credentials are present", () => {
    const input = { fullName: "Ada", email: "ada@example.com" }
    expect(sanitizeUserData(input)).toEqual(input)
  })
})
