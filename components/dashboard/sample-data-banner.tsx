"use client"

import { useState } from "react"
import { X, FlaskConical, RotateCcw } from "lucide-react"

interface SampleDataBannerProps {
  onRemove: () => void
  onRestore?: () => void
  isVisible: boolean
}

export function SampleDataBanner({ onRemove, onRestore, isVisible }: SampleDataBannerProps) {
  const [isRemoved, setIsRemoved] = useState(false)

  if (!isVisible && !isRemoved) return null

  const handleRemove = () => {
    setIsRemoved(true)
    onRemove()
  }

  const handleRestore = () => {
    setIsRemoved(false)
    onRestore?.()
  }

  if (isRemoved) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Sample data removed
              </p>
              <p className="text-xs text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          </div>
          <button
            onClick={handleRestore}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <RotateCcw className="h-3 w-3" />
            Restore Sample Data
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-accent px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              🧪 Sample Data Active
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              You're viewing 3 demo documents to explore the platform. Upload your own compliance documents to replace this sample data and start tracking your real credentials.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-background px-2 py-1 font-mono">
                • TX Medical License (Dr. Cavanagh)
              </span>
              <span className="rounded-md bg-background px-2 py-1 font-mono">
                • DEA Certificate
              </span>
              <span className="rounded-md bg-background px-2 py-1 font-mono">
                • Facility License (Expires 39 days)
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="group flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-3 w-3" />
          Remove Sample Data
        </button>
      </div>
    </div>
  )
}
