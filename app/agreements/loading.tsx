import { Skeleton } from "@/components/ui/skeleton"

export default function AgreementsLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
