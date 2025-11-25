"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function PilotLoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Attempting login...")

    try {
      const response = await fetch("/api/auth/pilot-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: password }),
      })

      console.log("[v0] Login response:", { ok: response.ok, status: response.status })

      if (response.ok) {
        console.log("[v0] Login successful, setting session...")

        const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        localStorage.setItem("pilot_session", "authorized")
        localStorage.setItem("pilot_session_expiry", expiryTime.toString())

        setIsSuccess(true)

        // Wait for animation to complete before redirecting
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1800) // 1.8s for pulse + fade
      } else {
        setError("Invalid access code. Please check with your CareLumi contact.")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-white to-[#FAFAFA] p-4 relative overflow-hidden">
      <div
        className={`fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-1000 ${
          isSuccess ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23C19A82' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="space-y-4 text-center p-8">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/carelumi-thumbnail-transparent.png"
              alt="CareLumi Logo"
              width={80}
              height={80}
              priority
              className="h-20 w-20"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">CareLumi Alpha Access</CardTitle>
          <CardDescription className="text-gray-700 font-medium">
            {"You've been granted exclusive early access. Enter your invitation code to unlock the platform."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="access-code" className="text-sm font-semibold text-gray-800">
                Invitation Code
              </label>
              <div className="relative">
                <Input
                  id="access-code"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="text-center text-xl tracking-wider pr-10 border-2 h-12 font-medium focus-visible:ring-[#C19A82] focus-visible:border-[#C19A82] focus-visible:ring-2"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className={`w-full bg-[#8B5E3C] hover:bg-[#704A2E] h-11 transition-all duration-300 ${
                isSuccess
                  ? "animate-[pulse_0.8s_ease-in-out_2] shadow-[0_0_20px_rgba(218,165,32,0.6),0_0_40px_rgba(218,165,32,0.4)]"
                  : ""
              }`}
              disabled={isLoading || !password}
            >
              {isSuccess ? "✓ Access Granted" : isLoading ? "Verifying..." : "Enter Platform"}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Need a code? Email:{" "}
              <a
                href="mailto:hello@carelumi.com"
                className="text-[#8B5E3C] hover:text-[#704A2E] font-medium underline underline-offset-2"
              >
                hello@carelumi.com
              </a>
            </p>
          </form>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(218, 165, 32, 0.6), 0 0 40px rgba(218, 165, 32, 0.4);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 30px rgba(218, 165, 32, 0.8), 0 0 60px rgba(218, 165, 32, 0.6);
          }
        }
      `}</style>
    </div>
  )
}
