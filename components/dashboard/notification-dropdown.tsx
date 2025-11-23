"use client"

import { useState } from "react"
import { X } from "lucide-react"

const priorityConfig = {
  critical: {
    dot: "bg-red-500",
    bg: "bg-red-50",
  },
  warning: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
  },
  info: {
    dot: "bg-blue-500",
    bg: "bg-blue-50",
  },
}

type TabType = "action-required" | "updates"

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications: any[]
  onRenewLicense?: () => void
  onUploadDocument?: () => void
  onNotifyStaff?: () => void
  onReviewRenew?: () => void
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onRenewLicense,
  onUploadDocument,
  onNotifyStaff,
  onReviewRenew,
}: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<TabType>("action-required")

  if (!isOpen) return null

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "action-required") return notif.priority === "critical" || notif.priority === "warning"
    if (activeTab === "updates") return notif.priority === "info"
    return true
  })

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "action-required", label: "Action Required" },
    { id: "updates", label: "Updates" },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="fixed top-[64px] right-6 z-50 w-[420px] max-h-[600px] bg-white border border-border rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
          <div className="flex items-center gap-4">
            <a href="/notifications" className="text-primary text-xs font-medium hover:underline">
              View All →
            </a>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-[460px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No notifications</div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const config = priorityConfig[notif.priority]

              return (
                <div key={notif.id}>
                  <div className={`p-4 ${config.bg}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0 mt-2`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-1">{notif.title}</div>
                        <div className="text-sm text-muted-foreground mb-3">{notif.details}</div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {notif.actions
                            .filter((action: any) => action.type === "primary")
                            .map((action: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={action.onClick}
                                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                {action.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < filteredNotifications.length - 1 && <div className="border-b border-border" />}
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
