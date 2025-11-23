"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditReadinessCardProps {
  className?: string
  percentage?: number
  itemsNeedingAttention?: number
}

export function AuditReadinessCard({ className, percentage = 87, itemsNeedingAttention = 3 }: AuditReadinessCardProps) {
  const router = useRouter()

  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border bg-white shadow-sm", className)}>
        <CardContent className="flex h-full flex-col justify-between p-6">
          {/* Label */}
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

          {/* KPI + small text */}
          <div className="mt-4 space-y-1">
            <p className="font-semibold text-green-600 text-3xl">{percentage}%</p>
            <p className="text-sm font-medium text-green-600">{itemsNeedingAttention} Items to Review Before Audit</p>
          </div>

          {/* Button */}
          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/audit-readiness")}>
              VIEW CHECKLIST
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
