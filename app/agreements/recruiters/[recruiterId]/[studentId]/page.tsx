import type { Metadata } from "next"
import { PremiumNavbar } from "@/components/premium-navbar"
import AgreementContainer from "@/components/agreement/agreement-container"

export const metadata: Metadata = {
  title: "GetIT | Agreement",
  description: "Review and sign your agreement with the recruiter",
}

export default async function AgreementPage({
  params,
}: {
  params: Promise<{ recruiterId: string; studentId: string }>
}) {
  const { recruiterId, studentId } = await params

  return (
    <div className="min-h-screen bg-background pt-16">
      <PremiumNavbar />
      <div className="container max-w-6xl py-8 mx-auto">
        <AgreementContainer recruiterId={recruiterId} studentId={studentId} />
      </div>
    </div>
  )
}
