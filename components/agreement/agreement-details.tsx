import { BriefcaseIcon, CalendarIcon, ClockIcon, DollarSignIcon, MapPinIcon, MonitorIcon } from "lucide-react"

interface AgreementDetailsProps {
  position: string
  salary: string
  startDate: string
  duration: string
  workType: string
  location: string
}

export default function AgreementDetails({
  position,
  salary,
  startDate,
  duration,
  workType,
  location,
}: AgreementDetailsProps) {
  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Position Details</h2>
        <p className="text-muted-foreground">Key information about the offered position</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <BriefcaseIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">{position}</p>
            </div>
          </div>
        </div>

        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <DollarSignIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compensation</p>
              <p className="font-medium">{salary}</p>
            </div>
          </div>
        </div>

        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{formattedStartDate}</p>
            </div>
          </div>
        </div>

        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <ClockIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{duration}</p>
            </div>
          </div>
        </div>

        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MonitorIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Work Type</p>
              <p className="font-medium">{workType}</p>
            </div>
          </div>
        </div>

        <div className="p-4 transition-all rounded-lg bg-background/50 hover:bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPinIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
