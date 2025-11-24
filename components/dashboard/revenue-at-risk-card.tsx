"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface RevenueAtRiskCardProps {
  locked?: boolean
  className?: string
}

export function RevenueAtRiskCard({ locked = false, className }: RevenueAtRiskCardProps) {
  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border shadow-sm", className)}>
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">REVENUE AT RISK</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated monthly revenue currently blocked due to credentialing or documentation issues.</p>
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
                <p className="font-semibold text-3xl text-foreground">$0</p>
                <p className="text-sm font-medium text-primary">No providers unable to bill</p>
              </>
            )}
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Trial includes a sandbox billing example. Revenue tracking unlocks on paid plans.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
