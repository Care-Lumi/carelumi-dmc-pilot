"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CredentialingPipelineCardProps {
  className?: string
  totalPayers?: number
  pending?: number
  active?: number
}

export function CredentialingPipelineCard({
  className,
  totalPayers = 6,
  pending = 3,
  active = 3,
}: CredentialingPipelineCardProps) {
  const router = useRouter()
  const payerLabel = totalPayers === 1 ? "Payer" : "Payers"

  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border shadow-sm", className)}>
        <CardContent className="flex h-full flex-col justify-between p-6">
          {/* Label */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">CREDENTIALING STATUS</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Payers with active credentialing or re-credentialing applications, regardless of revenue impact.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* KPI + small text */}
          <div className="mt-4 space-y-1">
            <p className="font-semibold text-foreground text-3xl">
              {totalPayers} {payerLabel}
            </p>
            <p className="text-sm font-medium text-primary">Applications in Progress</p>
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/payers")}>
              MANAGE
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
