import type React from "react"
import type { Metadata } from "next"
import { Archivo, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthSessionSync } from "@/components/auth-session-sync"
import { QueryProvider } from "@/components/query-provider"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

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
      <body className={`${archivo.variable} ${plexMono.variable} ${archivo.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="GetIT-theme"
        >
          <QueryProvider>{children}</QueryProvider>
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
