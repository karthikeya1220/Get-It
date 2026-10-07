"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "@/firebase"
import { signOut, onAuthStateChanged, User } from "firebase/auth"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { cn } from "@/lib/utils"

interface PremiumNavbarProps {
  recruiterId?: string
  userId?: string
}

// `/explore` is a role-blind redirect; recipients of the session get the right
// explorer only if we already know their claim. Unknown role keeps the redirect.
const EXPLORER_FOR_ROLE: Record<string, string> = {
  recruiter: "/explore/recruiters",
  student: "/explore/students",
}

const LANDING_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
]

export function PremiumNavbar({ recruiterId, userId }: PremiumNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (!user) return setRole(null)
      const claims = await user.getIdTokenResult().catch(() => null)
      setRole((claims?.claims as { role?: string } | null)?.role ?? null)
    })
    return unsubscribe
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  const exploreHref = (role && EXPLORER_FOR_ROLE[role]) || "/explore"

  const navLinks = user
    ? [
        { href: "/feed", label: "Feed" },
        { href: exploreHref, label: "Explore" },
        { href: "/agreements", label: "Agreements" },
        { href: "/ai", label: "AI Assistant" },
      ]
    : LANDING_LINKS

  const navLinkClass = (href: string) => {
    const active = href.startsWith("/") && pathname === href
    return cn(
      "relative text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:rounded-sm",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    )
  }

  const AccountMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 rounded-md gap-2 px-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "Profile"} />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[9rem] truncate text-sm md:inline">{user?.displayName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex cursor-pointer items-center">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={exploreHref} className="flex cursor-pointer items-center">
            <Icons.layout className="mr-2 h-4 w-4" />
            <span>Explore</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex cursor-pointer items-center">
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/agreements" className="flex cursor-pointer items-center">
            <Icons.fileText className="mr-2 h-4 w-4" />
            <span>Agreements</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/ai" className="flex cursor-pointer items-center">
            <Icons.sparkles className="mr-2 h-4 w-4" />
            <span>AI Assistant</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center text-destructive">
          <Icons.logOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <ScrollProgress />
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">GetIT</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle className="h-9 w-9 rounded-md" />
          {user ? (
            <AccountMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup-options">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="h-9 w-9 rounded-md" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="h-9 w-9"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <Icons.close className="h-5 w-5" /> : <Icons.menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(navLinkClass(link.href), "block rounded-md px-2 py-2.5")}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {user ? (
                <Button variant="outline" onClick={handleLogout}>
                  Log out
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup-options" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
