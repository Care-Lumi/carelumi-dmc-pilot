"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CredentialingPipelineCardProps {
  className?: string
  totalPayers?: number
  loading?: boolean
}

export function CredentialingPipelineCard({
  className,
  totalPayers = 0,
  loading = false,
}: CredentialingPipelineCardProps) {
  const router = useRouter()
  const payerLabel = totalPayers === 1 ? "Payer" : "Payers"

  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border shadow-sm", className)}>
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">CREDENTIALING STATUS</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of unique payers detected from your uploaded payer documents.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-4 space-y-1">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : totalPayers === 0 ? (
              <>
                <p className="font-semibold text-foreground text-3xl">0 Payers</p>
                <p className="text-sm font-medium text-muted-foreground">Upload payer documents to track</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground text-3xl">
                  {totalPayers} {payerLabel}
                </p>
                <p className="text-sm font-medium text-muted-foreground">Counts based on your uploaded documents.</p>
              </>
            )}
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/payers")}>
              VIEW PAYERS
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
