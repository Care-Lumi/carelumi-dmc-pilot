import { MoreVertical } from 'lucide-react'

interface AlertRowProps {
  status: "error" | "warning"
  title: string
  subtitle: string
  actionLabel?: string
  onAction: () => void
}

export function AlertRow({ status, title, subtitle, actionLabel = "Review & Renew", onAction }: AlertRowProps) {
  const badgeClass = status === "error" 
    ? "bg-red-500 text-white" 
    : "bg-yellow-500 text-black"
  
  const badgeLabel = status === "error" ? "Critical" : "Warning"

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white">
      <span className={`${badgeClass} text-[11px] font-semibold px-2 py-1 rounded shrink-0`}>
        {badgeLabel}
      </span>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{title}</p>
        <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      
      <button 
        onClick={onAction}
        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded text-sm font-medium shrink-0"
      >
        {actionLabel}
      </button>
      
      <button className="text-muted-foreground hover:text-foreground p-2 shrink-0">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  )
}
