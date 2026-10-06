import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilesLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex items-end gap-4 -mt-10">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <div className="pb-2 space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-4/5" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <Skeleton className="h-4 w-32" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
