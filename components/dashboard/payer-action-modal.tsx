"use client"

import { X } from "lucide-react"

interface PayerActionModalProps {
  isOpen: boolean
  onClose: () => void
  payerName: string
  payerStatus: string
}

export function PayerActionModal({ isOpen, onClose, payerName, payerStatus }: PayerActionModalProps) {
  if (!isOpen) return null

  const getActionSteps = () => {
    if (payerStatus === "missing-documents") {
      return [
        {
          step: 1,
          title: "Upload Missing Documents",
          description: "Upload the required liability insurance certificate",
          action: "Upload Document",
        },
        {
          step: 2,
          title: "Review Application",
          description: "Verify all information is current and accurate",
          action: "Review Application",
        },
        {
          step: 3,
          title: "Resubmit to Payer",
          description: "Once documents are complete, resubmit application",
          action: "Resubmit",
        },
      ]
    } else if (payerStatus === "in-progress") {
      return [
        {
          step: 1,
          title: "Monitor Application Status",
          description: "Application is under review by payer",
          action: "Check Status",
        },
        {
          step: 2,
          title: "Respond to Requests",
          description: "Be ready to provide additional information if requested",
          action: "View Requests",
        },
      ]
    } else if (payerStatus === "ready-to-submit") {
      return [
        {
          step: 1,
          title: "Final Review",
          description: "Review application one last time before submission",
          action: "Review Application",
        },
        {
          step: 2,
          title: "Submit Application",
          description: "Submit credentialing application to payer portal",
          action: "Submit Now",
        },
      ]
    } else {
      return [
        {
          step: 1,
          title: "Monitor Re-Credentialing",
          description: "Track upcoming re-credentialing dates",
          action: "View Schedule",
        },
      ]
    }
  }

  const steps = getActionSteps()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-2 text-2xl font-semibold text-foreground">{payerName}</h2>
        <p className="mb-6 text-sm text-muted-foreground">Action steps to complete credentialing</p>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.step}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  {step.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
