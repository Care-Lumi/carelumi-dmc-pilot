export interface Notification {
  id: string
  priority: "critical" | "warning" | "info"
  actionRequired?: boolean
  title: string
  details: string
  impact?: string
  actions: Array<{
    label: string
    type: "primary" | "secondary"
    onClick: () => void
  }>
}

export function calculateBadgeCount(notifications: Notification[]): number {
  return notifications.filter(
    (notif) => notif.priority === "critical" || (notif.priority === "warning" && notif.actionRequired === true),
  ).length
}

export function getNotificationData(demoState?: any, handlers?: NotificationHandlers): Notification[] {
  const baseNotifications: Notification[] = [
    {
      id: "1",
      priority: "critical",
      actionRequired: true,
      title: "Dr. Martinez - Can't see patients",
      details: "License expired 11/15/2025",
      actions: [
        {
          label: "Renew License",
          type: "primary",
          onClick: handlers?.onRenewLicense || (() => (window.location.href = "/staff")),
        },
        { label: "Override", type: "secondary", onClick: () => console.log("Override") },
      ],
    },
    {
      id: "2",
      priority: "critical",
      actionRequired: true,
      title: "Jane Smith, LCSW - Scheduling blocked",
      details: "Background check expired",
      actions: [
        {
          label: "Upload Document",
          type: "primary",
          onClick: handlers?.onUploadDocument || (() => (window.location.href = "/documents")),
        },
        { label: "Contact Staff", type: "secondary", onClick: () => console.log("Contact") },
      ],
    },
    {
      id: "3",
      priority: "warning",
      actionRequired: true,
      title: "John Davis - Block pending (3 days)",
      details: "CPR certification expires 11/22",
      actions: [
        {
          label: "Notify Staff",
          type: "primary",
          onClick: handlers?.onNotifyStaff || (() => alert("Notification sent to John Davis")),
        },
        { label: "Remind Me", type: "secondary", onClick: () => console.log("Remind Me") },
      ],
    },
    {
      id: "4",
      priority: "warning",
      actionRequired: true,
      title: "County Care - Re-attestation due in 7 days",
      details: "CAQH profile needs attestation",
      actions: [
        { label: "Attest Now", type: "primary", onClick: () => console.log("Attest") },
        { label: "Remind Me", type: "secondary", onClick: () => console.log("Remind") },
      ],
    },
    {
      id: "5",
      priority: "info",
      actionRequired: false,
      title: "New Provider: Jane Doe detected",
      details: "From Gusto sync - Confirm to start",
      actions: [
        { label: "Confirm", type: "primary", onClick: () => console.log("Confirm") },
        { label: "Ignore", type: "secondary", onClick: () => console.log("Ignore") },
      ],
    },
    {
      id: "6",
      priority: "info",
      actionRequired: false,
      title: "IL Medicaid - New telehealth rules",
      details: "Affects 15 staff members",
      actions: [
        { label: "View Details", type: "primary", onClick: () => console.log("View") },
        { label: "Dismiss", type: "secondary", onClick: () => console.log("Dismiss") },
      ],
    },
  ]

  if (demoState && !demoState.licenseSubmitted) {
    return [
      {
        id: "samuel-license",
        priority: "critical",
        actionRequired: true,
        title: "Samuel Osei Boateng - Can't practice soon",
        details: "Illinois OTA License expires 12/31/2025",
        actions: [
          {
            label: "Review & Renew",
            type: "primary",
            onClick: handlers?.onReviewRenew || (() => console.log("Review & Renew")),
          },
          { label: "Dismiss", type: "secondary", onClick: () => console.log("Dismiss") },
        ],
      },
      ...baseNotifications,
    ]
  }

  return baseNotifications
}

// Keep existing export for backwards compatibility
export const notificationData = getNotificationData()

export interface NotificationHandlers {
  onRenewLicense?: () => void
  onUploadDocument?: () => void
  onNotifyStaff?: () => void
  onReviewRenew?: () => void
}
