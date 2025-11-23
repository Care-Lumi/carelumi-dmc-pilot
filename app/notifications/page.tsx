"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { getNotificationData } from "@/lib/notification-utils"

const priorityConfig = {
  critical: {
    icon: "🔴",
    bg: "bg-[#fef2f2]",
    borderColor: "border-l-red-500",
  },
  warning: {
    icon: "🟡",
    bg: "bg-[#fffbeb]",
    borderColor: "border-l-yellow-500",
  },
  info: {
    icon: "🔵",
    bg: "bg-[#eff6ff]",
    borderColor: "border-l-blue-500",
  },
}

type TabType = "all" | "action-required" | "updates"

function NotificationsContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const notifications = getNotificationData()

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "action-required") return notif.priority === "critical" || notif.priority === "warning"
    if (activeTab === "updates") return notif.priority === "info"
    return true
  })

  const tabs: Array<{ id: TabType; label: string; count: number }> = [
    { id: "all", label: "All", count: notifications.length },
    {
      id: "action-required",
      label: "Action Required",
      count: notifications.filter((n) => n.priority === "critical" || n.priority === "warning").length,
    },
    { id: "updates", label: "Updates", count: notifications.filter((n) => n.priority === "info").length },
  ]

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-16 pl-60 bg-background">
      <div className="p-6 bg-background">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-[#333333]">Notifications</h1>
          <p className="text-sm text-[#6b7280] mt-1">Stay updated on critical actions and system updates</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#e5e7eb]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-[14px] font-medium transition-colors relative ${
                activeTab === tab.id ? "text-[#3b82f6]" : "text-[#6b7280] hover:text-[#333333]"
              }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]" />}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const config = priorityConfig[notif.priority]

            return (
              <Card key={notif.id} className={`border-l-4 ${config.borderColor} ${config.bg}`}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Priority Icon */}
                    <div className="text-[20px] shrink-0 mt-1">{config.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-[15px] font-semibold text-[#333333] mb-1">{notif.title}</h3>
                          <p className="text-[14px] text-[#6b7280]">{notif.details}</p>
                        </div>
                        <button className="p-1 hover:bg-white/50 rounded-md transition-colors shrink-0">
                          <MoreVertical className="w-4 h-4 text-[#6b7280]" />
                        </button>
                      </div>

                      {notif.impact && (
                        <div className="text-[14px] text-[#333333] font-medium mb-4 bg-white/50 px-3 py-2 rounded-md">
                          {notif.impact}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        {notif.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            onClick={action.onClick}
                            variant={action.type === "primary" ? "default" : "outline"}
                            size="sm"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return <NotificationsContent />
}
