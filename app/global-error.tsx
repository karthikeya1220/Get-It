"use client"

import "./globals.css"
import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center text-zinc-900 antialiased">
        <p className="text-sm font-medium text-zinc-500">Application error</p>
        <h1 className="text-2xl font-semibold tracking-tight">GetIT hit an unexpected error</h1>
        <p className="max-w-md text-sm text-zinc-500">
          This failure happened outside the page itself. Reloading usually fixes it.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Reload
          </button>
          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
          >
            Go home
          </button>
        </div>
        {error.digest ? <p className="mt-2 text-xs text-zinc-400">Reference: {error.digest}</p> : null}
      </body>
    </html>
  )
}
