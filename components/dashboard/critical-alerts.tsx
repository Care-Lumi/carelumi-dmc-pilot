"use client"

import { useRouter } from "next/navigation"

export function CriticalAlerts() {
  const router = useRouter()

  const samuelAlert = {
    id: "samuel-license",
    type: "error" as const,
    badge: "Critical",
    title: "Dr. Michael Chen - License Expiring in <60 Days",
    subtitle: "Illinois OTA License expires 12/31/2025",
    actionText: "Review & Renew",
    actionType: "primary" as const,
  }

  const otherAlerts = [
    {
      id: "regulatory-medicaid",
      type: "error" as const,
      badge: "Critical",
      title: "Illinois Medicaid - New Documentation Requirements",
      subtitle: "Effective 12/1/2025 • Affects 15 staff members at Chicago location",
      actionText: "View Details",
      actionType: "primary" as const,
    },
    {
      id: "county-care",
      type: "warning" as const,
      badge: "Warning",
      title: "County Care - Re-attestation due in 7 days",
      subtitle: "CAQH profile needs attestation",
      actionText: "Attest Now",
      actionType: "secondary" as const,
    },
  ]

  const alerts = [samuelAlert, ...otherAlerts]

  return (
    <div className="mt-8">
      <h2 className="text-[18px] font-semibold mb-4 text-[#333333]">Critical Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full font-semibold whitespace-nowrap text-xs ${
                alert.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : alert.type === "warning"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
              }
            `}
            >
              {alert.badge}
            </span>

            <div className="flex-1 min-w-0">
              <div className="font-semibold mb-1 text-gray-900 text-base">{alert.title}</div>
              <div className="text-gray-600 text-sm">{alert.subtitle}</div>
            </div>

            <button
              onClick={() => {
                if (alert.id === "samuel-license") {
                  router.push("/staff")
                } else if (alert.id === "county-care") {
                  alert("Attestation modal will be triggered")
                } else if (alert.id === "regulatory-medicaid") {
                  router.push("/regulatory")
                }
              }}
              className={`
                inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium 
                whitespace-nowrap transition-all
                ${
                  alert.actionType === "primary"
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {alert.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
