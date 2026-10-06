import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "@/firebase"
import { getUserProfile, getRecruiterProfile } from "@/lib/firebase-service"

export type AgreementStatus = "pending" | "accepted" | "declined"

export interface AgreementTerm {
  title: string
  content: string
}

export interface Agreement {
  id: string
  recruiterId: string
  studentId: string
  parties: string[]
  createdBy: string
  companyName: string
  companyLogo: string
  studentName: string
  studentAvatar: string
  recruiterName: string
  recruiterSignature: string
  recruiterSignedAt: string
  studentSignature: string
  studentSignedAt: string
  position: string
  salary: string
  startDate: string
  duration: string
  workType: string
  location: string
  additionalNotes: string
  terms: AgreementTerm[]
  status: AgreementStatus
  createdAt: string
  updatedAt: string
}

export interface AgreementSummary {
  id: string
  recruiterId: string
  studentId: string
  companyName: string
  studentName: string
  position: string
  status: AgreementStatus
  updatedAt: string
}

const PLACEHOLDER_AVATAR = "/placeholder.svg?height=200&width=200"

// One agreement per (recruiter, student) pair — the URL segment order in
// /agreements/recruiters/[recruiterId]/[studentId].
// Standard template clauses. Parties edit the offer terms, not this boilerplate.
export const DEFAULT_TERMS: AgreementTerm[] = [
  {
    title: "Employment Terms",
    content:
      "This agreement constitutes a binding contract between the Company and the Employee. The employment relationship is at-will, meaning either party may terminate the relationship at any time, with or without cause, subject to applicable laws and the notice periods specified herein.",
  },
  {
    title: "Compensation & Benefits",
    content:
      "The Employee will receive the compensation stated above, paid on the Company's regular payroll schedule. Benefits are those offered by the Company to employees in comparable roles, as described during the offer process.",
  },
  {
    title: "Work Schedule & Location",
    content:
      "The Employee will work the arrangement stated above (remote, hybrid or on-site) during core working hours agreed with their manager, Monday through Friday, with flexibility as approved by management.",
  },
  {
    title: "Intellectual Property",
    content:
      "All work product, inventions, and intellectual property created during employment and related to the Company's business shall be the sole and exclusive property of the Company. The Employee agrees to execute all documents necessary to perfect the Company's rights in such intellectual property.",
  },
  {
    title: "Confidentiality",
    content:
      "The Employee agrees to maintain the confidentiality of all proprietary information, trade secrets, and non-public information of the Company during and after employment. This includes customer lists, business strategies, technical data, and any other information not generally known to the public.",
  },
  {
    title: "Non-Solicitation",
    content:
      "For a period of twelve (12) months following termination of employment, the Employee agrees not to solicit any employees, contractors, or customers of the Company for any competing business purpose.",
  },
  {
    title: "Termination & Notice",
    content:
      "Either party may terminate this agreement with two weeks' written notice. The Company reserves the right to terminate employment immediately for cause, including but not limited to: violation of company policies, dishonesty, or unsatisfactory performance.",
  },
  {
    title: "Dispute Resolution",
    content:
      "Any disputes arising from this agreement shall first be addressed through mediation. If mediation is unsuccessful, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
  },
]

export function agreementDocId(recruiterId: string, studentId: string): string {
  return `${recruiterId}_${studentId}`
}

// The fields an edit may write. Signatures, status and identity are excluded
// so a "request changes" pass cannot sign the agreement on the student's
// behalf — the rules enforce the same whitelist server-side.
export function editableAgreementFields(input: Partial<Agreement>): Partial<Agreement> {
  const allowed = [
    "companyName",
    "companyLogo",
    "position",
    "salary",
    "startDate",
    "duration",
    "workType",
    "location",
    "additionalNotes",
    "terms",
  ] as const

  const picked: Record<string, unknown> = {}
  for (const key of allowed) {
    const value = input[key]
    if (value !== undefined) picked[key] = value
  }
  return picked as Partial<Agreement>
}

export function buildDraftAgreement(input: {
  recruiterId: string
  studentId: string
  recruiterName: string
  companyName: string
  companyLogo?: string
  studentName: string
  studentAvatar?: string
  defaultPosition?: string
  companyLocation?: string
  now?: Date
}): Agreement {
  const now = input.now ?? new Date()
  const id = agreementDocId(input.recruiterId, input.studentId)
  const startDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()

  return {
    id,
    recruiterId: input.recruiterId,
    studentId: input.studentId,
    parties: [input.recruiterId, input.studentId],
    createdBy: input.recruiterId,
    companyName: input.companyName,
    companyLogo: input.companyLogo || PLACEHOLDER_AVATAR,
    studentName: input.studentName,
    studentAvatar: input.studentAvatar || PLACEHOLDER_AVATAR,
    recruiterName: input.recruiterName,
    recruiterSignature: input.recruiterName,
    recruiterSignedAt: now.toISOString(),
    studentSignature: "",
    studentSignedAt: "",
    position: input.defaultPosition || "Position to be confirmed",
    salary: "Compensation to be confirmed",
    startDate,
    duration: "Full-time (Permanent)",
    workType: "Remote",
    location: input.companyLocation || "To be confirmed",
    additionalNotes: "",
    terms: DEFAULT_TERMS,
    status: "pending",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export async function getAgreement(recruiterId: string, studentId: string): Promise<Agreement | null> {
  const snapshot = await getDoc(doc(db, "agreements", agreementDocId(recruiterId, studentId)))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Agreement
}

// Builds the draft from the two real profiles so the header, name and
// signature match what is actually stored on each side.
export async function createAgreementDraft(recruiterId: string, studentId: string): Promise<Agreement> {
  const existing = await getAgreement(recruiterId, studentId)
  if (existing) return existing

  const [recruiter, student] = await Promise.all([
    getRecruiterProfile(recruiterId).catch(() => null),
    getUserProfile(studentId).catch(() => null),
  ])

  const draft = buildDraftAgreement({
    recruiterId,
    studentId,
    recruiterName: recruiter?.fullName || "Recruiter",
    companyName: recruiter?.companyName || "Company",
    companyLogo: PLACEHOLDER_AVATAR,
    studentName: student?.fullName || "Candidate",
    studentAvatar: student?.avatar || PLACEHOLDER_AVATAR,
    defaultPosition: recruiter?.hiringRoles?.[0],
    companyLocation: recruiter?.companyLocation,
  })

  await setDoc(doc(db, "agreements", draft.id), draft)
  return draft
}

export async function saveAgreement(id: string, input: Partial<Agreement>): Promise<void> {
  const patched = {
    ...editableAgreementFields(input),
    updatedAt: new Date().toISOString(),
  }
  await updateDoc(doc(db, "agreements", id), patched)
}

// Only the student may sign. Reads first so the update can carry the
// student's display name without widening the writable field set.
export async function signAgreement(id: string, accept: boolean): Promise<Agreement> {
  const ref = doc(db, "agreements", id)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) throw new Error("Agreement not found")
  const current = { id: snapshot.id, ...snapshot.data() } as Agreement

  const now = new Date().toISOString()
  const patch = accept
    ? { status: "accepted", studentSignature: current.studentName, studentSignedAt: now, updatedAt: now }
    : { status: "declined", updatedAt: now }

  await updateDoc(ref, patch)
  return { ...current, ...patch } as Agreement
}

export async function listMyAgreements(uid: string): Promise<AgreementSummary[]> {
  const snapshot = await getDocs(query(collection(db, "agreements"), where("parties", "array-contains", uid)))
  return snapshot.docs
    .map((d) => d.data() as Agreement)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(({ id, recruiterId, studentId, companyName, studentName, position, status, updatedAt }) => ({
      id,
      recruiterId,
      studentId,
      companyName,
      studentName,
      position,
      status,
      updatedAt,
    }))
}
