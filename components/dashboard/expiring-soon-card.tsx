"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpiringSoonCardProps {
  className?: string
}

export function ExpiringSoonCard({ className }: ExpiringSoonCardProps) {
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
            <p className="font-semibold text-foreground text-3xl">5 Docs</p>
            <p className="text-sm font-medium text-primary">Out of Compliance</p>
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" asChild>
              <a href="/documents">TAKE ACTION</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
