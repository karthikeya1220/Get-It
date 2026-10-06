import { Skeleton } from "@/components/ui/skeleton"

export default function InterviewAnalysisLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border p-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-4 w-44" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
