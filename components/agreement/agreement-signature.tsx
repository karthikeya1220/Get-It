import { CalendarIcon } from "lucide-react"

interface AgreementSignatureProps {
  recruiterId: string
  studentId: string
  recruiterName: string
  recruiterSignature: string
  recruiterSignedAt: string
  studentSignature: string
  studentSignedAt: string
}

export default function AgreementSignature({
  recruiterId,
  studentId,
  recruiterName,
  recruiterSignature,
  recruiterSignedAt,
  studentSignature,
  studentSignedAt,
}: AgreementSignatureProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mt-10 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Signatures</h2>
        <p className="text-muted-foreground">Digital signatures confirming agreement</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Recruiter Signature */}
        <div className="p-6 border rounded-lg border-border">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">On behalf of the company</p>
              <p className="text-lg font-medium">{recruiterName}</p>
            </div>

            <div className="h-20 p-3 border rounded-md border-border bg-background/50">
              <div className="italic font-medium text-primary">{recruiterSignature}</div>
            </div>

            {recruiterSignedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Signed on {formatDate(recruiterSignedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Student Signature */}
        <div className="p-6 border rounded-lg border-border">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Candidate</p>
              <p className="text-lg font-medium">Your Signature</p>
            </div>

            <div className="h-20 p-3 border rounded-md border-border bg-background/50">
              {studentSignature ? (
                <div className="italic font-medium text-primary">{studentSignature}</div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Your signature will appear here when you accept the agreement
                </p>
              )}
            </div>

            {studentSignedAt ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Signed on {formatDate(studentSignedAt)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Awaiting your signature</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
