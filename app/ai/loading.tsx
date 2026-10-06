import { Skeleton } from "@/components/ui/skeleton"

export default function AiLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-zinc-900 dark:to-black pt-16">
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
