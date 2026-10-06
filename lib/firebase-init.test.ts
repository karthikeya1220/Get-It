import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * `getAuth()` with no argument resolves the *default* app, which only exists
 * once `@/firebase` has been evaluated. A module that reaches `getAuth()`
 * without (directly or transitively) importing that file throws
 * "No Firebase App '[DEFAULT]' has been created" at runtime — a build-passing,
 * test-passing failure, so it is worth a guard.
 */
const IMPORT_RE = /from\s+["'](@\/firebase|@\/lib\/firebase-service)["']/

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) sourceFiles(full, out)
    else if (/\.tsx?$/.test(entry)) out.push(full)
  }
  return out
}

describe("firebase initialisation", () => {
  it("every getAuth() call site imports the module that creates the default app", () => {
    const offenders = sourceFiles(process.cwd())
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => /getAuth\(\s*\)/.test(readFileSync(file, "utf8")))
      .filter((file) => !IMPORT_RE.test(readFileSync(file, "utf8")))
      .map((file) => file.replace(process.cwd() + "/", ""))

    expect(offenders).toEqual([])
  })
})
