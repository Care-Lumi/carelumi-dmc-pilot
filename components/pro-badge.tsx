import { cn } from "@/lib/utils"

interface ProBadgeProps {
  tier: "pro" | "free"
  className?: string
}

export function ProBadge({ tier, className }: ProBadgeProps) {
  if (tier === "pro") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
          "bg-gradient-to-r from-yellow-400 to-yellow-600",
          "text-white shadow-sm",
          className,
        )}
      >
        Pro
      </span>
    )
  }

  // Free tier - Platinum badge
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        "bg-gradient-to-r from-slate-300 to-slate-400",
        "text-slate-900 shadow-sm",
        className,
      )}
    >
      Free Trial
    </span>
  )
}
