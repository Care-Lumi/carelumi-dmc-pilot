"use client"

import { useState } from "react"
import { X, CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react"
import { getRegulatoryProfile } from "@/lib/regulatory-profiles"

type License = {
  id: string
  owner_name: string
  document_type: string
  expiration_date: string
  days_until_expiration: number | null
  license_number: string | null
  jurisdiction: string | null
  urgency_level: string
}

export function RenewalStepsModal({
  isOpen,
  onClose,
  license,
}: {
  isOpen: boolean
  onClose: () => void
  license: License
}) {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({})

  if (!isOpen) return null

  const profile = getRegulatoryProfile(license.jurisdiction, license.document_type)

  // Compute status
  const isExpired = license.days_until_expiration !== null && license.days_until_expiration < 0
  const daysUntil = license.days_until_expiration || 0

  // Compute start-by date (60 days before expiration as a general rule)
  const expirationDate = new Date(license.expiration_date)
  const startByDate = new Date(expirationDate.getTime() - 60 * 24 * 60 * 60 * 1000)

  const genericSteps = [
    "Confirm renewal window, fees, and deadlines in your state licensing portal",
    "Verify required continuing education (CE) hours for this license type",
    "Gather CE certificates and supporting documents in one organized folder",
    "Log in to your licensing portal, complete renewal application, and submit payment",
    "Upload renewed license confirmation to CareLumi to update status to Active",
  ]

  const steps = profile ? profile.requirements : genericSteps

  const toggleCheck = (index: number) => {
    setChecklist((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Renewal Steps</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {license.owner_name} - {license.document_type}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
            <div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-4">
              {isExpired ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-foreground">Expired</p>
                    <p className="text-sm text-muted-foreground">This license expired {Math.abs(daysUntil)} days ago</p>
                  </div>
                </>
              ) : daysUntil <= 30 ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-foreground">Expiring Soon</p>
                    <p className="text-sm text-muted-foreground">Expires in {daysUntil} days</p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-foreground">Active</p>
                    <p className="text-sm text-muted-foreground">Expires in {daysUntil} days</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Timeline</h3>
            <div className="space-y-2 rounded-md border border-border bg-muted/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start renewal by:</span>
                <span className="font-medium text-foreground">{startByDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expiration date:</span>
                <span className="font-medium text-foreground">{expirationDate.toLocaleDateString()}</span>
              </div>
              {profile && profile.ceRequiredHours && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CE hours required:</span>
                  <span className="font-medium text-foreground">{profile.ceRequiredHours} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Requirements Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Renewal Requirements</h3>

            {/* Upgrade Note at Top */}
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Upgrade to unlock automated renewal tracking</p>
                  <p className="text-xs text-blue-700">
                    On paid plans, Clip will complete these steps for you automatically and give you a status update—no
                    need to manage renewals manually.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-md border border-border bg-white p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleCheck(index)}
                >
                  <div className="mt-0.5">
                    {checklist[index] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border" />
                    )}
                  </div>
                  <p
                    className={`text-sm flex-1 ${checklist[index] ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Note: Checklist progress isn't saved in the trial version.</p>
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
