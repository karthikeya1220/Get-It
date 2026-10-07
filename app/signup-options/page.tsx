"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { AuthShell } from "@/components/auth/auth-shell"
import { Reveal } from "@/components/motion/text-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const OPTIONS = [
  {
    href: "/signup",
    icon: Icons.graduationCap,
    title: "For students",
    description: "Showcase your skills and find paid work",
    points: [
      "Create a professional portfolio",
      "Find paid gigs and internships",
      "Connect with recruiters and companies",
      "Get matched to work that fits your skills",
    ],
    action: "Sign up as a student",
    primary: true,
  },
  {
    href: "/recruiter-signup",
    icon: Icons.briefcase,
    title: "For recruiters",
    description: "Find talented students for your company",
    points: [
      "Post projects and internships",
      "Find students with specific skills",
      "AI matching against your brief",
      "Agreements and payments in one place",
    ],
    action: "Sign up as a recruiter",
    primary: false,
  },
]

export default function SignupOptionsPage() {
  return (
    <AuthShell
      title="Join GetIT"
      description="Choose how you want to use GetIT. You can switch roles later from your profile."
      contentClassName="max-w-2xl"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {OPTIONS.map((option, index) => (
          <Reveal key={option.href} delay={0.06 * index} y={22} className="h-full">
            <TiltCard max={4} className="h-full">
              <Link href={option.href} className="block h-full">
                <Card className="flex h-full flex-col transition-colors">
                  <CardHeader className="pb-4">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <option.icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {option.points.map((point) => (
                      <div key={point} className="flex items-start gap-2">
                        <Icons.check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm leading-snug text-muted-foreground">{point}</p>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="mt-auto pt-4">
                    <Button variant={option.primary ? "default" : "outline"} className="w-full">
                      {option.action}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </AuthShell>
  )
}
