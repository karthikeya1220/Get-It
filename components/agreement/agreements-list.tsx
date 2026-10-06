"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, FileText } from "lucide-react"
import { getViewerIdentity } from "@/lib/feed-service"
import { listMyAgreements, type AgreementStatus } from "@/lib/agreement-service"

const STATUS_LABEL: Record<AgreementStatus, { label: string; variant: "secondary" | "success" | "destructive" }> = {
  pending: { label: "Awaiting signature", variant: "secondary" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "destructive" },
}

export default function AgreementsList() {
  const { data: viewer, isPending: viewerPending } = useQuery({
    queryKey: ["viewer-identity"],
    queryFn: getViewerIdentity,
    retry: false,
  })

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["my-agreements", viewer?.id],
    queryFn: () => listMyAgreements(viewer!.id),
    enabled: !!viewer?.id,
  })

  if (viewerPending || isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">We could not load your agreements.</p>
        <button onClick={() => refetch()} className="mt-4 text-sm font-medium text-primary underline">
          Try again
        </button>
      </Card>
    )
  }

  if (!data?.length) {
    return (
      <Card className="p-10 text-center">
        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <h2 className="text-lg font-semibold">No agreements yet</h2>
        <p className="mt-1 text-muted-foreground">
          Agreements appear here once a recruiter drafts an offer for you, or you draft one as a recruiter.
        </p>
        <Link href="/explore/students" className="mt-5 inline-block text-sm font-medium text-primary underline">
          Browse students
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((agreement) => {
        const status = STATUS_LABEL[agreement.status]
        const isStudent = agreement.studentId === viewer?.id
        return (
          <Link key={agreement.id} href={`/agreements/recruiters/${agreement.recruiterId}/${agreement.studentId}`}>
            <Card className="p-5 transition-colors border-border hover:border-primary/40 hover:bg-muted/40">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{agreement.companyName}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {agreement.position} · {isStudent ? "Offer for you" : `Candidate: ${agreement.studentName}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last updated {new Date(agreement.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="flex-none w-4 h-4 mt-1 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
