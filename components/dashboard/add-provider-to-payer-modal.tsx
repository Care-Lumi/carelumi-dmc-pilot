"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { staffMembers } from "@/lib/placeholder-data"

interface AddProviderToPayerModalProps {
  isOpen: boolean
  onClose: () => void
  payerName: string
}

export function AddProviderToPayerModal({ isOpen, onClose, payerName }: AddProviderToPayerModalProps) {
  const [selectedProvider, setSelectedProvider] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
      setSelectedProvider("")
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-foreground">Add Provider to {payerName}</h2>

        {showSuccess ? (
          <div className="my-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">Provider added successfully!</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Select a staff member to add to the {payerName} credentialing application.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Select Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a provider...</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.role}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProvider && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Provider Details</p>
                  {(() => {
                    const provider = staffMembers.find((s) => s.id === selectedProvider)
                    return provider ? (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Name: {provider.name}</p>
                        <p>Role: {provider.role}</p>
                        <p>Location: {provider.location}</p>
                        <p>License: {provider.licenses[0].type}</p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedProvider}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Add Provider
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
