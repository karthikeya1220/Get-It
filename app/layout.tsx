import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthSessionSync } from "@/components/auth-session-sync"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GetIT - Connect Students with Opportunities",
  description: "A premium marketplace for college students to showcase skills and find paid gigs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="GetIT-theme"
        >
          {children}
        </ThemeProvider>
        <AuthSessionSync />
        <Toaster position="top-center" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storageKey = "GetIT-theme";
                  const theme = localStorage.getItem(storageKey) || "system";
                  
                  if (theme === "system") {
                    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                    document.documentElement.classList.toggle("dark", systemTheme === "dark");
                  } else {
                    document.documentElement.classList.toggle("dark", theme === "dark");
                  }
                } catch (e) {
                  console.error("Error applying theme:", e);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
