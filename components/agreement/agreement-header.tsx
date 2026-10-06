import { CalendarIcon } from "lucide-react"
import Image from "next/image"

interface AgreementHeaderProps {
  companyName: string
  companyLogo: string
  studentName: string
  studentAvatar: string
  agreementId: string
  createdAt: string
}

export default function AgreementHeader({
  companyName,
  companyLogo,
  studentName,
  studentAvatar,
  agreementId,
  createdAt,
}: AgreementHeaderProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 overflow-hidden rounded-full bg-background">
            <Image src={companyLogo || "/placeholder.svg"} alt={companyName} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{companyName}</h1>
            <p className="text-muted-foreground">Employment Agreement</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-right font-medium">{studentName}</p>
            <p className="text-right text-muted-foreground">Candidate</p>
          </div>
          <div className="relative w-12 h-12 overflow-hidden rounded-full bg-background">
            <Image src={studentAvatar || "/placeholder.svg"} alt={studentName} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 pt-4 border-t border-border sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Agreement ID:</span>
          <span className="font-mono">{agreementId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          <span>Created on {formattedDate}</span>
        </div>
      </div>
    </div>
  )
}
