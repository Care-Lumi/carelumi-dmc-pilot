import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { UpgradeOverlayProvider } from "@/lib/contexts/upgrade-overlay-context"
import { OrgProvider } from "@/lib/contexts/org-context"
import { ElevenLabsProvider } from "@/components/providers/elevenlabs-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { AuthGate } from "@/components/auth-gate"
import { Analytics } from "@vercel/analytics/next"

import {
  Inter as V0_Font_Inter,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google"

// Initialize fonts
const _inter = V0_Font_Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "CareLumi - Compliance Intelligence Platform",
  description: "AI-powered compliance intelligence for outpatient healthcare providers",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isPreview = process.env.NEXT_PUBLIC_ENV === "preview"

  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ElevenLabsProvider />
          <AuthGate>
            <OrgProvider>
              {isPreview && (
                <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
                  Preview Environment - Multi-Tenant Feature Branch
                </div>
              )}
              <UpgradeOverlayProvider>{children}</UpgradeOverlayProvider>
            </OrgProvider>
          </AuthGate>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
