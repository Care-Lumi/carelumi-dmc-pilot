"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { RenewalStepsModal } from "./renewal-steps-modal"

type CriticalAlert = {
  id: string
  type: "license_expiring" | "license_expired"
  owner_name: string
  document_type: string
  expiration_date: string
  days_until_expiration: number | null
  license_number: string | null
  jurisdiction: string | null
  urgency_level: "critical" | "high"
}

interface CriticalAlertsProps {
  alerts: CriticalAlert[]
}

export function CriticalAlerts({ alerts }: CriticalAlertsProps) {
  const [selectedLicense, setSelectedLicense] = useState<any>(null)
  const [showRenewalModal, setShowRenewalModal] = useState(false)

  const hasAlerts = alerts && alerts.length > 0

  const handleViewRenewal = (alert: CriticalAlert) => {
    setSelectedLicense({
      id: alert.id,
      owner_name: alert.owner_name,
      document_type: alert.document_type,
      expiration_date: alert.expiration_date,
      days_until_expiration: alert.days_until_expiration,
      license_number: alert.license_number,
      jurisdiction: alert.jurisdiction,
      urgency_level: alert.urgency_level,
    })
    setShowRenewalModal(true)
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Action Items</h2>

        {hasAlerts ? (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isExpired = alert.days_until_expiration !== null && alert.days_until_expiration < 0
              const severityBadge = alert.urgency_level === "critical" || isExpired ? "Critical" : "Warning"
              const badgeColor =
                severityBadge === "Critical"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              const actionButtonColor =
                severityBadge === "Critical"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-foreground border border-border hover:bg-muted"

              const subtitle = [
                alert.jurisdiction,
                alert.license_number ? `#${alert.license_number}` : null,
                `Due ${new Date(alert.expiration_date).toLocaleDateString()}`,
              ]
                .filter(Boolean)
                .join(" • ")

              return (
                <div
                  key={alert.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white p-4"
                >
                  {/* Left: Severity Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium ${badgeColor}`}
                    >
                      {severityBadge}
                    </span>
                  </div>

                  {/* Middle: Alert Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      {alert.owner_name} - License expires in {Math.abs(alert.days_until_expiration || 0)} days
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewRenewal(alert)}
                      className={`rounded-md px-4 py-2 text-sm font-medium ${actionButtonColor}`}
                    >
                      Review & Renew
                    </button>
                    <button className="text-muted-foreground hover:text-foreground p-2">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-white p-6 text-center">
            <p className="text-sm text-muted-foreground">
              You're all caught up. Everything is on track. We will notify you here when items need attention.
            </p>
          </div>
        )}
      </div>

      {showRenewalModal && selectedLicense && (
        <RenewalStepsModal
          isOpen={showRenewalModal}
          onClose={() => {
            setShowRenewalModal(false)
            setSelectedLicense(null)
          }}
          license={selectedLicense}
        />
      )}
    </>
  )
}
