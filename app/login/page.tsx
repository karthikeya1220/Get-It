"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { AuthShell } from "@/components/auth/auth-shell"
import { auth } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { createSessionCookie } from "@/lib/auth-session"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      if (result.user) {
        await createSessionCookie()
        toast.success("Successfully logged in!")
        // Honor ?next= set by middleware, but never leave the site root
        const next = new URLSearchParams(window.location.search).get("next")
        router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/profile")
        router.refresh()
      }
    } catch (error: any) {
      let message = "Failed to login"
      if (error.code === "auth/user-not-found") {
        message = "User not found"
      } else if (error.code === "auth/wrong-password") {
        message = "Invalid password"
      }
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Enter your credentials to access your account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/signup-options" className="font-medium text-primary hover:underline">
            Sign up
          </a>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoCapitalize="none"
            autoComplete="current-password"
            disabled={isLoading}
            required
            className="h-12"
          />
        </div>

        <Button type="submit" disabled={isLoading} size="xl" className="w-full">
          {isLoading ? <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> : null}
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  )
}
