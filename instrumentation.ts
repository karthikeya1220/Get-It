export async function register() {
  // Every route handler declares `runtime = "nodejs"`, so only the Node SDK is
  // loaded here. The edge runtime never imports Sentry.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }
}

/**
 * Reports App Router server errors (route handlers, RSC render, data access).
 *
 * Note: Next bundles this export into the edge/middleware bundle too, which is
 * why it bails out before the dynamic import outside the Node runtime.
 */
export const onRequestError = async (error: unknown) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  const Sentry = await import("@sentry/nextjs")
  Sentry.captureException(error)
}
