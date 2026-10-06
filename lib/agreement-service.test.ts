import { describe, expect, it } from "vitest"
import { agreementDocId, buildDraftAgreement, editableAgreementFields } from "@/lib/agreement-service"

describe("agreementDocId", () => {
  it("is deterministic and ordered like the URL segment", () => {
    expect(agreementDocId("rec1", "stu1")).toBe("rec1_stu1")
    expect(agreementDocId("rec1", "stu1")).toBe(agreementDocId("rec1", "stu1"))
  })
})

describe("editableAgreementFields", () => {
  it("keeps only offer terms and drops identity, signatures and status", () => {
    const picked = editableAgreementFields({
      position: "Backend Engineer",
      salary: "$120,000",
      terms: [{ title: "T", content: "C" }],
      status: "accepted",
      studentSignature: "Forged",
      studentSignedAt: "2026-01-01",
      recruiterId: "someone-else",
      createdBy: "someone-else",
      parties: ["someone-else"],
    })

    expect(picked).toEqual({
      position: "Backend Engineer",
      salary: "$120,000",
      terms: [{ title: "T", content: "C" }],
    })
  })

  it("omits keys that were not provided", () => {
    expect(editableAgreementFields({ location: "Remote" })).toEqual({ location: "Remote" })
    expect(editableAgreementFields({})).toEqual({})
  })
})

describe("buildDraftAgreement", () => {
  const now = new Date("2026-06-01T10:00:00.000Z")
  const draft = buildDraftAgreement({
    recruiterId: "rec1",
    studentId: "stu1",
    recruiterName: "Sarah Williams",
    companyName: "TechInnovate Solutions",
    studentName: "Alex Johnson",
    defaultPosition: "Frontend Developer",
    companyLocation: "San Francisco, CA",
    now,
  })

  it("is pending and unsigned by the candidate", () => {
    expect(draft.status).toBe("pending")
    expect(draft.studentSignature).toBe("")
    expect(draft.studentSignedAt).toBe("")
  })

  it("records the recruiter as the signer and the creator", () => {
    expect(draft.recruiterSignature).toBe("Sarah Williams")
    expect(draft.recruiterSignedAt).toBe(now.toISOString())
    expect(draft.createdBy).toBe("rec1")
    expect(draft.parties).toEqual(["rec1", "stu1"])
  })

  it("derives the offer terms from the real profiles", () => {
    expect(draft.companyName).toBe("TechInnovate Solutions")
    expect(draft.studentName).toBe("Alex Johnson")
    expect(draft.position).toBe("Frontend Developer")
    expect(draft.location).toBe("San Francisco, CA")
    expect(draft.terms.length).toBeGreaterThan(0)
  })

  it("stamps created and updated to the same instant", () => {
    expect(draft.createdAt).toBe(now.toISOString())
    expect(draft.updatedAt).toBe(now.toISOString())
    expect(draft.startDate).toBe(new Date(now.getTime() + 14 * 86400000).toISOString())
  })
})
