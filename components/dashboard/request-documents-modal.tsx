"use client"

import { Sparkles } from "lucide-react"

interface RequestDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestDocumentsModal({ isOpen, onClose }: RequestDocumentsModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded-lg shadow-lg z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Request Documents</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Content - Upgrade Message */}
        <div className="p-12 flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-blue-100 p-6">
            <Sparkles className="h-10 w-10 text-blue-600" />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Upgrade to Request Documents</h3>

          <p className="text-sm text-muted-foreground mb-4 max-w-md">This feature allows you to:</p>

          <ul className="text-sm text-muted-foreground mb-6 max-w-md text-left space-y-2">
            <li>• Send document requests to all staff with missing documents</li>
            <li>
              • Deliver via <strong>Email or SMS</strong>
            </li>
            <li>• Staff receive a secure upload link</li>
            <li>• No login required for staff to respond</li>
          </ul>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Sales to Upgrade
          </button>
        </div>
      </div>
    </>
  )
}
