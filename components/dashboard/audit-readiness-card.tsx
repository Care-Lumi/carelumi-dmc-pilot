"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditReadinessCardProps {
  className?: string
  locked?: boolean
}

export function AuditReadinessCard({ className, locked = false }: AuditReadinessCardProps) {
  const generalAuditScore = 77

  return (
    <TooltipProvider>
      <Link href="/audit-readiness">
        <Card
          className={cn(
            "h-[220px] rounded-[12px] border border-border bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer",
            className,
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
              <p className="font-semibold text-green-600 text-3xl">{generalAuditScore}%</p>
              <p className="text-sm font-medium text-green-600">General Audit Ready</p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Trial includes sandbox audit examples. Click to view detailed audit readiness by type.
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </TooltipProvider>
  )
}
