"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import AgreementHeader from "./agreement-header"
import AgreementDetails from "./agreement-details"
import AgreementTerms from "./agreement-terms"
import AgreementSignature from "./agreement-signature"
import AgreementEditMode from "./agreement-edit-mode"
import { getViewerIdentity } from "@/lib/feed-service"
import {
  createAgreementDraft,
  editableAgreementFields,
  getAgreement,
  saveAgreement,
  signAgreement,
  type Agreement,
} from "@/lib/agreement-service"

export default function AgreementContainer({ recruiterId, studentId }: { recruiterId: string; studentId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const cacheKey = ["agreement", recruiterId, studentId] as const

  const { data: viewer, isPending: viewerPending } = useQuery({
    queryKey: ["viewer-identity"],
    queryFn: getViewerIdentity,
    retry: false,
  })

  const viewerUid = viewer?.id ?? ""
  const viewerRole: "student" | "recruiter" | "guest" =
    viewerUid === studentId ? "student" : viewerUid === recruiterId ? "recruiter" : "guest"

  const { data: agreement, isPending } = useQuery({
    queryKey: cacheKey,
    queryFn: () => getAgreement(recruiterId, studentId),
    enabled: !!viewerUid,
  })

  const cacheAgreement = (next: Agreement) => queryClient.setQueryData(cacheKey, next)

  const createMutation = useMutation({
    mutationFn: () => createAgreementDraft(recruiterId, studentId),
    onSuccess: (draft) => {
      cacheAgreement(draft)
      toast({ title: "Draft created", description: "The agreement is ready for review." })
    },
    onError: (error: Error) =>
      toast({ title: "Could not create agreement", description: error.message, variant: "destructive" }),
  })

  const saveMutation = useMutation({
    mutationFn: (updatedData: Agreement) => saveAgreement(agreement!.id, updatedData),
    onSuccess: (_data, updatedData) => {
      if (agreement) {
        cacheAgreement({
          ...agreement,
          ...editableAgreementFields(updatedData),
          updatedAt: new Date().toISOString(),
        })
      }
      setIsEditing(false)
      toast({ title: "Changes saved", description: "Your agreement has been updated successfully." })
    },
    onError: (error: Error) =>
      toast({ title: "Could not save changes", description: error.message, variant: "destructive" }),
  })

  const signMutation = useMutation({
    mutationFn: (accept: boolean) => signAgreement(agreement!.id, accept),
    onSuccess: (signed, accept) => {
      cacheAgreement(signed)
      toast(
        accept
          ? { title: "Agreement accepted", description: "You have successfully accepted the agreement terms." }
          : {
              title: "Agreement declined",
              description: "You have declined the agreement terms.",
              variant: "destructive",
            },
      )
      if (accept) setTimeout(() => router.push(`/profile/students/${studentId}`), 2000)
      else setTimeout(() => router.push(`/explore/recruiters/${recruiterId}`), 2000)
    },
    onError: (error: Error) =>
      toast({ title: "Could not complete", description: error.message, variant: "destructive" }),
  })

  if (viewerPending || (viewerUid && isPending)) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (viewerRole === "guest") {
    return (
      <Card className="p-8 text-center border-none shadow-lg">
        <h1 className="text-xl font-semibold">{viewerUid ? "Agreement unavailable" : "Sign in required"}</h1>
        <p className="mt-2 text-muted-foreground">
          {viewerUid
            ? "This agreement is only visible to the recruiter and the candidate it was created for."
            : "You need to be signed in to review this agreement."}
        </p>
        <Button className="mt-6" variant="outline" onClick={() => router.push("/explore/students")}>
          Back to Explore
        </Button>
      </Card>
    )
  }

  if (!agreement) {
    return (
      <Card className="p-8 text-center border-none shadow-lg">
        <h1 className="text-xl font-semibold">No agreement yet</h1>
        <p className="mt-2 text-muted-foreground">
          Nothing has been drafted between these two parties. Create a draft to start the offer.
        </p>
        <Button className="mt-6" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Create draft agreement"}
        </Button>
      </Card>
    )
  }

  const isFinal = agreement.status !== "pending"
  const canEditTerms = !isFinal && !isEditing
  const canSign = viewerRole === "student" && !isFinal

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <AgreementHeader
            companyName={agreement.companyName}
            companyLogo={agreement.companyLogo}
            studentName={agreement.studentName}
            studentAvatar={agreement.studentAvatar}
            agreementId={agreement.id}
            createdAt={agreement.createdAt}
          />
        </div>

        <div className="p-8">
          {isEditing ? (
            <AgreementEditMode
              agreementData={agreement}
              onSave={(updatedData) => saveMutation.mutate(updatedData)}
              onCancel={() => {
                setIsEditing(false)
                toast({
                  title: "Edit cancelled",
                  description: "No changes were made to the agreement.",
                  variant: "destructive",
                })
              }}
            />
          ) : (
            <>
              <AgreementDetails
                position={agreement.position}
                salary={agreement.salary}
                startDate={agreement.startDate}
                duration={agreement.duration}
                workType={agreement.workType}
                location={agreement.location}
              />

              <AgreementTerms terms={agreement.terms} />

              <AgreementSignature
                recruiterId={recruiterId}
                studentId={studentId}
                recruiterName={agreement.recruiterName}
                recruiterSignature={agreement.recruiterSignature}
                recruiterSignedAt={agreement.recruiterSignedAt}
                studentSignature={agreement.studentSignature}
                studentSignedAt={agreement.studentSignedAt}
              />

              <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-between">
                {!isFinal && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      disabled={!canEditTerms || saveMutation.isPending}
                      className="border-primary/20 hover:bg-primary/5"
                    >
                      {viewerRole === "student" ? "Request Changes" : "Edit Agreement"}
                    </Button>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {canSign ? (
                        <>
                          <Button
                            variant="destructive"
                            onClick={() => signMutation.mutate(false)}
                            disabled={signMutation.isPending}
                          >
                            Decline Agreement
                          </Button>
                          <Button
                            onClick={() => signMutation.mutate(true)}
                            disabled={signMutation.isPending}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                          >
                            Accept Agreement
                          </Button>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground sm:self-center">
                          Awaiting {agreement.studentName}'s signature
                        </p>
                      )}
                    </div>
                  </>
                )}
                {agreement.status === "accepted" && (
                  <div className="w-full">
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-700 text-white"
                      onClick={() => router.push(`/profile/students/${studentId}`)}
                    >
                      Return to Profile
                    </Button>
                  </div>
                )}
                {agreement.status === "declined" && (
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/explore/recruiters/${recruiterId}`)}
                    >
                      Return to Recruiter
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
