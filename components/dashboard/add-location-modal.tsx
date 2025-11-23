"use client"

import { useState } from "react"

interface AddLocationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLocationModal({ isOpen, onClose }: AddLocationModalProps) {
  const [syncMethod, setSyncMethod] = useState<"manual" | "system">("manual")
  const [addressInput, setAddressInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  if (!isOpen) return null

  // Mock Google Places autocomplete suggestions
  const mockSuggestions = [
    "123 Main St, Chicago, IL 60601",
    "123 Main Street, Springfield, IL 62701",
    "123 Main Ave, Naperville, IL 60540",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[700px] overflow-y-auto rounded-lg bg-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Add Location</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Sync Method Selection */}
        <div className="mb-6 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-gray-50">
            <input
              type="radio"
              name="syncMethod"
              value="manual"
              checked={syncMethod === "manual"}
              onChange={(e) => setSyncMethod(e.target.value as "manual")}
              className="h-4 w-4"
            />
            <div>
              <p className="font-medium text-foreground">Add Manually</p>
              <p className="text-sm text-muted-foreground">Enter location details with Google address auto-fill</p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-gray-50">
            <input
              type="radio"
              name="syncMethod"
              value="system"
              checked={syncMethod === "system"}
              onChange={(e) => setSyncMethod(e.target.value as "system")}
              className="h-4 w-4"
            />
            <div>
              <p className="font-medium text-foreground">Sync from Property Management System</p>
              <p className="text-sm text-muted-foreground">Import location from existing business systems</p>
            </div>
          </label>
        </div>

        {/* Manual Entry with Google Autocomplete */}
        {syncMethod === "manual" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Location Name *</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Chicago Main Office"
              />
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-foreground">Street Address *</label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value)
                  setShowSuggestions(e.target.value.length > 3)
                }}
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Start typing address..."
              />
              {showSuggestions && addressInput.length > 3 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
                  {mockSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAddressInput(suggestion)
                        setShowSuggestions(false)
                        // Would auto-fill city, state, zip
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-gray-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Powered by Google Places - Start typing to see suggestions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">City *</label>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Chicago"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">State *</label>
                <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select state</option>
                  <option value="IL">Illinois</option>
                  <option value="TX">Texas</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">ZIP Code *</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="60601"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Location Type</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select type</option>
                <option value="clinic">Clinic</option>
                <option value="office">Office</option>
                <option value="outreach">Outreach Center</option>
                <option value="telehealth">Telehealth Only</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="rounded-lg border border-border bg-gray-50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Next steps after adding location:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Upload facility licenses</li>
                <li>• Add safety inspection certificates</li>
                <li>• Assign staff to this location</li>
                <li>• Configure payer credentialing for this address</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Add Location
              </button>
            </div>
          </div>
        )}

        {/* System Sync Option */}
        {syncMethod === "system" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Select System</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Choose your property management system</option>
                <option value="quickbooks">QuickBooks</option>
                <option value="xero">Xero</option>
                <option value="lease">Lease Administration System</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="rounded-lg border border-border bg-gray-50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">What will be synced:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Location name and address</li>
                <li>• Property type</li>
                <li>• Contact information</li>
                <li>• Lease/occupancy details</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Note: Facility licenses and compliance documents must be uploaded separately
              </p>
            </div>

            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Connect & Import Location
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
