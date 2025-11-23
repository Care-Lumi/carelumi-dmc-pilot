"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NewIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewIntegrationModal({ isOpen, onClose }: NewIntegrationModalProps) {
  const [integrationName, setIntegrationName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    // Simulate submission
    alert(
      `New integration request submitted:\nName: ${integrationName}\nCategory: ${category}\nDescription: ${description}`,
    )
    onClose()
    // Reset form
    setIntegrationName("")
    setCategory("")
    setDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request New Integration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Don't see the integration you need? Let us know and we'll work to add it to CareLumi.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Integration Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={integrationName}
                onChange={(e) => setIntegrationName(e.target.value)}
                placeholder="e.g., Epic Systems, Cerner"
                className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                <option value="practice_management">Practice Management / EHR</option>
                <option value="billing">Billing & Claims</option>
                <option value="credentialing">Credentialing & Verification</option>
                <option value="payer">Payer Portal Platforms</option>
                <option value="license">License Verification</option>
                <option value="document">Document Storage</option>
                <option value="hr">HR / Payroll</option>
                <option value="accounting">Accounting</option>
                <option value="communication">Communication</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description / Use Case</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us how this integration would help your workflow..."
                rows={4}
                className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!integrationName || !category}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
