"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import AgreementHeader from "./agreement-header"
import AgreementDetails from "./agreement-details"
import AgreementTerms from "./agreement-terms"
import AgreementSignature from "./agreement-signature"
import AgreementEditMode from "./agreement-edit-mode"
import { getMockAgreementData } from "./mock-data"

export default function AgreementContainer({ recruiterId, studentId }: { recruiterId: string; studentId: string }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [agreementData, setAgreementData] = useState(getMockAgreementData(recruiterId, studentId))
  const [hasAccepted, setHasAccepted] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveChanges = (updatedData: any) => {
    setAgreementData(updatedData)
    setIsEditing(false)
    toast({
      title: "Changes saved",
      description: "Your agreement has been updated successfully.",
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    toast({
      title: "Edit cancelled",
      description: "No changes were made to the agreement.",
      variant: "destructive",
    })
  }

  const handleAccept = () => {
    setHasAccepted(true)
    toast({
      title: "Agreement accepted",
      description: "You have successfully accepted the agreement terms.",
    })
    // In a real app, you would save this to the database
    setTimeout(() => {
      router.push(`/profile/students/${studentId}`)
    }, 2000)
  }

  const handleDecline = () => {
    toast({
      title: "Agreement declined",
      description: "You have declined the agreement terms.",
      variant: "destructive",
    })
    // In a real app, you would save this to the database
    setTimeout(() => {
      router.push(`/explore/recruiters/${recruiterId}`)
    }, 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <AgreementHeader
            companyName={agreementData.companyName}
            companyLogo={agreementData.companyLogo}
            studentName={agreementData.studentName}
            studentAvatar={agreementData.studentAvatar}
            agreementId={agreementData.agreementId}
            createdAt={agreementData.createdAt}
          />
        </div>

        <div className="p-8">
          {isEditing ? (
            <AgreementEditMode agreementData={agreementData} onSave={handleSaveChanges} onCancel={handleCancelEdit} />
          ) : (
            <>
              <AgreementDetails
                position={agreementData.position}
                salary={agreementData.salary}
                startDate={agreementData.startDate}
                duration={agreementData.duration}
                workType={agreementData.workType}
                location={agreementData.location}
              />

              <AgreementTerms terms={agreementData.terms} />

              <AgreementSignature
                recruiterId={recruiterId}
                studentId={studentId}
                recruiterName={agreementData.recruiterName}
                recruiterSignature={agreementData.recruiterSignature}
                recruiterSignedAt={agreementData.recruiterSignedAt}
                studentSignature={hasAccepted ? agreementData.studentName : ""}
                studentSignedAt={hasAccepted ? new Date().toISOString() : ""}
              />

              <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-between">
                {!hasAccepted && (
                  <>
                    <Button variant="outline" onClick={handleEdit} className="border-primary/20 hover:bg-primary/5">
                      Request Changes
                    </Button>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button variant="destructive" onClick={handleDecline}>
                        Decline Agreement
                      </Button>
                      <Button
                        onClick={handleAccept}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                      >
                        Accept Agreement
                      </Button>
                    </div>
                  </>
                )}
                {hasAccepted && (
                  <div className="w-full">
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() => router.push(`/profile/students/${studentId}`)}
                    >
                      Return to Profile
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
