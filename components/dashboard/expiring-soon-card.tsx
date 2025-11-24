"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpiringSoonCardProps {
  className?: string
  total?: number
  loading?: boolean
}

export function ExpiringSoonCard({ className, total = 0, loading = false }: ExpiringSoonCardProps) {
  const router = useRouter()

  return (
    <TooltipProvider>
      <Card className={cn("h-[220px] rounded-[12px] border border-border shadow-sm", className)}>
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">EXPIRING SOON</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Documents and credentials expiring within the next 60 days requiring renewal action.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-4 space-y-1">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : total === 0 ? (
              <>
                <p className="font-semibold text-foreground text-3xl">0 Docs</p>
                <p className="text-sm font-medium text-muted-foreground">
                  We'll show upcoming expirations after you upload documents
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground text-3xl">{total} Docs</p>
                <p className="text-sm font-medium text-muted-foreground">Counts based on your uploaded documents.</p>
              </>
            )}
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/documents")}>
              VIEW DOCUMENTS
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
