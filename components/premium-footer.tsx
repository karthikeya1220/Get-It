"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"

export function PremiumFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-violet-100 bg-white py-20 dark:border-violet-800/30 dark:bg-black">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-violet-900 dark:text-white">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-600 p-[1px] shadow-lg">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white dark:bg-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-violet-800 dark:text-white"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>
                </div>
                <span>GetIT</span>
              </Link>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                Connecting talented students with opportunities that matter. Build your portfolio, earn money, and gain
                real-world experience.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <Icons.twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <Icons.facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <Icons.instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <Icons.linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                Platform
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                  >
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-violet-100 pt-8 text-center text-sm text-violet-700 dark:border-violet-800/30 dark:text-violet-400">
            <p>© {currentYear} GetIT. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-violet-600/5 blur-3xl dark:bg-violet-900/10"></div>
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-amber-600/5 blur-3xl dark:bg-amber-900/10"></div>
      </div>
    </footer>
  )
}
