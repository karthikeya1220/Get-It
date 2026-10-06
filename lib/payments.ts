import { initAdmin } from "@/lib/firebase-admin"

type AdminFirestore = ReturnType<ReturnType<typeof initAdmin>["firestore"]>

/** Registration paths, plus the legacy fallbacks already in the data. */
function userDocPaths(uid: string): string[] {
  return [`users/student/${uid}/user_details`, `users/recruiter/${uid}/user_details`, `users/${uid}`]
}

async function resolveUserDoc(db: AdminFirestore, uid: string) {
  for (const path of userDocPaths(uid)) {
    const ref = db.doc(path)
    if ((await ref.get()).exists) return ref
  }
  return null
}

/**
 * Mark a user's profile as verified after a successful payment.
 * Server-only: the browser must never write `verified` itself.
 */
export async function grantProfileVerification(uid: string, paymentId: string): Promise<boolean> {
  const db = initAdmin().firestore()
  const ref = await resolveUserDoc(db, uid)
  if (!ref) {
    console.error(`grantProfileVerification: no user doc for ${uid}`)
    return false
  }

  await ref.set(
    { verified: true, Verified: true, verificationPaymentId: paymentId, updatedAt: new Date() },
    { merge: true },
  )
  return true
}

export type PaymentPurpose = "profile_verification"

/**
 * Idempotently flip `payments/{orderId}` to completed and grant any entitlement.
 * Safe to call from both the browser verify route and the Razorpay webhook.
 */
export async function completePayment(opts: {
  orderId: string
  paymentId: string
  source: "checkout" | "webhook"
}): Promise<{ alreadyComplete: boolean }> {
  const db = initAdmin().firestore()
  const ref = db.collection("payments").doc(opts.orderId)

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) throw new Error("payment_not_found")

    const data = snap.data()!
    if (data.status === "completed")
      return { alreadyComplete: true, userId: data.userId, purpose: data.purpose, paymentId: data.paymentId }

    tx.update(ref, {
      status: "completed",
      paymentId: opts.paymentId,
      verifiedAt: new Date().toISOString(),
      verifiedBy: opts.source,
    })
    return {
      alreadyComplete: false,
      userId: data.userId as string,
      purpose: data.purpose as PaymentPurpose,
      paymentId: opts.paymentId,
    }
  })

  if (!result.alreadyComplete && result.purpose === "profile_verification") {
    await grantProfileVerification(result.userId, result.paymentId)
  }

  return { alreadyComplete: result.alreadyComplete }
}
