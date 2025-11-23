"use client"

import { useState } from "react"

interface AddPayerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPayerModal({ isOpen, onClose }: AddPayerModalProps) {
  const [syncMethod, setSyncMethod] = useState<"manual" | "database">("database")
  const [selectedPayer, setSelectedPayer] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[700px] overflow-y-auto rounded-lg bg-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Add Payer</h2>
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
              value="database"
              checked={syncMethod === "database"}
              onChange={(e) => setSyncMethod(e.target.value as "database")}
              className="h-4 w-4"
            />
            <div>
              <p className="font-medium text-foreground">Select from Payer Database</p>
              <p className="text-sm text-muted-foreground">
                Choose from our comprehensive payer database with pre-filled information
              </p>
            </div>
          </label>

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
              <p className="font-medium text-foreground">Add Custom Payer</p>
              <p className="text-sm text-muted-foreground">Manually enter payer information</p>
            </div>
          </label>
        </div>

        {/* Database Selection */}
        {syncMethod === "database" && (
          <div className="space-y-4">
            <div>
              
              
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Select Payer</label>
              <select
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a payer</option>
                <optgroup label="Illinois Medicaid MCOs">
                  <option value="county-care">County Care</option>
                  <option value="meridian">Meridian Health Plan</option>
                  <option value="molina">Molina Healthcare</option>
                  <option value="nextlevel">NextLevel Health</option>
                </optgroup>
                <optgroup label="Commercial Payers">
                  <option value="aetna">Aetna</option>
                  <option value="bcbs-il">Blue Cross Blue Shield of Illinois</option>
                  <option value="cigna">Cigna</option>
                  <option value="united">United Healthcare</option>
                </optgroup>
                <optgroup label="State Programs">
                  <option value="il-medicaid">Illinois Medicaid (Fee-for-Service)</option>
                </optgroup>
              </select>
            </div>

            {selectedPayer && (
              <div className="rounded-lg border border-border bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">CareLumi Collected this Information for You:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Payer name and contact information</li>
                  <li>• Credentialing portal URL</li>
                  <li>• Average turnaround time</li>
                  <li>• Required documentation checklist</li>
                  <li>• CAQH requirements (if applicable)</li>
                  <li>• Reimbursement rates (by service type)</li>
                </ul>
              </div>
            )}

            <button
              disabled={!selectedPayer}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Add Payer
            </button>
          </div>
        )}

        {/* Manual Entry Form */}
        {syncMethod === "manual" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Payer Name *</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter payer name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Payer Type *</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select type</option>
                <option value="medicaid-mco">Medicaid MCO</option>
                <option value="medicaid-ffs">Medicaid Fee-for-Service</option>
                <option value="commercial">Commercial Insurance</option>
                <option value="eap">Employee Assistance Program (EAP)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">State</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select state</option>
                <option value="IL">Illinois</option>
                <option value="TX">Texas</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Credentialing Portal URL</label>
              <input
                type="url"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://provider.payername.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Contact Phone</label>
              <input
                type="tel"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Contact Email</label>
              <input
                type="email"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="provider@payername.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="caqh-required" className="h-4 w-4" />
              <label htmlFor="caqh-required" className="text-sm text-foreground">
                CAQH profile required
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Add Payer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
