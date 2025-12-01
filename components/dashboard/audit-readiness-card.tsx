"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrg } from "@/lib/contexts/org-context"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { calculateAuditScore } from "@/lib/audit-requirements"

interface AuditReadinessCardProps {
  className?: string
  locked?: boolean
}

export function AuditReadinessCard({ className, locked = false }: AuditReadinessCardProps) {
  const { org } = useOrg()
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const calculateScore = async () => {
      if (!org) return

      if (org.useRealData?.auditReadiness) {
        try {
          const response = await fetch("/api/documents")
          if (response.ok) {
            const data = await response.json()
            const documents = data.documents || []

            if (documents.length === 0) {
              setScore(0)
              setIsLoading(false)
              return
            }

            const sandboxData = getSandboxDataForOrg(org.type)

            // Extract entities
            const uniqueStaff = documents
              .filter((doc: any) => doc.owner_type === "staff")
              .reduce((acc: any[], doc: any) => {
                const staffKey = `${doc.owner_name}_${doc.jurisdiction || "default"}`
                if (!acc.find((s) => s.id === staffKey)) {
                  acc.push({
                    id: staffKey,
                    name: doc.owner_name,
                    jurisdiction: doc.jurisdiction,
                  })
                }
                return acc
              }, [])

            const entities = {
              staff: uniqueStaff,
              facilities: sandboxData.SANDBOX_FACILITIES || [],
              payers: sandboxData.SANDBOX_PAYERS || [],
            }

            const documentsWithKeys = documents.map((doc: any) => ({
              ...doc,
              owner_id:
                doc.owner_type === "staff" ? `${doc.owner_name}_${doc.jurisdiction || "default"}` : doc.owner_id,
            }))

            const result = calculateAuditScore("general", documentsWithKeys, entities, org.type)
            setScore(result.score)
          }
        } catch (error) {
          console.error("[v0] Failed to calculate audit score:", error)
        }
      }
      setIsLoading(false)
    }

    calculateScore()
  }, [org])

  if (isLoading) {
    return (
      <Card className={cn("h-[220px] rounded-[12px] border border-border bg-white shadow-sm", className)}>
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Link href="/audit-readiness">
        <Card
          className={cn(
            "h-[220px] rounded-[12px] border border-border bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer",
            className,
            locked && "opacity-75",
          )}
        >
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">AUDIT READINESS</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your audit readiness score is based on required documents and policies. 100% = fully ready.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-4 space-y-1">
              <p className={cn("font-semibold text-3xl", score === 0 ? "text-red-600" : "text-green-600")}>{score}%</p>
              <p className={cn("text-sm font-medium", score === 0 ? "text-red-600" : "text-green-600")}>
                {score === 0 ? "No Documents Uploaded" : "General Audit Ready"}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                {org?.useRealData?.auditReadiness
                  ? "Click to view detailed audit readiness by type."
                  : "Trial includes sandbox audit examples. Upgrade to Pro for real tracking."}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </TooltipProvider>
  )
}
