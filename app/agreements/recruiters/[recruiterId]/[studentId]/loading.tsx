import { Skeleton } from "@/components/ui/skeleton"

export default function AgreementLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container max-w-6xl py-8 mx-auto">
        <div className="space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}
