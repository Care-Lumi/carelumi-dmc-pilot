export type UrgencyLevel = "critical" | "high" | "medium" | "low"

export type DocumentWithDerivedFields = {
  is_valid_now: boolean
  days_until_expiration: number | null
  urgency_level: UrgencyLevel | null
}

export function decorateWithDerivedFields(doc: any): any {
  const now = new Date()
  const expirationDate = doc.expiration_date ? new Date(doc.expiration_date) : null

  let is_valid_now = true
  let days_until_expiration: number | null = null
  let urgency_level: UrgencyLevel | null = null

  if (expirationDate && !isNaN(expirationDate.getTime())) {
    const timeDiff = expirationDate.getTime() - now.getTime()
    days_until_expiration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    // Determine validity
    is_valid_now = days_until_expiration >= 0

    // Compute urgency level
    if (!is_valid_now) {
      urgency_level = "critical" // Already expired
    } else if (days_until_expiration <= 30) {
      urgency_level = "critical" // Expires within 30 days
    } else if (days_until_expiration <= 60) {
      urgency_level = "high" // Expires within 60 days
    } else if (days_until_expiration <= 90) {
      urgency_level = "medium" // Expires within 90 days
    } else {
      urgency_level = "low" // More than 90 days
    }
  }

  return {
    ...doc,
    is_valid_now,
    days_until_expiration,
    urgency_level,
  }
}
