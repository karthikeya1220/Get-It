"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import * as Sentry from "@sentry/nextjs"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
      <h1 className="text-2xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The error has been logged. If it keeps happening, try again in a moment or head back to the home page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/")}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Go home
        </button>
      </div>
      {error.digest ? <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
    </div>
  )
}
