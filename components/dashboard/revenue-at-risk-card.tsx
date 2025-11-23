"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RevenueAtRiskCardProps {
  amount: number
  providerCount: number
  trend?: number
  status: "high" | "medium" | "low"
  className?: string
}

export function RevenueAtRiskCard({ amount, providerCount, status, className }: RevenueAtRiskCardProps) {
  const router = useRouter()

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
            <p className="font-semibold text-3xl text-foreground text-black">${amount.toLocaleString()}</p>
            <p className="text-sm font-medium text-primary">
              {providerCount} {providerCount === 1 ? "Provider" : "Providers"} Unable to Bill
            </p>
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/revenue-risk")}>
              VIEW DETAILS
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
