"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditReadinessCardProps {
  className?: string
  locked?: boolean
}

export function AuditReadinessCard({ className, locked = false }: AuditReadinessCardProps) {
  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border bg-white shadow-sm", className)}>
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
            {locked ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-3xl text-muted-foreground">—</p>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Available on paid plans</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-green-600 text-3xl">0%</p>
                <p className="text-sm font-medium text-green-600">Upload documents to calculate</p>
              </>
            )}
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Trial includes a sandbox audit example. Full audit readiness scoring is available on paid plans.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
