import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  primaryStat: string
  secondaryStat: string
  ctaText: string
  ctaHref: string
  className?: string
  trend?: string
}

export function StatCard({ title, primaryStat, secondaryStat, ctaText, ctaHref, className, trend }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
          {trend && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-foreground tracking-tight">{primaryStat}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{secondaryStat}</p>
      </CardContent>
    </Card>
  )
}
