// Custom tour implementation without external dependencies
export interface TourStep {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

export const tourSteps: TourStep[] = [
  {
    target: "location-selector",
    title: "View by location",
    description:
      "Use this dropdown to filter compliance data across your facilities. In this trial, all locations are combined into one view.",
    position: "bottom",
  },
  {
    target: "dashboard-metrics",
    title: "Your Compliance Control Hub",
    description:
      "These cards show real-time metrics for expiring licenses and credentialing status. As you upload documents, these numbers will update automatically.",
    position: "bottom",
  },
  {
    target: "critical-alerts",
    title: "Critical alerts",
    description:
      "When licenses are expiring soon or have expired, you'll see them here with renewal steps and timelines.",
    position: "bottom",
  },
  {
    target: "upload-documents",
    title: "Upload real documents",
    description:
      "Click here to upload staff licenses, payer contracts, or facility certifications. Our AI will extract key data like license numbers and expiration dates automatically.",
    position: "bottom",
  },
  {
    target: "staff-nav",
    title: "Staff licenses",
    description: "Track all your staff members' licenses, certifications, and renewal requirements in one place.",
    position: "right",
  },
  {
    target: "documents-nav",
    title: "Documents & reports",
    description:
      "View, filter, and download all uploaded documents. Mark historical versions and track compliance over time.",
    position: "right",
  },
  {
    target: "search-bar",
    title: "Global search",
    description:
      "After upgrade, this becomes AI-powered search integrated with Clip. Search is not active in the trial.",
    position: "bottom",
  },
  {
    target: "clip-trigger",
    title: "Clip, your AI assistant",
    description:
      "Clip can answer high-level questions and point you to the right place in CareLumi – but it doesn't read your uploaded documents in this free trial.",
    position: "top",
  },
]
