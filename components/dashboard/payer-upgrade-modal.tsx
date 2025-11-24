"use client"

import { X } from "lucide-react"

interface PayerUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PayerUpgradeModal({ isOpen, onClose }: PayerUpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-card p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Upgrade to Access Full Payer Details</h2>
            <p className="mt-2 text-sm text-muted-foreground">This feature is available with a paid plan.</p>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-4">With an upgrade, you can:</h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Track provider credentialing status across all payers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>View application stages and submission timelines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Manage missing documents and re-credentialing workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Add new providers to existing payer contracts</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                window.location.href = "mailto:sales@carelumi.com?subject=Upgrade%20Request"
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
