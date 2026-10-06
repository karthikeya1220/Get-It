import type { Metadata } from "next"
import { PremiumNavbar } from "@/components/premium-navbar"
import AgreementsList from "@/components/agreement/agreements-list"

export const metadata: Metadata = {
  title: "GetIT | My Agreements",
  description: "Review and manage your offer agreements",
}

export default function AgreementsPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PremiumNavbar />
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold">My Agreements</h1>
        <p className="mt-1 text-muted-foreground">Every offer drafted between you and a candidate.</p>
        <div className="mt-6">
          <AgreementsList />
        </div>
      </div>
    </div>
  )
}
