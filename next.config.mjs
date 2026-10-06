// `@sentry/nextjs` ships CJS only, so Node's ESM loader can't see named exports
// on the package root — the webpack wrapper lives on the `/config` subpath.
import sentryConfig from "@sentry/nextjs/config"

const { withSentryConfig } = sentryConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

// Source-map upload only runs when SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT
// are present; without them the build is unchanged.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  disableLogger: true,
})
